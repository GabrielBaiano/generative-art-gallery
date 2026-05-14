/**
 * SCRIBBLE
 * Generative Art Piece
 */

import { createControlsPanel, createSlider, createButton, createSeparator } from '../../common/js/ui.js';
import { downloadCanvas, downloadCanvasHD } from '../../common/js/download.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// --- Configuration ---
const settings = {
  iterations: 1200,
  minSegments: 20,
  maxSegments: 80,
  spread: 80,
  stepSize: 25,
  curveTightness: 40,
  lineWidthMin: 1,
  lineWidthMax: 3,
  opacity: 0.6,
  palette: [
    "#ff69b4",
    "#ff9ed6",
    "#5c7cfa",
    "#7b9acc",
    "#111111",
    "#d1d1d1"
  ]
};

// --- Initialization ---
function init() {
  resize();
  setupUI();
  draw();
  
  window.addEventListener("resize", () => {
    resize();
    draw();
  });
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// --- Core Drawing Logic ---
function drawLineCluster() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < settings.iterations; i++) {
    ctx.beginPath();

    let x = centerX + rand(-settings.spread, settings.spread);
    let y = centerY + rand(-settings.spread, settings.spread);

    ctx.moveTo(x, y);

    const segments = rand(settings.minSegments, settings.maxSegments);

    for (let j = 0; j < segments; j++) {
      x += rand(-settings.stepSize, settings.stepSize);
      y += rand(-settings.stepSize, settings.stepSize);

      // Organic curve
      const cx = x + rand(-settings.curveTightness, settings.curveTightness);
      const cy = y + rand(-settings.curveTightness, settings.curveTightness);

      ctx.quadraticCurveTo(cx, cy, x, y);
    }

    ctx.strokeStyle = settings.palette[Math.floor(rand(0, settings.palette.length))];
    ctx.lineWidth = rand(settings.lineWidthMin, settings.lineWidthMax);
    ctx.globalAlpha = rand(settings.opacity * 0.5, settings.opacity * 1.5);

    ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background - Mudado para branco puro
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawLineCluster();

  // Aplica o grão diretamente no canvas para que saia na exportação
  drawGrain(ctx, canvas.width, canvas.height);
}

/**
 * Adiciona uma textura de ruído sutil diretamente nos pixels do canvas.
 * Isso garante que a estética "premium" se mantenha no arquivo exportado.
 */
function drawGrain(context, w, h) {
  context.save();
  const grainAmount = 0.05;
  for (let i = 0; i < 10000; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const size = Math.random() * 1.5;
    context.fillStyle = `rgba(0, 0, 0, ${Math.random() * grainAmount})`;
    context.fillRect(x, y, size, size);
  }
  context.restore();
}

// --- UI Setup ---
function setupUI() {
  const panel = createControlsPanel("Scribble Params");

  panel.addControl(createSlider("Iterations", {
    min: 100, max: 3000, value: settings.iterations, step: 100,
    onChange: (val) => { settings.iterations = val; draw(); }
  }));

  panel.addControl(createSlider("Spread", {
    min: 10, max: 500, value: settings.spread,
    onChange: (val) => { settings.spread = val; draw(); }
  }));

  panel.addControl(createSlider("Curve", {
    min: 0, max: 100, value: settings.curveTightness,
    onChange: (val) => { settings.curveTightness = val; draw(); }
  }));

  panel.addControl(createSlider("Opacity", {
    min: 0.1, max: 1.0, value: settings.opacity, step: 0.05,
    onChange: (val) => { settings.opacity = val; draw(); }
  }));

  panel.addControl(createSeparator());

  panel.addControl(createButton("Redraw", () => draw(), { icon: "🔄" }));
  
  panel.addControl(createButton("Save PNG", () => downloadCanvas(canvas, "scribble"), { 
    variant: "secondary", icon: "💾" 
  }));

  panel.addControl(createButton("Save HD (4K)", () => downloadCanvasHD(canvas, "scribble-hd", 4096), { 
    variant: "primary", icon: "🖼️" 
  }));

  document.body.appendChild(panel);
}

// Start
init();
