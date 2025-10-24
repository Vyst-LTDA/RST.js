/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { DocumentNode, Node, NodeType, SectionNode, ParagraphNode, CodeNode, TextNode, BulletedListNode, EnumeratedListNode, ListItemNode, DirectiveNode, LiteralNode, LinkNode, ImageNode, RoleNode, TargetNode, ContentsNode, FigureNode, TableNode, TableRowNode, TableHeaderNode, TableCellNode, FootnoteDefinitionNode, FootnoteReferenceNode, DefinitionListNode, DefinitionListItemNode, DefinitionTermNode, DefinitionNode, ClassNode, RawNode } from './nodes';
import { Lexer } from './lexer';
import { Token, TokenType } from './lexer_types';

export class Parser {
    private lexer: Lexer;
    private currentToken: Token;
    public targets: { [key: string]: string } = {};
    public sections: { title: string, level: number, id: string }[] = [];
    public footnoteDefinitions: { [label: string]: FootnoteDefinitionNode } = {};

    constructor(lexer: Lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.nextToken();
    }

    private consume(tokenType?: TokenType) {
        if (!tokenType || this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.nextToken();
        } else {
            throw new Error(`Unexpected token: ${this.currentToken.type}, expected: ${tokenType}`);
        }
    }

    public parse(): DocumentNode {
        const document: DocumentNode = { type: NodeType.Document, children: [] };
        while (this.currentToken.type !== TokenType.EOF) {
            switch (this.currentToken.type) {
                case TokenType.Section:
                    document.children.push(this.parseSection());
                    break;
                case TokenType.Paragraph:
                    document.children.push(this.parseParagraph());
                    break;
                case TokenType.ListItemMarker:
                    document.children.push(this.parseList());
                    break;
                case TokenType.Directive:
                    document.children.push(this.parseDirective());
                    break;
                case TokenType.Target:
                    document.children.push(this.parseTarget());
                    break;
                case TokenType.TableSeparatorLine:
                    document.children.push(this.parseTable());
                    break;
                case TokenType.FootnoteDefinition:
                    this.parseFootnoteDefinition();
                    break;
                case TokenType.DefinitionTerm:
                    document.children.push(this.parseDefinitionList());
                    break;
                case TokenType.Indent:
                case TokenType.Dedent:
                case TokenType.Text:
                    this.consume();
                    break;
                default:
                     this.consume();
            }
        }
        return document;
    }

    private parseFootnoteDefinition(): void {
        const token = this.currentToken;
        const label = token.label!;
        const children = this.parseInline(token.value);
        this.footnoteDefinitions[label] = { type: NodeType.FootnoteDefinition, label, children };
        this.consume(TokenType.FootnoteDefinition);
    }

    private parseDefinitionList(): DefinitionListNode {
        const listNode: DefinitionListNode = { type: NodeType.DefinitionList, children: [] };
        while (this.currentToken.type === TokenType.DefinitionTerm) {
            listNode.children.push(this.parseDefinitionListItem());
        }
        return listNode;
    }

    private parseDefinitionListItem(): DefinitionListItemNode {
        const termNode: DefinitionTermNode = {
            type: NodeType.DefinitionTerm,
            children: this.parseInline(this.currentToken.value),
        };
        this.consume(TokenType.DefinitionTerm);

        this.consume(TokenType.Indent);
        const definitionChildren: Node[] = [];
        while (this.currentToken.type !== TokenType.Dedent && this.currentToken.type !== TokenType.EOF) {
            switch (this.currentToken.type) {
                case TokenType.Paragraph:
                    definitionChildren.push(this.parseParagraph());
                    break;
                case TokenType.DefinitionTerm:
                    // This handles nested definition lists, but we need to parse the whole sub-list
                    definitionChildren.push(this.parseDefinitionList());
                    break;
                default:
                    // Consume any other token to avoid infinite loops on unexpected tokens
                    this.consume();
                    break;
            }
        }
        this.consume(TokenType.Dedent);

        const definitionNode: DefinitionNode = {
            type: NodeType.Definition,
            children: definitionChildren,
        };

        return { type: NodeType.DefinitionListItem, children: [termNode, definitionNode] };
    }

    private parseTarget(): TargetNode {
        const token = this.currentToken;
        const identifier = token.value.toLowerCase().replace(/\s+/g, '-');
        this.targets[token.value] = identifier;
        this.consume(TokenType.Target);
        return { type: NodeType.Target, identifier };
    }

    private parseSection(): SectionNode {
        const token = this.currentToken;
        const title = token.value;
        const id = title.toLowerCase().replace(/\s+/g, '-');
        this.sections.push({ title, level: token.level!, id });
        this.consume(TokenType.Section);
        return { type: NodeType.Section, level: token.level!, children: [{ type: NodeType.Text, text: title } as TextNode], id };
    }

    private parseParagraph(): ParagraphNode {
        const children = this.parseInline(this.currentToken.value);
        this.consume(TokenType.Paragraph);
        return { type: NodeType.Paragraph, children };
    }

    private parseList(): Node {
        const isBulleted = this.currentToken.value === '*';
        const listNode: BulletedListNode | EnumeratedListNode = { type: isBulleted ? NodeType.BulletedList : NodeType.EnumeratedList, children: [] };
        while (this.currentToken.type === TokenType.ListItemMarker) {
            listNode.children.push(this.parseListItem());
        }
        return listNode;
    }

    private parseListItem(): ListItemNode {
        this.consume(TokenType.ListItemMarker);
        const contentToken = this.currentToken;
        this.consume(TokenType.Text);
        const listItemNode: ListItemNode = { type: NodeType.ListItem, children: this.parseInline(contentToken.value) };
        if (this.currentToken.type === TokenType.Indent) {
            this.consume(TokenType.Indent);
            listItemNode.children.push(this.parseList());
            this.consume(TokenType.Dedent);
        }
        return listItemNode;
    }

    private parseTable(): TableNode {
        const tableNode: TableNode = { type: NodeType.Table, children: [] };

        if (this.currentToken.type !== TokenType.TableSeparatorLine) {
            return tableNode;
        }

        const firstSeparator = this.currentToken;
        this.consume(TokenType.TableSeparatorLine);

        const widths = firstSeparator.value.split('+').slice(1, -1).map(s => s.length);

        let isHeader = true;
        while ((this.currentToken.type as any) === TokenType.TableDataRow || (this.currentToken.type as any) === TokenType.TableSeparatorLine) {
            if ((this.currentToken.type as any) === TokenType.TableDataRow) {
                const rowNode: TableRowNode | TableHeaderNode = {
                    type: isHeader ? NodeType.TableHeader : NodeType.TableRow,
                    children: [],
                };

                let currentPos = 1;
                for (const width of widths) {
                    const cellContent = this.currentToken.value.substring(currentPos, currentPos + width).trim();
                    const cellNode: TableCellNode = {
                        type: NodeType.TableCell,
                        children: this.parseInline(cellContent),
                    };
                    rowNode.children.push(cellNode);
                    currentPos += width + 1;
                }
                tableNode.children.push(rowNode);
                this.consume(TokenType.TableDataRow);
            } else {
                isHeader = false;
                this.consume(TokenType.TableSeparatorLine);
            }
        }

        return tableNode;
    }

    private parseDirective(): Node {
        const token = this.currentToken;
        switch (token.name) {
            case 'class':
                this.consume(TokenType.Directive);
                return { type: NodeType.Class, className: token.value } as ClassNode;
            case 'raw':
                this.consume(TokenType.Directive);
                const [format, ...contentLines] = token.value.split('\n');
                return { type: NodeType.Raw, format: format.trim(), content: contentLines.join('\n') } as RawNode;
             case 'contents':
                this.consume(TokenType.Directive);
                return { type: NodeType.Contents, depth: 2 } as ContentsNode;
            case 'code':
                this.consume(TokenType.Directive);
                const [language, ...codeLines] = token.value.split('\n');
                return { type: NodeType.Code, language: language.trim(), text: codeLines.join('\n').trim() } as CodeNode;
            case 'image':
                 this.consume(TokenType.Directive);
                 return this.parseImageDirective(token.value);
            case 'figure':
                this.consume(TokenType.Directive);
                return this.parseFigureDirective(token.value);
            default:
                const children = this.parseInline(token.value);
                this.consume(TokenType.Directive);
                return { type: NodeType.Directive, name: token.name!, children } as DirectiveNode;
        }
    }

     private parseImageDirective(value: string): ImageNode {
        const lines = value.split('\n');
        const src = lines[0].trim();
        const options: { [key: string]: string } = {};
        for (let i = 1; i < lines.length; i++) {
            const optionMatch = lines[i].match(/^[ \t]*:(\w+):[ \t]*(.*)/);
            if (optionMatch) {
                options[optionMatch[1]] = optionMatch[2].trim();
            }
        }
        return { type: NodeType.Image, src, alt: options.alt, width: options.width, height: options.height };
    }

    private parseFigureDirective(value: string): FigureNode {
        const lines = value.split('\n');
        const src = lines[0].trim();
        const options: { [key: string]: string } = {};
        let captionStartIndex = 1;

        for (let i = 1; i < lines.length; i++) {
            const optionMatch = lines[i].match(/^[ \t]*:(\w+):[ \t]*(.*)/);
            if (optionMatch) {
                options[optionMatch[1]] = optionMatch[2].trim();
                captionStartIndex = i + 1;
            } else {
                break;
            }
        }

        const captionText = lines.slice(captionStartIndex).join('\n').trim();
        const captionNodes = this.parseInline(captionText);

        return {
            type: NodeType.Figure,
            src,
            alt: options.alt,
            width: options.width,
            height: options.height,
            children: captionNodes,
        };
    }

    private parseInline(text: string): Node[] {
        let position = 0;
        const parse = (delimiter: string | null): Node[] | null => {
            const nodes: Node[] = [];
            let buffer = '';
            const startParsePosition = position;
            const linkRegex = /`([^`]+) <([^>]+)>`_/;
            const roleRegex = /:([\w-]+):`([^\`<]+)(?: <([^>]+)>)?`/;
            const footnoteRefRegex = /\[(\w+)\]_/;
            while (position < text.length) {
                const footnoteRefMatch = text.substring(position).match(footnoteRefRegex);
                if (footnoteRefMatch && text.substring(position).startsWith(footnoteRefMatch[0])) {
                    if (buffer) { nodes.push({ type: NodeType.Text, text: buffer } as TextNode); buffer = ''; }
                    nodes.push({ type: NodeType.FootnoteReference, label: footnoteRefMatch[1] } as FootnoteReferenceNode);
                    position += footnoteRefMatch[0].length;
                    continue;
                }
                const roleMatch = text.substring(position).match(roleRegex);
                 if (roleMatch && text.substring(position).startsWith(roleMatch[0])) {
                    if (buffer) { nodes.push({ type: NodeType.Text, text: buffer } as TextNode); buffer = ''; }
                    const roleName = roleMatch[1];
                    const roleText = roleMatch[2];
                    const roleTarget = roleMatch[3] || roleText;
                    const roleNode = { type: NodeType.Role, name: roleName, target: roleTarget, children: this.parseInline(roleText) } as RoleNode;
                    nodes.push(roleNode);
                    position += roleMatch[0].length;
                    continue;
                }
                if (delimiter) {
                    if (delimiter === '*' && text.startsWith('**', position)) {}
                    else if (text.startsWith(delimiter, position)) {
                        if (buffer) nodes.push({ type: NodeType.Text, text: buffer } as TextNode);
                        position += delimiter.length;
                        return nodes;
                    }
                }
                const linkMatch = text.substring(position).match(linkRegex);
                if (linkMatch && text.substring(position).startsWith(linkMatch[0])) {
                    if (buffer) { nodes.push({ type: NodeType.Text, text: buffer } as TextNode); buffer = ''; }
                    const children = this.parseInline(linkMatch[1]);
                    nodes.push({ type: NodeType.Link, url: linkMatch[2], children } as LinkNode);
                    position += linkMatch[0].length;
                    continue;
                }
                if (text.startsWith('``', position)) {
                    if (buffer) { nodes.push({ type: NodeType.Text, text: buffer } as TextNode); buffer = ''; }
                    position += 2;
                    const endLiteral = text.indexOf('``', position);
                    if (endLiteral === -1) { buffer += '``'; }
                    else {
                        nodes.push({ type: NodeType.Literal, text: text.substring(position, endLiteral) } as LiteralNode);
                        position = endLiteral + 2;
                    }
                    continue;
                }
                const opener = text.startsWith('**', position) ? '**' : text.startsWith('*', position) ? '*' : null;
                if (opener) {
                    if (buffer) { nodes.push({ type: NodeType.Text, text: buffer } as TextNode); buffer = ''; }
                    const nodeType = opener === '**' ? NodeType.Bold : NodeType.Italic;
                    const preRecursePos = position;
                    position += opener.length;
                    const children = parse(opener);
                    if (children === null) { position = preRecursePos + opener.length; buffer += opener; }
                    else { nodes.push({ type: nodeType as any, children }); }
                } else { buffer += text[position]; position++; }
            }
            if (delimiter) { position = startParsePosition; return null; }
            if (buffer) nodes.push({ type: NodeType.Text, text: buffer } as TextNode);
            return nodes;
        };
        return parse(null) ?? [];
    }
}
