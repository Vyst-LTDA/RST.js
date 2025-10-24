/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer, HtmlRenderer } from '../src/index';

describe('Inline Markup', () => {
    it('should handle bold, italic, and literal text', () => {
        const input = 'This is **bold**, *italic*, and ``literal`` text.';
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe(
            '<p>This is <strong>bold</strong>, <em>italic</em>, and <code>literal</code> text.</p>'
        );
    });
});
