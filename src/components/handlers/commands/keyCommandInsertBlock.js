import Selection from "../../utils/Selection";

export default function keyCommandInsertBlock(editor) {
  if (editor.hasSelectedBlock()) {
    const selection = Selection.getSelection();

    const splittedStartBlock = Selection.splitNode(
      selection,
      editor.state.selection.startBlock
    );
    const splittedEndBlock = editor.state.selection.isCollapsed
      ? splittedStartBlock
      : Selection.splitNode(selection, editor.state.selection.endBlock);

    if (editor.state.selection.isCollapsed) {
      insertOnSingleLineSelection(editor, splittedStartBlock);
    } else {
      insertOnMultipleLineSelection(
        editor,
        splittedStartBlock,
        splittedEndBlock
      );
    }
  }
}

function insertOnSingleLineSelection(editor, block) {
  editor.setState(
    (state) => {
      const index = state.selection.startBlockIdx;
      state.blocks[index].content = editor.getBlockContent(block.prev);

      return {
        blocks: [
          ...state.blocks.slice(0, index + 1),
          {
            ...state.blocks[index],
            content: editor.getBlockContent(block.next),
          },
          ...state.blocks.slice(index + 1),
        ],
      };
    },
    () => {
      Selection.restoreSelection(editor.state.activeBlock.nextSibling);
    }
  );
}

function insertOnMultipleLineSelection(editor, startBlock, endBlock) {
  const startContent = editor.getBlockContent(startBlock);
  const endContent = editor.getBlockContent(endBlock);

  editor.setState(
    (state) => {
      const { startBlockIdx, endBlockIdx } = state.selection;

      const startBlock = {
        ...state.blocks[startBlockIdx],
        content: startContent.html,
      };
      const endBlock = { ...startBlock, content: endContent.html };

      return {
        blocks: [
          ...state.blocks.slice(0, startBlockIdx),
          startBlock,
          endBlock,
          ...state.blocks.slice(endBlockIdx + 1),
        ],
      };
    },
    () => {
      const block =
        editor.editorRef.current.childNodes[
          editor.state.selection.startBlockIdx + 1
        ];
      Selection.restoreSelection(block);
    }
  );
}
