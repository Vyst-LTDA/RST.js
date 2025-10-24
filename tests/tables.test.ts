/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer, HtmlRenderer } from '../src/index';

describe('Simple Tables', () => {
    it('should render a simple table with a header', () => {
        const input = `
+--------+--------+
| Head 1 | Head 2 |
+========+========+
| Col 1  | Col 2  |
+--------+--------+
| Col 3  | Col 4  |
+--------+--------+
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        const expectedHtml = `
<table>
<thead>
<tr>
<th>Head 1</th><th>Head 2</th></tr>
</thead>
<tbody>
<tr>
<td>Col 1</td><td>Col 2</td></tr>
<tr>
<td>Col 3</td><td>Col 4</td></tr>
</tbody>
</table>
`;
        expect(html.replace(/\s/g, '')).toBe(expectedHtml.replace(/\s/g, ''));
    });
});
