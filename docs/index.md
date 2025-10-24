# Welcome to the rst.js Documentation

`rst.js` is a powerful TypeScript library for parsing and rendering ReStructuredText (`.rst`). This documentation provides a deeper dive into its architecture, API, and advanced features.

## Core Architecture

The library is designed around a three-stage pipeline, which processes `.rst` content from raw text to final HTML:

1.  **Lexer (`Lexer`)**: The first stage is the lexer, which performs lexical analysis. It takes a raw `.rst` string as input and scans it line by line to produce a flat stream of **tokens**. Tokens are the smallest meaningful units of the syntax, such as `Title`, `Paragraph`, `ListItem`, `Indent`, and `Dedent`. This line-oriented approach is efficient and well-suited for `.rst`'s indentation-sensitive syntax.

2.  **Parser (`Parser`)**: The second stage is the parser, which takes the token stream from the lexer and builds an **Abstract Syntax Tree (AST)**. The AST is a hierarchical, tree-like data structure that represents the logical structure of the document. Each node in the tree corresponds to a specific element, like a section, a list, or a paragraph. This structured representation is much easier to work with than a flat token stream. The parser also performs a multi-pass analysis to collect contextual information, such as footnote definitions and internal link targets, which are necessary for rendering the complete document.

3.  **Renderer (`HtmlRenderer`)**: The final stage is the renderer. It traverses the AST and generates the final HTML output. The renderer is designed to be highly extensible, allowing you to provide your own custom rendering functions for any AST node type. This gives you full control over the final HTML markup, enabling you to add custom CSS classes, change tag types, or integrate with other frameworks.

## How It Works Together

The `renderRst` function orchestrates this entire pipeline:

```typescript
// 1. renderRst receives the raw .rst string
export function renderRst(rst: string, options: RenderOptions = {}): string {
    // 2. The Lexer tokenizes the string
    const lexer = new Lexer(rst);

    // 3. The Parser builds the AST and collects context
    const parser = new Parser(lexer);
    const ast = parser.parse();

    // 4. The Renderer traverses the AST to generate HTML
    const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions, options.customRenderers);

    // 5. The final HTML is returned
    return renderer.render(ast);
}
```

By understanding this architecture, you can better leverage the library's advanced features, such as creating custom renderers or even manipulating the AST before rendering.
