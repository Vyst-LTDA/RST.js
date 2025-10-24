/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
export enum NodeType {
  Document = 'Document',
  Section = 'Section',
  Paragraph = 'Paragraph',
  Code = 'Code',
  Text = 'Text',
  Bold = 'Bold',
  Italic = 'Italic',
  Literal = 'Literal',
  BulletedList = 'BulletedList',
  EnumeratedList = 'EnumeratedList',
  ListItem = 'ListItem',
  Directive = 'Directive',
  Link = 'Link',
  Image = 'Image',
  Role = 'Role',
  Target = 'Target',
  Contents = 'Contents',
  Figure = 'Figure',
  Table = 'Table',
  TableRow = 'TableRow',
  TableHeader = 'TableHeader',
  TableCell = 'TableCell',
  FootnoteDefinition = 'FootnoteDefinition',
  FootnoteReference = 'FootnoteReference',
  DefinitionList = 'DefinitionList',
  DefinitionListItem = 'DefinitionListItem',
  DefinitionTerm = 'DefinitionTerm',
  Definition = 'Definition',
  Class = 'Class',
  Raw = 'Raw',
}

export interface Node {
  type: NodeType;
  children?: Node[];
}

export interface DocumentNode extends Node {
  type: NodeType.Document;
  children: Node[];
}

export interface SectionNode extends Node {
  type: NodeType.Section;
  level: number;
  children: Node[];
  id: string;
}

export interface ParagraphNode extends Node {
  type: NodeType.Paragraph;
  children: Node[];
}

export interface CodeNode extends Node {
  type: NodeType.Code;
  language?: string;
  text: string;
}

export interface TextNode extends Node {
    type: NodeType.Text;
    text: string;
}

export interface BoldNode extends Node {
    type: NodeType.Bold;
    children: Node[];
}

export interface ItalicNode extends Node {
    type: NodeType.Italic;
    children: Node[];
}

export interface LiteralNode extends Node {
    type: NodeType.Literal;
    text: string;
}

export interface BulletedListNode extends Node {
    type: NodeType.BulletedList;
    children: ListItemNode[];
}

export interface EnumeratedListNode extends Node {
    type: NodeType.EnumeratedList;
    children: ListItemNode[];
}

export interface ListItemNode extends Node {
    type: NodeType.ListItem;
    children: Node[];
}

export interface DirectiveNode extends Node {
    type: NodeType.Directive;
    name: string;
    children: Node[];
}

export interface LinkNode extends Node {
    type: NodeType.Link;
    url: string;
    children: Node[];
}

export interface ImageNode extends Node {
    type: NodeType.Image;
    src: string;
    alt?: string;
    width?: string;
    height?: string;
}

export interface RoleNode extends Node {
    type: NodeType.Role;
    name: string;
    target: string;
    children: Node[];
}

export interface TargetNode extends Node {
    type: NodeType.Target;
    identifier: string;
}

export interface ContentsNode extends Node {
    type: NodeType.Contents;
    depth: number;
}

export interface FigureNode extends Node {
    type: NodeType.Figure;
    src: string;
    alt?: string;
    width?: string;
    height?: string;
    children: Node[]; // For the caption
}

export interface TableNode extends Node {
    type: NodeType.Table;
    children: (TableHeaderNode | TableRowNode)[];
}

export interface TableHeaderNode extends Node {
    type: NodeType.TableHeader;
    children: TableCellNode[];
}

export interface TableRowNode extends Node {
    type: NodeType.TableRow;
    children: TableCellNode[];
}

export interface TableCellNode extends Node {
    type: NodeType.TableCell;
    children: Node[];
}

export interface FootnoteDefinitionNode extends Node {
    type: NodeType.FootnoteDefinition;
    label: string;
    children: Node[];
}

export interface FootnoteReferenceNode extends Node {
    type: NodeType.FootnoteReference;
    label: string;
}

export interface DefinitionListNode extends Node {
    type: NodeType.DefinitionList;
    children: DefinitionListItemNode[];
}

export interface DefinitionListItemNode extends Node {
    type: NodeType.DefinitionListItem;
    children: (DefinitionTermNode | DefinitionNode)[];
}

export interface DefinitionTermNode extends Node {
    type: NodeType.DefinitionTerm;
    children: Node[];
}

export interface DefinitionNode extends Node {
    type: NodeType.Definition;
    children: Node[];
}

export interface ClassNode extends Node {
    type: NodeType.Class;
    className: string;
}

export interface RawNode extends Node {
    type: NodeType.Raw;
    format: string;
    content: string;
}
