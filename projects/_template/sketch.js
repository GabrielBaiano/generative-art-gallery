/* ============================================
   NOME_DO_PROJETO — Sketch
   ============================================
   Ponto de entrada do projeto.
   Edite este arquivo para criar sua arte.
   ============================================ */

import { downloadCanvas, downloadCanvasHD } from '../../common/js/download.js';
import { createButton, createControlsPanel, createSeparator } from '../../common/js/ui.js';

// ---------- Setup ----------
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ---------- Parâmetros ----------
const params = {
  // Adicione seus parâmetros aqui
  // exemplo: density: 50,
};

// ---------- Controles ----------
const panel = createControlsPanel('NOME_DO_PROJETO');

// Exemplo de slider:
// import { createSlider } from '../../common/js/ui.js';
// panel.addControl(createSlider('Densidade', {
//   min: 1, max: 200, value: params.density,
//   onChange: (v) => { params.density = v; draw(); }
// }));

panel.addControl(createSeparator());

panel.addControl(createButton('Salvar Imagem', () => {
  downloadCanvas(canvas, 'NOME_DO_PROJETO');
}, { variant: 'secondary', icon: '💾' }));

panel.addControl(createButton('Salvar HD (4K)', () => {
  downloadCanvasHD(canvas, 'NOME_DO_PROJETO-hd', 4096);
}, { variant: 'primary', icon: '🖼️' }));

document.body.appendChild(panel);

// ---------- Desenho ----------
function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ✏️ Seu código de arte generativa aqui!

}

// ---------- Loop (descomente se precisar de animação) ----------
// function animate() {
//   draw();
//   requestAnimationFrame(animate);
// }
// animate();

// Desenho estático inicial
draw();
