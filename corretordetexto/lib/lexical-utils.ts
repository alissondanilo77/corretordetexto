/**
 * Utilitários para trabalhar com Lexical Editor
 */

/**
 * Calcula a posição absoluta de um node no documento
 */
export function getAbsoluteOffsetOfNode(
  node: any,
  rootNode: any
): number {
  let offset = 0;
  const allNodes = rootNode.getAllTextNodes();
  
  for (const textNode of allNodes) {
    if (textNode === node) {
      return offset;
    }
    offset += textNode.getTextContent().length;
  }
  
  return -1;
}

/**
 * Encontra o node de texto em um determinado offset
 */
export function findNodeAtOffset(
  rootNode: any,
  targetOffset: number
): { node: any; offsetInNode: number } | null {
  const allNodes = rootNode.getAllTextNodes();
  let currentOffset = 0;

  for (const node of allNodes) {
    const length = node.getTextContent().length;
    if (currentOffset + length > targetOffset) {
      return {
        node,
        offsetInNode: targetOffset - currentOffset,
      };
    }
    currentOffset += length;
  }

  return null;
}

/**
 * Obtém o texto entre dois offsets
 */
export function getTextBetweenOffsets(
  rootNode: any,
  startOffset: number,
  endOffset: number
): string {
  const allNodes = rootNode.getAllTextNodes();
  let currentOffset = 0;
  let result = '';

  for (const node of allNodes) {
    const text = node.getTextContent();
    const nodeStart = currentOffset;
    const nodeEnd = currentOffset + text.length;

    if (nodeStart < endOffset && nodeEnd > startOffset) {
      const localStart = Math.max(0, startOffset - nodeStart);
      const localEnd = Math.min(text.length, endOffset - nodeStart);
      result += text.substring(localStart, localEnd);
    }

    currentOffset = nodeEnd;
  }

  return result;
}
