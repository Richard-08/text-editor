import Selection from "../../utils/Selection";
import { removeAllTags, removeAllEmptyTags } from "../../utils/helpers";
import splitNodes from "../../utils/splitNodesWithMultiLineSelection";

export default function toggleInlineNode(editor, data) {
  if (editor.singleLineSelection()) {
    formatOnSingleLineSelection(editor, data);
  } else {
    formatOnMultiLineSelection(editor, data);
  }
}

function getFormattedContent(formatting, splittedBlock, data) {
  let formattingFragment = splittedBlock.current.html;

  if (formatting.includes(data.tag)) {
    formattingFragment = removeAllTags(formattingFragment, data.tag);
  } else {
    formattingFragment = `<${data.tag}>${formattingFragment}</${data.tag}>`;
  }

  const content =
    ((splittedBlock.prev && splittedBlock.prev.html) || "") +
    formattingFragment +
    ((splittedBlock.next && splittedBlock.next.html) || "");

  return removeAllEmptyTags(content);
}

function formatOnSingleLineSelection(editor, data) {
  const { splittedStartBlock } = editor.splitSelectedBlocks();
  const { startBlockIdx, formatting } = editor.state.selection;
  console.log(splittedStartBlock);

  const formattedContent = getFormattedContent(
    formatting,
    splittedStartBlock,
    data
  );
  console.log(formattedContent);

  /* editor.commitState(
    (state) => {
      const data = [...state.blocks];
      data[startBlockIdx] = {
        ...data[startBlockIdx],
        content: formattedContent,
      };

      return {
        blocks: data,
      };
    },
    () => {
      Selection.restoreSelection(
        editor.editorRef.current.childNodes[startBlockIdx],
        editor.state.selection
      );
    }
  ); */
}

function formatOnMultiLineSelection(editor, data) {
  const selection = window.getSelection();
  const { startBlock, endBlock, startBlockIdx, endBlockIdx, formatting } =
    editor.state.selection;
  const { start, end } = splitNodes(selection, startBlock, endBlock);

  console.log(start);
  const formatteStartdContent = getFormattedContent(formatting, start, data);
  console.log(formatteStartdContent);

  console.log(end);
  const formatteEnddContent = getFormattedContent(formatting, end, data);
  console.log(formatteEnddContent);
}
