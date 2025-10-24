/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Lexer, Parser, HtmlRenderer } from '../src/index';
import { Node, NodeType, TableCellNode, TableHeaderNode, TableNode } from '../src/core/nodes';

describe('Parser', () => {
    it('should parse a simple table', () => {
        const input = `
+------------+------------+
| Header 1   | Header 2   |
+============+============+
| a          | b          |
+------------+------------+
| c          | d          |
+------------+------------+
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions);
        const html = renderer.render(ast);

        expect(ast.children.length).toBe(1);
        const table = ast.children[0] as TableNode;
        expect(table.type).toBe(NodeType.Table);

        expect(table.children).toBeDefined();
        expect(table.children.length).toBe(3);

        const header = table.children[0] as TableHeaderNode;
        expect(header.type).toBe(NodeType.TableHeader);
        expect(header.children).toBeDefined();
        expect(header.children.length).toBe(2);

        const headerCell1 = header.children[0] as TableCellNode;
        expect(headerCell1.type).toBe(NodeType.TableCell);

        const headerCell2 = header.children[1] as TableCellNode;
        expect(headerCell2.type).toBe(NodeType.TableCell);

        const expectedHtml = `<table>
<thead>
<tr>
<th>Header 1</th>
<th>Header 2</th>
</tr>
</thead>
<tbody>
<tr>
<td>a</td>
<td>b</td>
</tr>
<tr>
<td>c</td>
<td>d</td>
</tr>
</tbody>
</table>`;
        expect(html.replace(/\s/g, '')).toBe(expectedHtml.replace(/\s/g, ''));
    });
});
