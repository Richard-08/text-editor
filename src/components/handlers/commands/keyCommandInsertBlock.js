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

  editor.commitState(
    (state) => {
      const index = state.selection.startBlockIdx;
      const blocks = [...state.blocks];
      blocks[index] = {
        ...blocks[index],
        content: editor.getBlockContent(block.prev),
      };

      return {
        blocks: [
          ...blocks.slice(0, index + 1),
          {
            ...blocks[index],
            content: editor.getBlockContent(block.next),
          },
          ...blocks.slice(index + 1),
        ],
      };
    },
    () => {
      Selection.restoreSelection(editor.state.selection.startBlock.nextSibling);
    }
  );
}

function insertOnSelection(editor) {
  const { splittedStartBlock, splittedEndBlock } = editor.splitSelectedBlocks();
  const startContent = editor.getBlockContent(splittedStartBlock);
  const endContent = editor.getBlockContent(splittedEndBlock);

  editor.commitState(
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
