/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
export enum TokenType {
    Section,
    Paragraph,
    Code,
    Text,
    EOF,
    Bold,
    Italic,
    Literal,
    Directive,
    Indent,
    Dedent,
    ListItemMarker,
    Target,
    TableSeparatorLine,
    TableDataRow,
    FootnoteDefinition,
    FootnoteReference,
    DefinitionTerm,
}

export interface Token {
    type: TokenType;
    value: string;
    level?: number;
    language?: string;
    name?: string;
    marker?: string;
    isSeparator?: boolean;
    label?: string;
}
