import Selection from "../../utils/Selection";
import { removeLastChar } from "../../utils/helpers";

export default function keyCommandBackspace(editor) {
  if (editor.hasActiveBlock()) {
    if (editor.state.selection.isCollapsed) {
      editOnNotSelection(editor);
    } else {
      editOnSelection(editor);
    }
  }
}

/* ************************ Edit on not selection ************************* */

function editOnNotSelection(editor) {
  const { startBlockIdx, start, end } = editor.state.selection;
  const blockStartPosition = Array.from(editor.getRootNode().childNodes)
    .slice(0, startBlockIdx)
    .reduce((total, block) => total + block.textContent.length, 0);

  if (blockStartPosition === start && blockStartPosition === end) {
    removeBlock(editor);
  } else {
    removeCharacter(editor);
  }
}

function removeBlock(editor) {
  const selection = { ...editor.state.selection };
  const { startBlock, startBlockIdx } = selection;

  if (startBlockIdx !== 0) {
    const prevBlockNode =
      editor.editorRef.current.childNodes[startBlockIdx - 1];
    const selectPosition = prevBlockNode.textContent.length;

    editor.commitState(
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
          selection: {
            ...selection,
            startBlockIdx: startBlockIdx - 1,
            start: selectPosition,
            end: selectPosition,
          },
        };
      },
      () => {
        const { startBlockIdx, start, end } = editor.state.selection;
        const node = editor.getRootNode().childNodes[startBlockIdx];
        Selection.restoreSelection(node, { start, end });
      }
    );
  }
}

function removeCharacter(editor) {
  const selection = { ...editor.state.selection };
  const { startBlockIdx, start } = selection;
  const { prev, next } = editor.formattedSplitBlock();

  const char = prev.text[prev.text.length - 1];

  const formattedContent = {
    html: removeLastChar(prev.html, char) + next.html,
    text: prev.text.slice(0, prev.text.length - 1) + next.text,
  };

  const content = editor.getBlockContent(formattedContent);

  const data = [...editor.state.blocks];
  data[startBlockIdx] = {
    ...data[startBlockIdx],
    content: content,
  };

  const blockStartPosition = Array.from(editor.getRootNode().childNodes)
    .slice(0, startBlockIdx)
    .reduce((total, block) => total + block.textContent.length, 0);
  const cursorPosition =
    start -
    formattedContent.text.length -
    (blockStartPosition - formattedContent.text.length) - 1;

  console.log(cursorPosition);

  editor.setState(
    {
      blocks: data,
      selection: {
        ...selection,
        start: cursorPosition,
        end: cursorPosition,
      },
    },
    () => {
      const { startBlock, end, start } = editor.state.selection;
      Selection.restoreSelection(startBlock, { start, end });
    }
  );
}

/* ************************ Edit on selection ************************* */

function editOnSelection(editor) {
  if (editor.singleLineSelection()) {
    removeBlockContent(editor);
  } else {
    removeMultipleBlocksContent(editor);
  }
}

function removeBlockContent(editor) {
  const selection = { ...editor.state.selection };
  const { startBlockIdx } = selection;
  const { prev, next } = editor.formattedSplitBlock();

  const content = editor.getBlockContent({
    html: prev.html + next.html,
    text: prev.text + next.text,
  });
  const text = prev.text + next.text;

  const data = [...editor.state.blocks];
  data[startBlockIdx] = {
    ...data[startBlockIdx],
    content: content,
  };

  editor.commitState(
    {
      blocks: data,
      selection: {
        ...selection,
        start: text.length,
        end: text.length,
      },
    },
    () => {
      const { startBlock, start, end } = editor.state.selection;
      Selection.restoreSelection(startBlock, { start, end });
    }
  );
}

function removeMultipleBlocksContent(editor) {
  const { splittedStartBlock, splittedEndBlock } = editor.splitSelectedBlocks();
  const { startBlockIdx, endBlockIdx } = editor.state.selection;

  const startContent = editor.getBlockContent(splittedStartBlock);
  const endContent = editor.getBlockContent(splittedEndBlock);

  editor.commitState(
    (state) => {
      const block = {
        ...state.blocks[startBlockIdx],
        content: (startContent.text ? startContent.html : "") + endContent.html,
      };

      return {
        blocks: [
          ...state.blocks.slice(0, startBlockIdx),
          block,
          ...state.blocks.slice(endBlockIdx + 1),
        ],
        selection: {
          ...state.selection,
          start: startContent.text.length,
          end: startContent.text.length,
        },
      };
    },
    () => {
      const { startBlock, start, end } = editor.state.selection;
      Selection.restoreSelection(startBlock, { start, end });
    }
  );
}
