/* ============================================
   Attractor — Sketch
   ============================================
   Padrão generativo baseado em sobreposição
   aditiva de curvas Bézier tracejadas com
   colorização via LUT (Lookup Table).
   
   Referência: Chris Mccully
   ============================================ */

import { downloadCanvas } from '../../common/js/download.js';

// --- LUT Palettes ---
const LUT_PALETTES = {
  neon:  ['#000000', '#0a092d', '#2e1437', '#942b4d', '#e94e34', '#f1a83a', '#ffffff'],
  fire:  ['#000000', '#2a0845', '#900c3f', '#ff5733', '#ffc300', '#ffffff'],
  ocean: ['#000000', '#001524', '#073B4C', '#118AB2', '#06D6A0', '#ffffff'],
  gold:  ['#000000', '#1A1A1A', '#4A3B1C', '#A67C00', '#F2C94C', '#FFFFFF'],
  mono:  ['#000000', '#222222', '#555555', '#aaaaaa', '#ffffff'],
};

// --- DOM ---
const loading      = document.getElementById('loading');
const paletteSelect = document.getElementById('paletteSelect');
const stackSlider   = document.getElementById('stackSlider');
const stackValue    = document.getElementById('stackValue');
const btnGenerate   = document.getElementById('btn-generate');
const btnSave       = document.getElementById('btn-save');

let p5Canvas;
let isGenerating = false;

// --- Events ---
stackSlider.addEventListener('input', () => {
  stackValue.textContent = stackSlider.value;
});

paletteSelect.addEventListener('change', () => triggerGeneration());
btnGenerate.addEventListener('click', () => triggerGeneration());

btnSave.addEventListener('click', () => {
  if (!p5Canvas) return;
  const palette = paletteSelect.value;
  const timestamp = Date.now();
  downloadCanvas(
    document.querySelector('#canvas-wrapper canvas'),
    `attractor-${palette}-${timestamp}`
  );
});

// --- Generation Control ---
function triggerGeneration() {
  if (isGenerating) return;
  isGenerating = true;
  loading.classList.add('visible');

  // Yield para que o overlay renderize antes do cálculo pesado
  setTimeout(() => {
    generateArt();
    loading.classList.remove('visible');
    isGenerating = false;
  }, 60);
}

// Expor para o onclick inline (fallback)
window.triggerGeneration = triggerGeneration;

// --- p5.js ---
window.setup = function () {
  p5Canvas = createCanvas(600, 600);
  p5Canvas.parent('canvas-wrapper');
  pixelDensity(1);
  noLoop();
  setTimeout(triggerGeneration, 200);
};

function generateArt() {
  background(0);
  blendMode(ADD);
  noFill();

  const stacks = parseInt(stackSlider.value);
  const angles = [0, PI / 2, PI, (3 * PI) / 2];

  // Offset central com variação aleatória
  const mainOffsetX = random(-120, 120);
  const mainOffsetY = random(50, 250);

  for (let i = 0; i < stacks; i++) {
    const layerOffsetX = mainOffsetX + random(-10, 10);
    const layerOffsetY = mainOffsetY + random(-10, 10);

    angles.forEach((angle) => {
      push();
      translate(width / 2, height / 2);
      rotate(angle);
      translate(0, -height / 2 + 20);

      // Traços interrompidos aleatórios
      const dashPattern = [
        random(2, 20),
        random(2, 10),
        random(5, 30),
        random(2, 10),
      ];
      drawingContext.setLineDash(dashPattern);
      drawingContext.lineDashOffset = random(100);

      stroke(255, 12);
      strokeWeight(random(0.5, 2));

      const numLines = 60;
      const baseWidth = width * 0.7;

      for (let j = 0; j < numLines; j++) {
        const startX = map(j, 0, numLines, -baseWidth / 2, baseWidth / 2);
        const cp1x = startX * 0.6;
        const cp1y = layerOffsetY * 0.4;
        const cp2x = layerOffsetX * 0.8;
        const cp2y = layerOffsetY * 0.7;

        bezier(startX, 0, cp1x, cp1y, cp2x, cp2y, layerOffsetX, layerOffsetY);
      }
      pop();
    });
  }

  drawingContext.setLineDash([]);
  blendMode(BLEND);

  // Aplicar LUT
  applyLUT();
}

function applyLUT() {
  const palette = LUT_PALETTES[paletteSelect.value];
  const colorScale = chroma.scale(palette).mode('lch').domain([0, 180]);

  // Pré-computar LUT (256 entradas)
  const lut = new Array(256);
  for (let i = 0; i <= 255; i++) {
    lut[i] = colorScale(i).rgb();
  }

  // Substituir pixels
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    const brightness = pixels[i];
    const mapped = lut[brightness];
    pixels[i]     = mapped[0];
    pixels[i + 1] = mapped[1];
    pixels[i + 2] = mapped[2];
  }
  updatePixels();
}
