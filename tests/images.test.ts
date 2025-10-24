/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer, HtmlRenderer } from '../src/index';

describe('Image Directive', () => {
    it('should render a simple image directive', () => {
        const input = '.. image:: /images/test.png';
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe('<img src="/images/test.png">');
    });

    it('should render an image directive with alt, width, and height options', () => {
        const input = `
.. image:: /images/logo.png
   :alt: My Logo
   :width: 200px
   :height: 100px
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe('<img src="/images/logo.png" alt="My Logo" width="200px" height="100px">');
    });
});
