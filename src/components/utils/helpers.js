export function getNodeHierarchy(node, parent) {
  const tags = [];
  while (node && node.parentNode && node !== parent) {
    tags.push(node.parentNode.nodeName.toLowerCase());
    node = node.parentNode;
  }
  return tags;
}

export function getBlockNode(node, selector) {
  const parentNode = node.nodeType === 3 ? node.parentNode : node;
  const blockNode =
    parentNode.dataset && parentNode.dataset.block
      ? parentNode
      : parentNode.closest(selector);
  const blockIdx = parseInt(blockNode.dataset.block);

  return {
    node: blockNode,
    index: blockIdx,
  };
}