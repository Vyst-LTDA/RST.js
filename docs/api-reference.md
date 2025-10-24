# API Reference

This document provides a detailed reference for the public API of `rst.js`.

## Top-Level Function

### `renderRst(rst, [options])`

This is the main function and the recommended way to render `.rst` content. It orchestrates the entire lexing, parsing, and rendering pipeline.

-   **`rst: string`**: The raw ReStructuredText string to be rendered.
-   **`options?: RenderOptions`**: An optional object for configuring the rendering process.

**`RenderOptions` Interface:**

-   **`customRenderers?: CustomRenderers`**: An object where keys are AST node type names (e.g., `ParagraphNode`, `TitleNode`) and values are custom rendering functions.

**Returns:** `string` - The rendered HTML.

**Example:**

```typescript
import { renderRst } from 'rst.js';

const rst = "A paragraph.";
const html = renderRst(rst);
```

## Core Classes

### `Lexer`

The `Lexer` class is responsible for tokenizing the input `.rst` string.

-   **`constructor(input: string)`**: Creates a new `Lexer` instance.
-   **`*lex()`**: A generator function that yields tokens one by one.

**Example:**

```typescript
import { Lexer } from 'rst.js';

const lexer = new Lexer("Some text.");
for (const token of lexer.lex()) {
    console.log(token);
}
```

### `Parser`

The `Parser` class constructs an Abstract Syntax Tree (AST) from the token stream provided by the `Lexer`.

-   **`constructor(lexer: Lexer)`**: Creates a new `Parser` instance.
-   **`parse()`**: Parses the token stream and returns the root `AstNode` of the document.

**Properties:**

-   **`targets`**: A map of internal link targets found during parsing.
-   **`sections`**: A list of section titles found during parsing.
-   **`footnoteDefinitions`**: A map of footnote definitions found during parsing.

### `HtmlRenderer`

The `HtmlRenderer` class traverses the AST to produce the final HTML output.

-   **`constructor(targets, sections, footnoteDefinitions, [customRenderers])`**: Creates a new `HtmlRenderer` instance. The constructor requires the contextual information gathered by the `Parser`.
-   **`render(node: AstNode)`**: Renders the given AST node and its children to an HTML string.

## Customization

### `CustomRenderers`

The `CustomRenderers` type allows you to override the default rendering logic for any AST node. It is a map where the key is the name of the AST node class (e.g., `ParagraphNode`) and the value is a function that takes the node as an argument and returns an HTML string.

**Type Definition:**

```typescript
export type CustomRenderer = (node: any) => string;
export type CustomRenderers = Record<string, CustomRenderer>;
```

**Example:**

To render all blockquotes with a specific CSS class, you can provide a custom renderer for `BlockquoteNode`.

```typescript
import { renderRst, CustomRenderers } from 'rst.js';

const rst = `
> This is a blockquote.
`;

const customRenderers: CustomRenderers = {
    BlockquoteNode: (node) => {
        // The renderer is responsible for rendering the node's children.
        const content = node.children.map(child => renderer.render(child)).join('');
        return `<blockquote class="my-quote">${content}</blockquote>`;
    }
};

// Note: To use custom renderers with children, you would need to
// instantiate the HtmlRenderer class yourself to pass its `render`
// method into the custom function's scope.
// The top-level `renderRst` is best for simple, self-contained overrides.

const html = renderRst(rst, { customRenderers });
```
