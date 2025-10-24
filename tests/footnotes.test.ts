/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer, HtmlRenderer } from '../src/index';

describe('Footnotes', () => {
    it('should handle a simple footnote', () => {
        const input = `
This is a paragraph with a footnote reference [1]_.

.. [1] This is the footnote.
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast).replace(/\s/g, '');

        const expectedHtml = `
<p>This is a paragraph with a footnote reference <sup><a href="#fn-1" id="fnref-1">1</a></sup>.</p>
<hr>
<ol class="footnotes">
<li id="fn-1">This is the footnote. <a href="#fnref-1">↩</a></li>
</ol>
`.replace(/\s/g, '');

        expect(html).toBe(expectedHtml);
    });

    it('should handle multiple footnotes', () => {
        const input = `
Another paragraph [2]_ with another footnote [3]_.

.. [2] Second footnote.
.. [3] Third footnote.
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast).replace(/\s/g, '');

        const expectedHtml = `
<p>Another paragraph <sup><a href="#fn-2" id="fnref-2">1</a></sup> with another footnote <sup><a href="#fn-3" id="fnref-3">2</a></sup>.</p>
<hr>
<ol class="footnotes">
<li id="fn-2">Second footnote. <a href="#fnref-2">↩</a></li>
<li id="fn-3">Third footnote. <a href="#fnref-3">↩</a></li>
</ol>
`.replace(/\s/g, '');

        expect(html).toBe(expectedHtml);
    });
});
