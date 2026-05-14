/* ============================================
   GENERATIVE ART GALLERY — Download Utility
   ============================================
   Funções para exportar canvas como imagem
   em alta resolução.

   Uso:
     import { downloadCanvas, downloadCanvasHD } from '../../common/js/download.js';
     downloadCanvas(canvas, 'minha-arte');
     downloadCanvasHD(canvas, 'minha-arte', 4096);
   ============================================ */

/**
 * Baixa o conteúdo de um canvas como imagem PNG.
 *
 * @param {HTMLCanvasElement} canvas - O canvas a ser exportado
 * @param {string} [filename='generative-art'] - Nome do arquivo (sem extensão)
 * @param {string} [format='image/png'] - Formato MIME ('image/png' ou 'image/jpeg')
 * @param {number} [quality=1.0] - Qualidade (0-1, só para JPEG)
 */
export function downloadCanvas(canvas, filename = 'generative-art', format = 'image/png', quality = 1.0) {
  const link = document.createElement('a');
  link.download = `${filename}.${format === 'image/jpeg' ? 'jpg' : 'png'}`;
  link.href = canvas.toDataURL(format, quality);
  link.click();
}

/**
 * Baixa o canvas em alta resolução (upscale).
 * Cria um canvas temporário com a resolução desejada,
 * redesenha o conteúdo e exporta.
 *
 * @param {HTMLCanvasElement} sourceCanvas - Canvas original
 * @param {string} [filename='generative-art-hd'] - Nome do arquivo
 * @param {number} [targetSize=4096] - Tamanho do lado maior em pixels
 * @param {string} [format='image/png'] - Formato MIME
 * @param {number} [quality=1.0] - Qualidade (0-1, só para JPEG)
 */
export function downloadCanvasHD(sourceCanvas, filename = 'generative-art-hd', targetSize = 4096, format = 'image/png', quality = 1.0) {
  const aspectRatio = sourceCanvas.width / sourceCanvas.height;

  let width, height;
  if (aspectRatio >= 1) {
    width = targetSize;
    height = Math.round(targetSize / aspectRatio);
  } else {
    height = targetSize;
    width = Math.round(targetSize * aspectRatio);
  }

  const hdCanvas = document.createElement('canvas');
  hdCanvas.width = width;
  hdCanvas.height = height;

  const ctx = hdCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(sourceCanvas, 0, 0, width, height);

  downloadCanvas(hdCanvas, filename, format, quality);
}

/**
 * Baixa o canvas re-renderizando a arte em alta resolução.
 * Usa uma função de desenho customizada para máxima qualidade.
 *
 * @param {Function} drawFunction - Função que recebe (ctx, width, height) e desenha a arte
 * @param {number} [width=4096] - Largura em pixels
 * @param {number} [height=4096] - Altura em pixels
 * @param {string} [filename='generative-art-hires'] - Nome do arquivo
 * @param {string} [format='image/png'] - Formato MIME
 * @param {number} [quality=1.0] - Qualidade
 */
export function downloadRendered(drawFunction, width = 4096, height = 4096, filename = 'generative-art-hires', format = 'image/png', quality = 1.0) {
  const hdCanvas = document.createElement('canvas');
  hdCanvas.width = width;
  hdCanvas.height = height;

  const ctx = hdCanvas.getContext('2d');
  drawFunction(ctx, width, height);

  downloadCanvas(hdCanvas, filename, format, quality);
}

/**
 * Captura um frame de um canvas com animação.
 * Pausa a animação, captura, e retorna.
 *
 * @param {HTMLCanvasElement} canvas - Canvas a capturar
 * @param {string} [filename] - Nome do arquivo
 */
export function captureFrame(canvas, filename) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  downloadCanvas(canvas, filename || `frame-${timestamp}`);
}
