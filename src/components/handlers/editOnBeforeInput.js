import Selection from "../utils/Selection";
import { htmlEntities, removeTag } from "../utils/helpers";

export default function editOnBeforeInput(editor, e) {
  e.preventDefault();
  const char = e.data;

  if (editor.hasSelectedBlock() && char) {
    if (editor.state.selection.isCollapsed) {
      editOnSingleLineSelection(editor, char, e);
    } else {
      editOnMultipleLineSelection(editor, char, e);
    }
  }
}

function editOnSingleLineSelection(editor, char, e) {
  const { startBlock, startBlockIdx } = editor.state.selection;
  const currentSelection = Selection.saveSelection(startBlock);
  const selection = Selection.getSelection();

  const splittedStartBlock = Selection.splitNode(selection, startBlock);

  const text =
    removeTag(splittedStartBlock.prev.html, "close") +
    htmlEntities(char) +
    removeTag(splittedStartBlock.next.html);

  const data = [...editor.state.blocks];
  data[startBlockIdx].content = text;

  editor.setState(
    (state) => ({
      blocks: data,
      selection: { ...state.selection, ...currentSelection },
    }),
    () => {
      const cursorPosition = editor.state.selection.start + char.length;
      Selection.restoreSelection(editor.state.selection.startBlock, {
        start: cursorPosition,
        end: cursorPosition,
      });
    }
  );
}

function editOnMultipleLineSelection(editor, char, e) {
  console.log(e);
}
