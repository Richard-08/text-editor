import Selection from "../utils/Selection";

export default function editOnSelect(editor, e) {
  const { isCollapsed, anchorNode, anchorOffset, focusNode, focusOffset } =
    Selection.getSelection();

  if (anchorNode && focusNode) {
    const rootNode = editor.getRootNode();
    let startBlock;
    let endBlock;

    if (anchorNode === rootNode && focusNode === rootNode) {
      startBlock = editor.getBlockNode(rootNode.childNodes[anchorOffset]);
      endBlock = editor.getBlockNode(
        rootNode.childNodes[focusOffset > 0 ? focusOffset - 1 : focusOffset]
      );
    } else {
      startBlock = editor.getBlockNode(anchorNode);
      endBlock = isCollapsed ? startBlock : editor.getBlockNode(focusNode);
    }

    const { start, end } = Selection.saveSelection(rootNode);

    const formatting = editor.getBlocksFormatting(
      startBlock.node,
      endBlock.node
    );

    editor.setState({
      selection: {
        start,
        end,
        isCollapsed,
        formatting: formatting,
        startBlock:
          startBlock.index < endBlock.index ? startBlock.node : endBlock.node,
        startBlockIdx:
          startBlock.index < endBlock.index ? startBlock.index : endBlock.index,
        endBlock:
          startBlock.index > endBlock.index ? startBlock.node : endBlock.node,
        endBlockIdx:
          startBlock.index > endBlock.index ? startBlock.index : endBlock.index,
      },
    });
  }
}
