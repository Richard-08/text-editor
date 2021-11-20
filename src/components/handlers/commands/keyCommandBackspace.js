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
  const { start, end } = editor.state.selection;
  if (0 === start && 0 === end) {
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
  const { startBlockIdx } = editor.state.selection;
  const { prev, next } = editor.formattedSplitBlock();

  const char = prev.text[prev.text.length - 1];

  const content = editor.getBlockContent({
    html: removeLastChar(prev.html, char) + next.html,
    text: prev.text.slice(0, prev.text.length - 1) + next.text,
  });

  const data = [...editor.state.blocks];
  data[startBlockIdx] = {
    ...data[startBlockIdx],
    content: content,
  };

  editor.setState({ blocks: data }, () => {
    const cursorPosition = editor.state.selection.start - 1;
    Selection.restoreSelection(editor.state.selection.startBlock, {
      start: cursorPosition,
      end: cursorPosition,
    });
  });
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
  const { startBlockIdx } = editor.state.selection;
  const { prev, next } = editor.formattedSplitBlock();

  const content = editor.getBlockContent({
    html: prev.html + next.html,
    text: prev.text + next.text,
  });

  const data = [...editor.state.blocks];
  data[startBlockIdx] = {
    ...data[startBlockIdx],
    content: content,
  };

  editor.setState({ blocks: data }, () => {
    const { start, end } = editor.state.selection;

    Selection.restoreSelection(editor.state.selection.startBlock, {
      start,
      end,
    });
  });
}

function removeMultipleBlocksContent(editor) {
  const { splittedStartBlock, splittedEndBlock } = editor.splitSelectedBlocks();
  const { startBlockIdx, endBlockIdx } = editor.state.selection;

  const startContent = editor.getBlockContent(splittedStartBlock);
  const endContent = editor.getBlockContent(splittedEndBlock);

  editor.setState(
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
