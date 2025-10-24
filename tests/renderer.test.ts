/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { HtmlRenderer, Parser, Lexer } from '../src/index';

describe('HtmlRenderer', () => {
    it('should render a simple RST document to HTML', () => {
        const input = `
Title
=====

This is a paragraph.

.. code:: javascript

    console.log("Hello, World!");
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe(
            `<h1 id="title">Title</h1>\n<p>This is a paragraph.</p>\n<pre><code class="lang-javascript">console.log("Hello, World!");</code></pre>`
        );
    });
});
