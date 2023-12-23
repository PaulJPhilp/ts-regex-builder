import { type EncoderNode, EncoderPrecedence } from './types';

/**
 * Returns atomic pattern for given node.
 *
 * @param node
 * @returns
 */
export function toAtom(node: EncoderNode): string {
  if (node.precedence === EncoderPrecedence.Atom) {
    return node.pattern;
  }

  return `(?:${node.pattern})`;
}

export function concatNodes(nodes: EncoderNode[]): EncoderNode {
  if (nodes.length === 1) {
    return nodes[0]!;
  }

  return {
    precedence: EncoderPrecedence.Sequence,
    pattern: nodes
      .map((n) =>
        n.precedence > EncoderPrecedence.Sequence ? toAtom(n) : n.pattern
      )
      .join(''),
  };
}