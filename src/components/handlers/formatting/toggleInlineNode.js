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

function getFormattedContent(editor, splittedBlock, data) {
  const { formatting } = editor.state.selection;

  let formattingFragment = splittedBlock.current.html;
  let filtered_tags = [...formatting];

  if (formatting.includes(data.tag)) {
    formattingFragment = removeAllTags(formattingFragment, data.tag);
    filtered_tags = filtered_tags.filter((tag) => tag !== data.tag);
  } else {
    filtered_tags.push(data.tag);
  }

  formattingFragment = editor.formattedSplitContent(formattingFragment);

  filtered_tags.forEach((tag) => {
    if (!editor.isBlockTag(tag)) {
      formattingFragment = `<${tag}>${formattingFragment}</${tag}>`;
    }
  });

  const content =
    ((splittedBlock.prev && splittedBlock.prev.html) || "") +
    formattingFragment +
    ((splittedBlock.next && splittedBlock.next.html) || "");

  return removeAllEmptyTags(content);
}

function formatOnSingleLineSelection(editor, data) {
  const { splittedStartBlock } = editor.splitSelectedBlocks();
  const { startBlockIdx } = editor.state.selection;

  const formattedContent = getFormattedContent(
    editor,
    splittedStartBlock,
    data
  );
  
  editor.commitState(
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
  );
}

function formatOnMultiLineSelection(editor, data) {
  const selection = window.getSelection();
  const { startBlock, endBlock, startBlockIdx, endBlockIdx } =
    editor.state.selection;
  const { start, end } = splitNodes(selection, startBlock, endBlock);

  console.log(start);
  const formatteStartdContent = getFormattedContent(editor, start, data);
  console.log(formatteStartdContent);

  console.log(end);
  const formatteEnddContent = getFormattedContent(editor, end, data);
  console.log(formatteEnddContent);
}
