/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer, HtmlRenderer } from '../src/index';

describe('Directives', () => {
    it('should handle a note directive', () => {
        const input = `
.. note::

    This is a note.
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe(
            '<div class="admonition note">\n<p class="admonition-title">Note</p>\n<p>This is a note.</p>\n</div>'
        );
    });

    it('should handle a warning directive', () => {
        const input = `
.. warning::

    This is a warning.
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe(
            '<div class="admonition warning">\n<p class="admonition-title">Warning</p>\n<p>This is a warning.</p>\n</div>'
        );
    });

    it('should handle a tip directive', () => {
        const input = `
.. tip::

    This is a tip.
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe(
            '<div class="admonition tip">\n<p class="admonition-title">Tip</p>\n<p>This is a tip.</p>\n</div>'
        );
    });
});
