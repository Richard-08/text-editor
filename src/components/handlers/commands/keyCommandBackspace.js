import Selection from "../../utils/Selection";

export default function keyCommandBackspace(editor) {
  if (editor.hasSelectedBlock()) {
    if (editor.state.selection.isCollapsed) {
      editOnNotSelection(editor);
    } else {
      editOnSelection(editor);
    }
  }
}

function editOnNotSelection(editor) {
  if (editor.state.selection.start === 0 && editor.state.selection.end === 0) {
    removeBlock(editor);
  } else {
    removeCharacter(editor);
  }
}

function removeBlock(editor) {
  const { startBlock, startBlockIdx } = editor.state.selection;

  if (startBlockIdx !== 0) {
    const prevBlockNode =
      editor.editorRef.current.childNodes[startBlockIdx - 1];
    const selectPosition = prevBlockNode.textContent.length;

    editor.setState(
      (state) => {
        if (startBlock.textContent.length) {
          const block = { ...state.blocks[startBlockIdx - 1] };
          state.blocks[startBlockIdx - 1] = {
            ...block,
            content: block.content + state.blocks[startBlockIdx].content,
          };
        }

        return {
          blocks: state.blocks.filter((_, idx) => idx !== startBlockIdx),
        };
      },
      () => {
        Selection.restoreSelection(prevBlockNode, {
          start: selectPosition,
          end: selectPosition,
        });
      }
    );
  }
}

function removeCharacter(editor) {
  const selection = Selection.getSelection();

  const splittedBlock = Selection.splitNode(
    selection,
    editor.state.selection.startBlock
  );
  console.log(splittedBlock);
}

function editOnSelection(editor) {
  const { startBlockIdx, endBlockIdx } = editor.state.selection;
  const selection = Selection.getSelection();

  const splittedStartBlock = Selection.splitNode(
    selection,
    editor.state.selection.startBlock
  );
  const splittedEndBlock =
    startBlockIdx === endBlockIdx
      ? splittedStartBlock
      : Selection.splitNode(selection, editor.state.selection.endBlock);

  if (startBlockIdx === endBlockIdx) {
    removeBlockContent(editor, splittedStartBlock);
  } else {
    removeMultipleBlocksContent(editor, splittedStartBlock, splittedEndBlock);
  }
}

function removeBlockContent(editor, block) {
  const { startBlockIdx } = editor.state.selection;

  const blockContent = editor.getBlockContent(block);

  editor.setState(
    (state) => {
      const data = [...state.blocks];
      data[startBlockIdx].content = blockContent.html;

      return {
        blocks: data,
      };
    },
    () => {
      Selection.restoreSelection(editor.state.selection.startBlock, {
        start: blockContent.text.length,
        end: blockContent.text.length,
      });
    }
  );
}

function removeMultipleBlocksContent(editor, startBlock, endBlock) {
  const { startBlockIdx, endBlockIdx } = editor.state.selection;

  const startContent = editor.getBlockContent(startBlock);
  const endContent = editor.getBlockContent(endBlock);

  editor.setState(
    (state) => {
      const block = {
        ...state.blocks[startBlockIdx],
        content: startContent.html + (endContent.text ? endContent.html : ""),
      };

      return {
        blocks: [
          ...state.blocks.slice(0, startBlockIdx),
          block,
          ...state.blocks.slice(endBlockIdx + 1),
        ],
      };
    },
    () => {
      Selection.restoreSelection(editor.state.selection.startBlock, {
        start: startContent.text.length,
        end: startContent.text.length,
      });
    }
  );
}
