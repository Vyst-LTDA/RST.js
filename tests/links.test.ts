/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer, HtmlRenderer } from '../src/index';

describe('Links', () => {
    it('should handle a simple external link', () => {
        const input = 'Check out `this website <https://example.com>`_.';
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe('<p>Check out <a href="https://example.com">this website</a>.</p>');
    });

    it('should handle a link with nested bold and italic markup', () => {
        const input = 'Visit `our **awesome** *site* <https://example.com>`_.';
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe('<p>Visit <a href="https://example.com">our <strong>awesome</strong> <em>site</em></a>.</p>');
    });
});
