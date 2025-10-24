/*
 * Copyright (c) Vyst, LTDA. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/
import { Lexer } from './core/lexer';
import { Parser } from './core/parser';
import { HtmlRenderer, CustomRenderers } from './rendering/renderer';
import { TokenType } from './core/lexer_types';

export { Lexer, Parser, HtmlRenderer, CustomRenderers, TokenType };

export interface RenderOptions {
    /**
     * An object containing custom rendering functions for different node types.
     */
    customRenderers?: CustomRenderers;
}

/**
 * Renders a ReStructuredText string to HTML.
 *
 * @param rst The ReStructuredText string to render.
 * @param options An optional object of rendering options.
 * @returns The rendered HTML.
 */
export function renderRst(rst: string, options: RenderOptions = {}): string {
    const lexer = new Lexer(rst);
    const parser = new Parser(lexer);
    const ast = parser.parse();

    const renderer = new HtmlRenderer(parser.targets, parser.sections, parser.footnoteDefinitions, options.customRenderers);
    return renderer.render(ast);
}
