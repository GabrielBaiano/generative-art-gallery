/* ============================================
   GENERATIVE ART GALLERY — UI Components
   ============================================
   Componentes de UI reutilizáveis para os projetos.

   Uso:
     import { createButton, createControlsPanel, createSlider } from '../../common/js/ui.js';
   ============================================ */

/**
 * Cria um botão estilizado.
 *
 * @param {string} label - Texto do botão
 * @param {Function} onClick - Callback ao clicar
 * @param {Object} [options] - Opções adicionais
 * @param {string} [options.variant='primary'] - 'primary' | 'secondary' | 'ghost' | 'danger'
 * @param {string} [options.icon] - Emoji ou ícone antes do texto
 * @param {string} [options.id] - ID do elemento
 * @returns {HTMLButtonElement}
 */
export function createButton(label, onClick, options = {}) {
  const { variant = 'primary', icon = '', id = '' } = options;

  const btn = document.createElement('button');
  btn.className = `gen-btn gen-btn--${variant}`;
  btn.innerHTML = icon ? `<span class="gen-btn__icon">${icon}</span> ${label}` : label;
  btn.addEventListener('click', onClick);

  if (id) btn.id = id;

  return btn;
}

/**
 * Cria um slider (range input) com label e valor atual.
 *
 * @param {string} label - Label do slider
 * @param {Object} options - Configuração
 * @param {number} options.min - Valor mínimo
 * @param {number} options.max - Valor máximo
 * @param {number} options.value - Valor inicial
 * @param {number} [options.step=1] - Passo
 * @param {Function} options.onChange - Callback com o novo valor
 * @param {string} [options.id] - ID do input
 * @returns {HTMLDivElement}
 */
export function createSlider(label, options = {}) {
  const { min = 0, max = 100, value = 50, step = 1, onChange, id = '' } = options;

  const wrapper = document.createElement('div');
  wrapper.className = 'gen-slider';

  const labelEl = document.createElement('label');
  labelEl.className = 'gen-slider__label';

  const nameSpan = document.createElement('span');
  nameSpan.textContent = label;

  const valueSpan = document.createElement('span');
  valueSpan.className = 'gen-slider__value';
  valueSpan.textContent = value;

  labelEl.append(nameSpan, valueSpan);

  const input = document.createElement('input');
  input.type = 'range';
  input.className = 'gen-slider__input';
  input.min = min;
  input.max = max;
  input.value = value;
  input.step = step;
  if (id) input.id = id;

  input.addEventListener('input', () => {
    valueSpan.textContent = input.value;
    if (onChange) onChange(parseFloat(input.value));
  });

  wrapper.append(labelEl, input);
  return wrapper;
}

/**
 * Cria um painel de controles flutuante.
 *
 * @param {string} title - Título do painel
 * @param {Object} [options] - Opções
 * @param {string} [options.position='top-right'] - Posição: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
 * @param {boolean} [options.collapsible=true] - Se pode colapsar
 * @returns {HTMLDivElement} - O painel. Use .appendChild() para adicionar controles.
 */
export function createControlsPanel(title = 'Controles', options = {}) {
  const { position = 'top-right', collapsible = true } = options;

  const panel = document.createElement('div');
  panel.className = `gen-panel gen-panel--${position}`;

  // Header
  const header = document.createElement('div');
  header.className = 'gen-panel__header';

  const titleEl = document.createElement('h3');
  titleEl.className = 'gen-panel__title';
  titleEl.textContent = title;

  header.appendChild(titleEl);

  if (collapsible) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'gen-panel__toggle';
    toggleBtn.textContent = '−';
    toggleBtn.addEventListener('click', () => {
      const content = panel.querySelector('.gen-panel__content');
      const isCollapsed = content.style.display === 'none';
      content.style.display = isCollapsed ? '' : 'none';
      toggleBtn.textContent = isCollapsed ? '−' : '+';
    });
    header.appendChild(toggleBtn);
  }

  const content = document.createElement('div');
  content.className = 'gen-panel__content';

  panel.append(header, content);

  // Proxy para appendChild ir direto no content
  const originalAppendChild = panel.appendChild.bind(panel);
  panel.addControl = (el) => {
    content.appendChild(el);
    return panel;
  };

  return panel;
}

/**
 * Cria um separador visual no painel de controles.
 * @returns {HTMLHRElement}
 */
export function createSeparator() {
  const hr = document.createElement('hr');
  hr.className = 'gen-separator';
  return hr;
}

/**
 * Cria um grupo de botões de opção (toggle group).
 *
 * @param {string} label - Label do grupo
 * @param {string[]} optionsList - Lista de opções
 * @param {Function} onChange - Callback com a opção selecionada
 * @param {string} [defaultValue] - Valor padrão
 * @returns {HTMLDivElement}
 */
export function createToggleGroup(label, optionsList, onChange, defaultValue) {
  const wrapper = document.createElement('div');
  wrapper.className = 'gen-toggle-group';

  const labelEl = document.createElement('label');
  labelEl.className = 'gen-toggle-group__label';
  labelEl.textContent = label;

  const group = document.createElement('div');
  group.className = 'gen-toggle-group__buttons';

  optionsList.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'gen-toggle-group__btn';
    btn.textContent = opt;
    if (opt === defaultValue) btn.classList.add('active');

    btn.addEventListener('click', () => {
      group.querySelectorAll('.gen-toggle-group__btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (onChange) onChange(opt);
    });

    group.appendChild(btn);
  });

  wrapper.append(labelEl, group);
  return wrapper;
}

/* ============================================
   Injeta os estilos dos componentes no DOM
   (só executa uma vez)
   ============================================ */
function injectStyles() {
  if (document.getElementById('gen-ui-styles')) return;

  const style = document.createElement('style');
  style.id = 'gen-ui-styles';
  style.textContent = `
    /* ---------- Botões ---------- */
    .gen-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.25rem;
      font-family: var(--font-body, 'Inter', system-ui, sans-serif);
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid transparent;
      border-radius: var(--radius-md, 8px);
      cursor: pointer;
      transition: all 200ms ease;
      white-space: nowrap;
      user-select: none;
    }

    .gen-btn:active {
      transform: scale(0.97);
    }

    .gen-btn--primary {
      background: var(--color-accent, #7c5cfc);
      color: #fff;
    }
    .gen-btn--primary:hover {
      background: var(--color-accent-hover, #9b80ff);
      box-shadow: 0 0 20px rgba(124, 92, 252, 0.3);
    }

    .gen-btn--secondary {
      background: var(--color-surface, #13131a);
      color: var(--color-text, #e8e8f0);
      border-color: var(--color-border, #2a2a3a);
    }
    .gen-btn--secondary:hover {
      background: var(--color-surface-hover, #1c1c28);
      border-color: var(--color-accent, #7c5cfc);
    }

    .gen-btn--ghost {
      background: transparent;
      color: var(--color-text-muted, #8888a0);
    }
    .gen-btn--ghost:hover {
      color: var(--color-text, #e8e8f0);
      background: rgba(255, 255, 255, 0.05);
    }

    .gen-btn--danger {
      background: var(--color-danger, #f87171);
      color: #fff;
    }
    .gen-btn--danger:hover {
      background: #ef4444;
    }

    .gen-btn__icon {
      font-size: 1.1em;
    }

    /* ---------- Painel de Controles ---------- */
    .gen-panel {
      position: fixed;
      z-index: 1000;
      min-width: 260px;
      max-width: 320px;
      background: rgba(19, 19, 26, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--color-border, #2a2a3a);
      border-radius: var(--radius-lg, 12px);
      box-shadow: var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.6));
      overflow: hidden;
    }

    .gen-panel--top-right    { top: 1rem; right: 1rem; }
    .gen-panel--top-left     { top: 1rem; left: 1rem; }
    .gen-panel--bottom-right { bottom: 1rem; right: 1rem; }
    .gen-panel--bottom-left  { bottom: 1rem; left: 1rem; }

    .gen-panel__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--color-border, #2a2a3a);
    }

    .gen-panel__title {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-text-muted, #8888a0);
    }

    .gen-panel__toggle {
      background: none;
      border: none;
      color: var(--color-text-muted, #8888a0);
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0 0.25rem;
      line-height: 1;
    }
    .gen-panel__toggle:hover {
      color: var(--color-text, #e8e8f0);
    }

    .gen-panel__content {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    /* ---------- Slider ---------- */
    .gen-slider__label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: var(--color-text-muted, #8888a0);
      margin-bottom: 0.35rem;
    }

    .gen-slider__value {
      font-family: var(--font-mono, monospace);
      color: var(--color-text, #e8e8f0);
      font-size: 0.8rem;
    }

    .gen-slider__input {
      width: 100%;
      height: 4px;
      -webkit-appearance: none;
      appearance: none;
      background: var(--color-border, #2a2a3a);
      border-radius: 2px;
      outline: none;
    }

    .gen-slider__input::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--color-accent, #7c5cfc);
      cursor: pointer;
      transition: box-shadow 200ms ease;
    }

    .gen-slider__input::-webkit-slider-thumb:hover {
      box-shadow: 0 0 10px rgba(124, 92, 252, 0.5);
    }

    /* ---------- Separator ---------- */
    .gen-separator {
      border: none;
      border-top: 1px solid var(--color-border, #2a2a3a);
      margin: 0.25rem 0;
    }

    /* ---------- Toggle Group ---------- */
    .gen-toggle-group__label {
      display: block;
      font-size: 0.8rem;
      color: var(--color-text-muted, #8888a0);
      margin-bottom: 0.35rem;
    }

    .gen-toggle-group__buttons {
      display: flex;
      gap: 0;
      border: 1px solid var(--color-border, #2a2a3a);
      border-radius: var(--radius-md, 8px);
      overflow: hidden;
    }

    .gen-toggle-group__btn {
      flex: 1;
      padding: 0.4rem 0.75rem;
      font-size: 0.75rem;
      font-family: var(--font-body, system-ui, sans-serif);
      background: transparent;
      color: var(--color-text-muted, #8888a0);
      border: none;
      border-right: 1px solid var(--color-border, #2a2a3a);
      cursor: pointer;
      transition: all 200ms ease;
    }

    .gen-toggle-group__btn:last-child {
      border-right: none;
    }

    .gen-toggle-group__btn:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--color-text, #e8e8f0);
    }

    .gen-toggle-group__btn.active {
      background: var(--color-accent, #7c5cfc);
      color: #fff;
    }
  `;
  document.head.appendChild(style);
}

// Auto-injetar estilos quando o módulo é importado
injectStyles();
