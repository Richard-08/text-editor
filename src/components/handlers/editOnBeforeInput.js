import Selection from "../utils/Selection";
import { htmlEntities } from "../utils/helpers";

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
  const { startBlockIdx } = editor.state.selection;
  const { prev, next } = editor.formattedSplitBlock();

  const text = prev.html + htmlEntities(char) + next.html;

  const data = [...editor.state.blocks];
  data[startBlockIdx].content = text;

  editor.setState({ blocks: data }, () => {
    const cursorPosition = editor.state.selection.start + char.length;
    Selection.restoreSelection(editor.state.selection.startBlock, {
      start: cursorPosition,
      end: cursorPosition,
    });
  });
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
