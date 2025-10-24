/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer, HtmlRenderer } from '../src/index';

describe('References and Roles', () => {
    it('should handle internal references', () => {
        const input = `
.. _my-target:

Some text.

Click :ref:\`here <my-target>\` to see the target.
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        // This is a simplified expectation. In reality, the target might be elsewhere.
        // The key is that the ref becomes an <a href="...">
        expect(html).toContain('<a id="my-target"></a>');
        expect(html).toContain('<a href="#my-target">here</a>');
    });

    it('should handle unresolved roles gracefully', () => {
        const input = 'This is an :unresolved-role:`unresolved role`.';
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe('<p>This is an unresolved role.</p>');
    });
});
