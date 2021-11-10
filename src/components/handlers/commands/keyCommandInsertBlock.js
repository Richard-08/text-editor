import Selection from "../../utils/Selection";

export default function keyCommandInsertBlock(editor) {
  if (editor.hasActiveBlock()) {
    const { isCollapsed } = editor.state.selection;

    if (isCollapsed || editor.singleLineSelection()) {
      insertOnNotSelection(editor);
    } else {
      insertOnSelection(editor);
    }
  }
}

function insertOnNotSelection(editor) {
  const block = editor.splitSelectedBlocks().splittedStartBlock;

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

function insertOnSelection(editor) {
  const { splittedStartBlock, splittedEndBlock } = editor.splitSelectedBlocks();
  const startContent = editor.getBlockContent(splittedStartBlock);
  const endContent = editor.getBlockContent(splittedEndBlock);

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
