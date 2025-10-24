/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer, HtmlRenderer } from '../src/index';

describe('Figure Directive', () => {
    it('should render a figure with a caption', () => {
        const input = `
.. figure:: /images/logo.png
   :alt: My Logo
   :width: 200px

   This is the *caption*.
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        const expectedHtml = `
<figure>
<img src="/images/logo.png" alt="My Logo" width="200px">
<figcaption>This is the <em>caption</em>.</figcaption>
</figure>
`;
        expect(html.replace(/\s/g, '')).toBe(expectedHtml.replace(/\s/g, ''));
    });
});
