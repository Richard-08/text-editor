import Selection from "../utils/Selection";
import { htmlEntities, removeTag } from "../utils/helpers";

export default function editOnBeforeInput(editor, e) {
  e.preventDefault();
  const char = e.data;

  if (editor.hasActiveBlock() && char) {
    if (editor.state.selection.isCollapsed) {
      editOnNotSelection(editor, char, e);
    } else {
      editOnSelection(editor, char, e);
    }
  }
}

function editOnNotSelection(editor, char) {
  const { startBlock, startBlockIdx } = editor.state.selection;
  const currentSelection = Selection.saveSelection(startBlock);

  const { splittedStartBlock } = editor.splitSelectedBlocks();
  
  const text =
    removeTag(splittedStartBlock.prev.html, "close") + /// NEED FIX
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

function editOnSelection(editor, char) {
  //const { splittedStartBlock, splittedEndBlock } = editor.splitSelectedBlocks();

  if (editor.singleLineSelection()) {
    editBlockContent(editor, char);
  } else {
    editMultipleBlocksContent(editor, char);
  }
}

function editBlockContent(editor, char) {}

function editMultipleBlocksContent(editor, char) {}
