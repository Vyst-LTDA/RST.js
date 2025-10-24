/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Parser, Lexer } from '../src/index';
import { NodeType } from '../src/core/nodes';

describe('Parser', () => {
    it('should parse a simple RST document', () => {
        const input = `
Title
=====

This is a paragraph.

.. code:: javascript

    console.log("Hello, World!");
`;
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);

        const ast = parser.parse();

        expect(ast).toEqual({
            type: NodeType.Document,
            children: [
                {
                    type: NodeType.Section,
                    level: 1,
                    children: [{ type: NodeType.Text, text: 'Title' }],
                    id: 'title',
                },
                {
                    type: NodeType.Paragraph,
                    children: [{ type: NodeType.Text, text: 'This is a paragraph.' }],
                },
                {
                    type: NodeType.Code,
                    language: 'javascript',
                    text: 'console.log("Hello, World!");',
                },
            ],
        });
    });
});
