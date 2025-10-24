/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer, HtmlRenderer } from '../src/index';

describe('Nested Inline Markup', () => {
    it('should handle bold text with italic inside', () => {
        const input = 'This is **bold with *italic* inside**.';
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe('<p>This is <strong>bold with <em>italic</em> inside</strong>.</p>');
    });

    it('should handle italic text with bold inside', () => {
        const input = 'This is *italic with **bold** inside*.';
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe('<p>This is <em>italic with <strong>bold</strong> inside</em>.</p>');
    });

    it('should handle unclosed markup as plain text', () => {
        const input = 'This is **unclosed bold.';
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe('<p>This is **unclosed bold.</p>');
    });
});
