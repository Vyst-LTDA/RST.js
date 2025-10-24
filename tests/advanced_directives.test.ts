/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer, HtmlRenderer } from '../src/index';

describe('Advanced Directives', () => {
    it('should handle the class directive', () => {
        const input = `
.. class:: custom-class

This paragraph should have a custom class.
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast).replace(/\s/g, '');

        const expectedHtml = `<p class="custom-class">This paragraph should have a custom class.</p>`;
        expect(html).toBe(expectedHtml.replace(/\s/g, ''));
    });

    it('should handle the raw html directive', () => {
        const input = `
.. raw:: html

    <div style="color: red;">This is raw HTML.</div>
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast).replace(/\s/g, '');

        const expectedHtml = `<div style="color: red;">This is raw HTML.</div>`;
        expect(html).toBe(expectedHtml.replace(/\s/g, ''));
    });
});
