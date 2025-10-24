# rst.js

`rst.js` is a lightweight and extensible TypeScript library for lexing, parsing, and rendering ReStructuredText (`.rst`) into HTML. It's built with a modular architecture, allowing you to use its components individually or together to render `.rst` documents.

This library is ideal for anyone needing to process `.rst` files in a web environment, whether for a static site generator, a documentation tool, or a content management system.

## Features

- **Line-Oriented Lexer**: Efficiently tokenizes `.rst` input line by line, handling indentation and complex structures.
- **AST Parser**: Builds an Abstract Syntax Tree (AST) from the lexer's tokens, providing a structured representation of the document.
- **Extensible HTML Renderer**: Renders the AST to clean, semantic HTML. You can provide custom rendering functions to override the default output for any element.
- **TypeScript Support**: Written entirely in TypeScript, providing strong typing for all components.
- **Multi-Pass Architecture**: Accurately handles features requiring whole-document context, like footnotes and internal references.

## Installation

Install the package using npm:

```bash
npm install rst.js
```

## Basic Usage

The simplest way to use the library is with the `renderRst` function, which handles the entire lexing, parsing, and rendering pipeline.

```typescript
import { renderRst } from 'rst.js';

const rstContent = `
Hello, World!
=============

This is a simple paragraph.

- A list item
- Another list item
`;

const htmlOutput = renderRst(rstContent);
console.log(htmlOutput);
```

This will produce the following HTML:

```html
<section id="hello-world">
<h1>Hello, World!</h1>
<p>This is a simple paragraph.</p>
<ul>
<li>A list item</li>
<li>Another list item</li>
</ul>
</section>
```

## Advanced Usage

For more control over the rendering process, you can use the `Lexer`, `Parser`, and `HtmlRenderer` classes separately. This is useful for debugging, modifying the AST, or creating custom renderers.

### Customizing the Renderer

You can extend the `HtmlRenderer` to customize the output for specific AST nodes. For example, to render paragraphs with a custom CSS class:

```typescript
import { Lexer, Parser, HtmlRenderer, renderRst, CustomRenderers } from 'rst.js';

const rstContent = `
A paragraph.
`;

const customRenderers: CustomRenderers = {
    ParagraphNode: (node) => {
        return `<p class="my-custom-paragraph">${node.value}</p>\\n`;
    },
};

const htmlOutput = renderRst(rstContent, { customRenderers });
console.log(htmlOutput);
// Output: <p class="my-custom-paragraph">A paragraph.</p>
```

## Architecture

The library is composed of three main stages:

1.  **Lexer (`src/core/lexer.ts`)**: Takes a raw `.rst` string and breaks it down into a stream of tokens (e.g., `Title`, `Paragraph`, `ListItem`).
2.  **Parser (`src/core/parser.ts`)**: Consumes the token stream to build an Abstract Syntax Tree (AST), which is a hierarchical representation of the document's structure.
3.  **Renderer (`src/rendering/renderer.ts`)**: Traverses the AST and generates the final HTML output.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue on our [GitHub repository](https://github.com/Vyst-inc/rst.js/issues).

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
