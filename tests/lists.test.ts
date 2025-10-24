/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer, HtmlRenderer } from '../src/index';

describe('Lists', () => {
    it('should handle bulleted lists', () => {
        const input = `
* one
* two
* three
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe(
            '<ul>\n<li>one</li>\n<li>two</li>\n<li>three</li>\n</ul>'
        );
    });

    it('should handle enumerated lists', () => {
        const input = `
1. one
2. two
3. three
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(html).toBe(
            '<ol>\n<li>one</li>\n<li>two</li>\n<li>three</li>\n</ol>'
        );
    });

    it('should handle nested lists', () => {
        const input = `
* one
* two
  * a
  * b
    1. x
    2. y
* three
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        const expectedHtml = `<ul>
<li>one</li>
<li>two<ul>
<li>a</li>
<li>b<ol>
<li>x</li>
<li>y</li>
</ol>
</li>
</ul>
</li>
<li>three</li>
</ul>`;
        expect(html.replace(/\s/g, '')).toBe(expectedHtml.replace(/\s/g, ''));
    });
});
