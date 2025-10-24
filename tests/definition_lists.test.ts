/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer, HtmlRenderer } from '../src/index';

describe('Definition Lists', () => {
    it('should render a simple definition list', () => {
        const input = `
Term 1
    Definition 1.

Term 2
    Definition 2.
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast).replace(/\s/g, '');

        const expectedHtml = `
<dl>
<dt>Term 1</dt>
<dd><p>Definition 1.</p></dd>
<dt>Term 2</dt>
<dd><p>Definition 2.</p></dd>
</dl>
`.replace(/\s/g, '');

        expect(html).toBe(expectedHtml);
    });

    it('should render a definition list with multiple paragraphs', () => {
        const input = `
Term 1
    Definition 1, paragraph 1.

    Definition 1, paragraph 2.
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast).replace(/\s/g, '');

        const expectedHtml = `
<dl>
<dt>Term 1</dt>
<dd><p>Definition 1, paragraph 1.</p><p>Definition 1, paragraph 2.</p></dd>
</dl>
`.replace(/\s/g, '');

        expect(html).toBe(expectedHtml);
    });
});
