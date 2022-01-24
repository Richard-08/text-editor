import Selection from "../utils/Selection";
import { htmlEntities } from "../utils/helpers";

export default function editOnBeforeInput(editor, e) {
  e.preventDefault();
  const char = e.data;

  if (editor.hasActiveBlock() && char) {
    if (editor.state.selection.isCollapsed || editor.singleLineSelection()) {
      editOnSingleLineSelection(editor, char);
    } else {
      editOnMultiLineSelection(editor, char);
    }
  }
}

function editOnSingleLineSelection(editor, char) {
  const { startBlockIdx } = editor.state.selection;
  const { prev, next } = editor.formattedSplitBlock();

  const content = prev.html + htmlEntities(char) + next.html;

  const data = [...editor.state.blocks];
  data[startBlockIdx] = {
    ...data[startBlockIdx],
    content: content,
  };

  editor.setState({ blocks: data }, () => {
    const cursorPosition = editor.state.selection.start + char.length;
    Selection.restoreSelection(editor.getRootNode(), {
      start: cursorPosition,
      end: cursorPosition,
    });
  });
}

function editOnMultiLineSelection(editor, char) {
  const { splittedStartBlock, splittedEndBlock } = editor.splitSelectedBlocks();
  const { startBlockIdx, endBlockIdx } = editor.state.selection;

  const startContent = editor.getBlockContent(splittedStartBlock);
  const endContent = editor.getBlockContent(splittedEndBlock);

  editor.commitState(
    (state) => {
      const block = {
        ...state.blocks[startBlockIdx],
        content:
          (startContent.text ? startContent.html : "") +
          htmlEntities(char) +
          (endContent.text ? endContent.html : ""),
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
      const cursorPosition = startContent.text.length + char.length;
      Selection.restoreSelection(editor.state.selection.startBlock, {
        start: cursorPosition,
        end: cursorPosition,
      });
    }
  );
}
