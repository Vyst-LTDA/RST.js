/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer, HtmlRenderer } from '../src/index';

describe('Contents Directive', () => {
    it('should render a table of contents', () => {
        const input = `
.. contents::

Section 1
=========

Some text.

Section 2
=========

More text.
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toContain('<div class="contents">');
        expect(html).toContain('<li><a href="#section-1">Section 1</a></li>');
        expect(html).toContain('<li><a href="#section-2">Section 2</a></li>');
        expect(html).toContain('<h1 id="section-1">Section 1</h1>');
        expect(html).toContain('<h1 id="section-2">Section 2</h1>');
    });
});
