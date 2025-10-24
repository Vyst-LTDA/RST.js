/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Token, TokenType } from './lexer_types';

export class Lexer {
    private lines: string[];
    private lineIndex: number = 0;
    private indentStack: number[] = [0];
    private tokenQueue: Token[] = [];

    constructor(input: string) {
        this.lines = input.split('\n');
    }

    public nextToken(): Token {
        if (this.tokenQueue.length > 0) {
            return this.tokenQueue.shift()!;
        }

        if (this.lineIndex >= this.lines.length) {
            while (this.indentStack.length > 1) {
                this.indentStack.pop();
                this.tokenQueue.push({ type: TokenType.Dedent, value: '' });
            }
            if (this.tokenQueue.length > 0) return this.tokenQueue.shift()!;
            return { type: TokenType.EOF, value: '' };
        }

        const line = this.lines[this.lineIndex++];
        if (line.trim() === '') {
            return this.nextToken(); // Skip empty lines
        }

        const indentMatch = line.match(/^[ \t]*/);
        const indent = indentMatch ? indentMatch[0].length : 0;
        const content = line.trim();

        const lastIndent = this.indentStack[this.indentStack.length - 1];
        if (indent > lastIndent) {
            this.indentStack.push(indent);
            this.tokenQueue.push({ type: TokenType.Indent, value: '' });
        } else {
            while (indent < this.indentStack[this.indentStack.length - 1]) {
                this.indentStack.pop();
                this.tokenQueue.push({ type: TokenType.Dedent, value: '' });
            }
        }

        const listItemMatch = content.match(/^(\*|\d+\.)[ \t]+(.*)/);
        if (listItemMatch) {
            this.tokenQueue.push({ type: TokenType.ListItemMarker, value: listItemMatch[1] });
            this.tokenQueue.push({ type: TokenType.Text, value: listItemMatch[2].trim() });
        } else if (/^\+[=-]+(\+[=-]+)*\+$/.test(content)) {
            this.tokenQueue.push({ type: TokenType.TableSeparatorLine, value: content });
        } else if (content.startsWith('|')) {
            this.tokenQueue.push({ type: TokenType.TableDataRow, value: content });
        } else if (this.lineIndex < this.lines.length && /^[=-`:'."~^_*+#]{3,}$/.test(this.lines[this.lineIndex].trim())) {
            const level = '=-`:\'."~^_*+#'.indexOf(this.lines[this.lineIndex].trim()[0]) + 1;
            this.tokenQueue.push({ type: TokenType.Section, value: content, level });
            this.lineIndex++; // Consume the underline
        } else if (content.startsWith('.. _')) {
            const targetMatch = content.match(/^.. _([^:]+):/);
            if (targetMatch) {
                this.tokenQueue.push({ type: TokenType.Target, value: targetMatch[1] });
            } else {
                this.tokenQueue.push({ type: TokenType.Paragraph, value: content });
            }
        } else if (content.startsWith('.. [')) {
            const footnoteMatch = content.match(/^.. \[([^\]]+)\](.*)/);
            if (footnoteMatch) {
                const label = footnoteMatch[1];
                let value = footnoteMatch[2].trim();
                let blockContent: string[] = [];

                while (this.lineIndex < this.lines.length && (this.lines[this.lineIndex].trim() === '' || (this.lines[this.lineIndex].match(/^[ \t]*/) || [''])[0].length > indent)) {
                    const nextLine = this.lines[this.lineIndex++];
                    if(nextLine.trim() !== '') blockContent.push(nextLine.trim());
                }

                if (blockContent.length > 0) {
                    value = (value ? value + '\n' : '') + blockContent.join('\n');
                }

                this.tokenQueue.push({ type: TokenType.FootnoteDefinition, label, value });
            } else {
                this.tokenQueue.push({ type: TokenType.Paragraph, value: content });
            }
        } else if (content.startsWith('.. ')) {
            const directiveMatch = content.match(/^.. (\w+)::(.*)/);
            if (directiveMatch) {
                let name = directiveMatch[1];
                let value = (directiveMatch[2] || '').trim();
                let blockContent: string[] = [];

                while (this.lineIndex < this.lines.length && (this.lines[this.lineIndex].trim() === '' || (this.lines[this.lineIndex].match(/^[ \t]*/) || [''])[0].length > indent)) {
                    const nextLine = this.lines[this.lineIndex++];
                    if(nextLine.trim() !== '') blockContent.push(nextLine.trim());
                }

                if (blockContent.length > 0) {
                    value = (value ? value + '\n' : '') + blockContent.join('\n');
                }

                this.tokenQueue.push({ type: TokenType.Directive, name, value });
            } else {
                this.tokenQueue.push({ type: TokenType.Paragraph, value: content });
            }
        } else {
            const nextLine = this.lines[this.lineIndex];
            const nextIndentMatch = nextLine ? nextLine.match(/^[ \t]*/) : null;
            const nextIndent = nextIndentMatch ? nextIndentMatch[0].length : 0;
            if (nextLine && nextLine.trim() !== '' && nextIndent > indent) {
                this.tokenQueue.push({ type: TokenType.DefinitionTerm, value: content });
            } else {
                this.tokenQueue.push({ type: TokenType.Paragraph, value: content });
            }
        }

        return this.tokenQueue.shift()!;
    }
}
