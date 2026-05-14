# 🎨 Generative Art Gallery

Coleção de mini-projetos de arte generativa usando HTML, CSS e JavaScript.

Cada projeto explora um padrão ou algoritmo diferente para criação de arte procedural.

## 📁 Estrutura

```
generative-art-gallery/
├── projects/                    # Mini-projetos de arte generativa
│   └── _template/               # Template para novos projetos
├── common/                      # Componentes reutilizáveis
│   ├── css/                     # Estilos compartilhados
│   │   └── base.css             # Reset + variáveis globais
│   ├── js/                      # Scripts compartilhados
│   │   ├── download.js          # Utilitário para salvar canvas como imagem
│   │   └── ui.js                # Componentes de UI (botões, controles)
│   └── components/              # Componentes HTML reutilizáveis
│       └── controls-panel.html  # Painel de controles padrão
├── output/                      # Resultados exportados
│   ├── images/                  # Imagens geradas (.png, .jpg)
│   └── videos/                  # Vídeos/GIFs exportados
└── README.md
```

## 🚀 Como usar

### Criar um novo projeto

1. Copie a pasta `projects/_template/` e renomeie
2. Edite o `index.html` do seu novo projeto
3. Os componentes comuns já estão linkados no template

### Componentes disponíveis

- **`common/js/download.js`** — Função para baixar o canvas em alta resolução (até 4K)
- **`common/js/ui.js`** — Botões estilizados e painel de controles
- **`common/css/base.css`** — Reset CSS + variáveis de design + tema escuro

### Salvar resultados

Use o botão "Salvar Imagem" no painel de controles, ou chame:

```js
import { downloadCanvas } from '../../common/js/download.js';
downloadCanvas(canvas, 'minha-arte', 4096); // nome, resolução
```

## 📝 Projetos

| # | Nome | Descrição | Preview |
|---|------|-----------|---------|
| — | _template | Template base para novos projetos | — |

> Atualize esta tabela conforme criar novos projetos!

## 🛠️ Tecnologias

- HTML5 Canvas / SVG
- JavaScript (ES Modules)
- CSS3
- Sem frameworks — tudo vanilla para máxima flexibilidade
