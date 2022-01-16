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
      const blocks = [...state.blocks];
      const selection = { ...state.selection };
      const index = selection.startBlockIdx;

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
        selection: {
          ...selection,
          startBlockIdx: index + 1,
        },
      };
    },
    () => {
      const index = editor.state.selection.startBlockIdx;
      Selection.restoreSelection(editor.getRootNode().childNodes[index]);
    }
  );
}

function insertOnSelection(editor) {
  const { splittedStartBlock, splittedEndBlock } = editor.splitSelectedBlocks();
  const startContent = editor.getBlockContent(splittedStartBlock);
  const endContent = editor.getBlockContent(splittedEndBlock);

  editor.commitState(
    (state) => {
      const selection = { ...state.selection };
      const { startBlockIdx, endBlockIdx } = selection;

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
        selection: {
          ...selection,
          startBlockIdx: startBlockIdx + 1,
        },
      };
    },
    () => {
      const block =
        editor.editorRef.current.childNodes[
          editor.state.selection.startBlockIdx
        ];
      Selection.restoreSelection(block);
    }
  );
}
