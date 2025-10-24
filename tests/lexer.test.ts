/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Lexer, TokenType } from '../src/index';

describe('Lexer', () => {
    it('should tokenize a simple RST document', () => {
        const input = `
Title
=====

This is a paragraph.

.. code:: javascript

    console.log("Hello, World!");
`;
        const lexer = new Lexer(input);

        const tokens = [];
        let token = lexer.nextToken();
        while (token.type !== TokenType.EOF) {
            tokens.push(token);
            token = lexer.nextToken();
        }

        // Filter out Text tokens for this high-level test
        const filteredTokens = tokens.filter(t => t.type !== TokenType.Text);

        expect(filteredTokens).toEqual([
            { type: TokenType.Section, value: 'Title', level: 1 },
            { type: TokenType.Paragraph, value: 'This is a paragraph.' },
            {
                type: TokenType.Directive,
                name: 'code',
                value: 'javascript\nconsole.log("Hello, World!");',
            },
        ]);
    });
});
