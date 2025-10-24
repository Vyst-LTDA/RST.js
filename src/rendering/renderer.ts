/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { DocumentNode, Node, NodeType, SectionNode, ParagraphNode, CodeNode, TextNode, BoldNode, ItalicNode, LiteralNode, BulletedListNode, EnumeratedListNode, ListItemNode, DirectiveNode, LinkNode, ImageNode, RoleNode, TargetNode, ContentsNode, FigureNode, TableNode, TableRowNode, TableHeaderNode, TableCellNode, FootnoteDefinitionNode, FootnoteReferenceNode, DefinitionListNode, DefinitionListItemNode, DefinitionTermNode, DefinitionNode, ClassNode, RawNode } from '../core/nodes';

export type CustomRenderers = {
    [key in NodeType]?: (node: any) => string;
};

type Section = { title: string, level: number, id: string };

export class HtmlRenderer {
    private customRenderers: CustomRenderers;
    private targets: { [key: string]: string };
    private sections: Section[];
    private footnoteDefinitions: { [label: string]: FootnoteDefinitionNode };
    private footnoteReferences: string[] = [];
    private nextElementClass: string | null = null;

    constructor(targets: { [key: string]: string }, sections: Section[], footnoteDefinitions: { [label: string]: FootnoteDefinitionNode }, customRenderers: CustomRenderers = {}) {
        this.customRenderers = customRenderers;
        this.targets = targets;
        this.sections = sections;
        this.footnoteDefinitions = footnoteDefinitions;
    }

    public render(node: Node, isHeader = false): string {
        const customRenderer = this.customRenderers[node.type];
        if (customRenderer) {
            return customRenderer(node);
        }

        switch (node.type) {
            case NodeType.Document:
                return this.renderDocument(node as DocumentNode);
            case NodeType.Section:
                return this.renderSection(node as SectionNode);
            case NodeType.Paragraph:
                return this.renderParagraph(node as ParagraphNode);
            case NodeType.Code:
                return this.renderCode(node as CodeNode);
            case NodeType.Text:
                return this.renderText(node as TextNode);
            case NodeType.Bold:
                return this.renderBold(node as BoldNode);
            case NodeType.Italic:
                return this.renderItalic(node as ItalicNode);
            case NodeType.Literal:
                return this.renderLiteral(node as LiteralNode);
            case NodeType.BulletedList:
                return this.renderBulletedList(node as BulletedListNode);
            case NodeType.EnumeratedList:
                return this.renderEnumeratedList(node as EnumeratedListNode);
            case NodeType.ListItem:
                return this.renderListItem(node as ListItemNode);
            case NodeType.Directive:
                return this.renderDirective(node as DirectiveNode);
            case NodeType.Link:
                return this.renderLink(node as LinkNode);
            case NodeType.Image:
                return this.renderImage(node as ImageNode);
            case NodeType.Role:
                return this.renderRole(node as RoleNode);
            case NodeType.Target:
                return this.renderTarget(node as TargetNode);
            case NodeType.Contents:
                return this.renderContents(node as ContentsNode);
            case NodeType.Figure:
                return this.renderFigure(node as FigureNode);
            case NodeType.Table:
                return this.renderTable(node as TableNode);
            case NodeType.TableHeader:
                return this.renderTableHeader(node as TableHeaderNode);
            case NodeType.TableRow:
                return this.renderTableRow(node as TableRowNode);
            case NodeType.TableCell:
                return this.renderTableCell(node as TableCellNode, isHeader);
            case NodeType.FootnoteReference:
                return this.renderFootnoteReference(node as FootnoteReferenceNode);
            case NodeType.FootnoteDefinition:
                return ''; // Handled at the end of the document
            case NodeType.DefinitionList:
                return this.renderDefinitionList(node as DefinitionListNode);
            case NodeType.DefinitionListItem:
                return this.renderDefinitionListItem(node as DefinitionListItemNode);
            case NodeType.DefinitionTerm:
                return this.renderDefinitionTerm(node as DefinitionTermNode);
            case NodeType.Definition:
                return this.renderDefinition(node as DefinitionNode);
            case NodeType.Class:
                return this.renderClass(node as ClassNode);
            case NodeType.Raw:
                return this.renderRaw(node as RawNode);
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    private renderDocument(node: DocumentNode): string {
        const content = node.children.map(child => this.render(child)).join('\n');
        const footnotes = this.renderFootnotes();
        return `${content}${footnotes}`;
    }

    private renderFootnoteReference(node: FootnoteReferenceNode): string {
        if (this.footnoteDefinitions[node.label]) {
            if (!this.footnoteReferences.includes(node.label)) {
                this.footnoteReferences.push(node.label);
            }
            const index = this.footnoteReferences.indexOf(node.label) + 1;
            return `<sup><a href="#fn-${node.label}" id="fnref-${node.label}">${index}</a></sup>`;
        }
        return `[${node.label}]_`;
    }

    private renderFootnotes(): string {
        if (this.footnoteReferences.length === 0) {
            return '';
        }
        const items = this.footnoteReferences.map((label, index) => {
            const definition = this.footnoteDefinitions[label];
            if (!definition) return '';
            const content = definition.children.map(child => this.render(child)).join('');
            return `<li id="fn-${label}">${content} <a href="#fnref-${label}">↩</a></li>`;
        }).join('\n');
        return `\n<hr>\n<ol class="footnotes">\n${items}\n</ol>`;
    }

    private renderSection(node: SectionNode): string {
        const title = node.children.map(child => this.render(child)).join('');
        const html = `<h${node.level} id="${node.id}">${title}</h${node.level}>`;
        return this.applyClass(html, node);
    }

    private renderParagraph(node: ParagraphNode): string {
        const text = node.children.map(child => this.render(child)).join('');
        const html = `<p>${text}</p>`;
        return this.applyClass(html, node);
    }

    private renderCode(node: CodeNode): string {
        const html = `<pre><code class="lang-${node.language || ''}">${node.text}</code></pre>`;
        return this.applyClass(html, node);
    }

    private renderText(node: TextNode): string {
        return node.text;
    }

    private renderBold(node: BoldNode): string {
        const text = node.children.map(child => this.render(child)).join('');
        return `<strong>${text}</strong>`;
    }

    private renderItalic(node: ItalicNode): string {
        const text = node.children.map(child => this.render(child)).join('');
        return `<em>${text}</em>`;
    }

    private renderLiteral(node: LiteralNode): string {
        return `<code>${node.text}</code>`;
    }

    private renderBulletedList(node: BulletedListNode): string {
        const items = node.children.map(child => this.render(child)).join('');
        const html = `<ul>\n${items}</ul>`;
        return this.applyClass(html, node);
    }

    private renderEnumeratedList(node: EnumeratedListNode): string {
        const items = node.children.map(child => this.render(child)).join('');
        const html = `<ol>\n${items}</ol>`;
        return this.applyClass(html, node);
    }

    private renderListItem(node: ListItemNode): string {
        let contentHtml = '';
        let subListHtml = '';
        node.children.forEach(child => {
            if (child.type === NodeType.BulletedList || child.type === NodeType.EnumeratedList) {
                subListHtml += this.render(child);
            } else {
                contentHtml += this.render(child);
            }
        });
        return `<li>${contentHtml}${subListHtml}</li>\n`;
    }

    private renderDirective(node: DirectiveNode): string {
        const admonitionTypes = ['attention', 'caution', 'danger', 'error', 'hint', 'important', 'note', 'tip', 'warning'];
        const text = node.children.map(child => this.render(child)).join('');

        if (admonitionTypes.includes(node.name)) {
            const title = node.name.charAt(0).toUpperCase() + node.name.slice(1);
            const html = `<div class="admonition ${node.name}">\n<p class="admonition-title">${title}</p>\n<p>${text}</p>\n</div>`;
            return this.applyClass(html, node);
        }

        const html = `<div class="directive ${node.name}">\n<p>${text}</p>\n</div>`;
        return this.applyClass(html, node);
    }

    private renderLink(node: LinkNode): string {
        const text = node.children.map(child => this.render(child)).join('');
        return `<a href="${node.url}">${text}</a>`;
    }

    private renderImage(node: ImageNode): string {
        let attrs = `src="${node.src}"`;
        if (node.alt) attrs += ` alt="${node.alt}"`;
        if (node.width) attrs += ` width="${node.width}"`;
        if (node.height) attrs += ` height="${node.height}"`;
        return `<img ${attrs}>`;
    }

    private renderRole(node: RoleNode): string {
        const targetId = this.targets[node.target];
        if (node.name === 'ref' && targetId) {
            const text = node.children.map(child => this.render(child)).join('');
            return `<a href="#${targetId}">${text}</a>`;
        }
        return node.children.map(child => this.render(child)).join('');
    }

    private renderTarget(node: TargetNode): string {
        return `<a id="${node.identifier}"></a>`;
    }

    private renderContents(node: ContentsNode): string {
        const items = this.sections.map(section => `<li><a href="#${section.id}">${section.title}</a></li>`).join('\n');
        return `<div class="contents">\n<ul>\n${items}\n</ul>\n</div>`;
    }

    private renderFigure(node: FigureNode): string {
        let imgAttrs = `src="${node.src}"`;
        if (node.alt) imgAttrs += ` alt="${node.alt}"`;
        if (node.width) imgAttrs += ` width="${node.width}"`;
        if (node.height) imgAttrs += ` height="${node.height}"`;
        const imgTag = `<img ${imgAttrs}>`;

        const caption = node.children.map(child => this.render(child)).join('');
        const figcaptionTag = caption ? `<figcaption>${caption}</figcaption>` : '';

        const html = `<figure>\n${imgTag}\n${figcaptionTag}\n</figure>`;
        return this.applyClass(html, node);
    }

    private renderTable(node: TableNode): string {
        const header = node.children.find(child => child.type === NodeType.TableHeader);
        const rows = node.children.filter(child => child.type === NodeType.TableRow);

        const thead = header ? `<thead>\n${this.render(header)}</thead>` : '';
        const tbody = rows.length > 0 ? `<tbody>\n${rows.map(row => this.render(row)).join('')}</tbody>` : '';

        const html = `<table>\n${thead}\n${tbody}\n</table>`;
        return this.applyClass(html, node);
    }

    private renderTableHeader(node: TableHeaderNode): string {
        const cells = node.children.map(cell => this.render(cell, true)).join('');
        return `<tr>\n${cells}</tr>\n`;
    }

    private renderTableRow(node: TableRowNode): string {
        const cells = node.children.map(cell => this.render(cell)).join('');
        return `<tr>\n${cells}</tr>\n`;
    }

    private renderTableCell(node: TableCellNode, isHeader = false): string {
        const content = node.children.map(child => this.render(child)).join('');
        const tag = isHeader ? 'th' : 'td';
        return `<${tag}>${content}</${tag}>`;
    }

    private renderDefinitionList(node: DefinitionListNode): string {
        const items = node.children.map(child => this.render(child)).join('\n');
        const html = `<dl>\n${items}\n</dl>`;
        return this.applyClass(html, node);
    }

    private renderDefinitionListItem(node: DefinitionListItemNode): string {
        return node.children.map(child => this.render(child)).join('\n');
    }

    private renderDefinitionTerm(node: DefinitionTermNode): string {
        const text = node.children.map(child => this.render(child)).join('');
        return `<dt>${text}</dt>`;
    }

    private renderDefinition(node: DefinitionNode): string {
        const text = node.children.map(child => this.render(child)).join('');
        return `<dd>${text}</dd>`;
    }

    private renderClass(node: ClassNode): string {
        this.nextElementClass = node.className;
        return '';
    }

    private renderRaw(node: RawNode): string {
        if (node.format === 'html') {
            return node.content;
        }
        return '';
    }

    private applyClass<T extends { id?: string }>(html: string, node: T & Node): string {
        if (this.nextElementClass) {
            const classAttr = `class="${this.nextElementClass}"`;
            this.nextElementClass = null;
            return html.replace(/<(\w+)/, `<$1 ${classAttr}`);
        }
        return html;
    }
}
