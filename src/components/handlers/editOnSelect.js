import Selection from "../utils/Selection";
import { getNodeHierarchy, getBlockNode } from "../utils/helpers";

export default function editOnSelect(editor, e) {
  const { isCollapsed, anchorNode, focusNode } = Selection.getSelection();

  if (anchorNode && focusNode) {
    const startBlock = getBlockNode(anchorNode, editor.blockSelector);
    const endBlock = isCollapsed
      ? startBlock
      : getBlockNode(focusNode, editor.blockSelector);

    const currentBlock = isCollapsed ? startBlock.node : endBlock.node;
    const { start, end } = Selection.saveSelection(currentBlock);

    const currentNode = isCollapsed ? anchorNode : focusNode;

    editor.setState({
      selection: {
        start,
        end,
        isCollapsed,
        tags: getNodeHierarchy(currentNode, currentBlock),
        startBlock:
          startBlock.index < endBlock.index ? startBlock.node : endBlock.node,
        startBlockIdx:
          startBlock.index < endBlock.index ? startBlock.index : endBlock.index,
        endBlock:
          startBlock.index > endBlock.index ? startBlock.node : endBlock.node,
        endBlockIdx:
          startBlock.index > endBlock.index ? startBlock.index : endBlock.index,
      },
      activeBlock: currentBlock,
      activeBlockIdx: parseInt(currentBlock.dataset.block),
    });
  }
}
