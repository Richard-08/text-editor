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

  let formattingFragment = splittedStartBlock.current.html;

  formattingFragment = editor.formattedSplitContent(formattingFragment);

  formatting.forEach((tag) => {
    if (!editor.isBlockTag(tag)) {
      formattingFragment = `<${tag}>${formattingFragment}</${tag}>`;
    }
  });

  splittedStartBlock.current.html = formattingFragment;

  const formattedContent = getFormattedContent(
    formatting,
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
  const { startBlock, endBlock, startBlockIdx, endBlockIdx, formatting } =
    editor.state.selection;
  const { start, end } = splitNodes(selection, startBlock, endBlock);

  const formattedStartContent = getFormattedContent(formatting, start, data);
  const formattedEndContent = getFormattedContent(formatting, end, data);

  editor.commitState((state) => {
    const blocks = [...state.blocks];
    const start = {
      ...blocks[startBlockIdx],
      content: formattedStartContent,
    };
    const end = {
      ...blocks[endBlockIdx],
      content: formattedEndContent,
    };
    const intermediate = blocks
      .slice(startBlockIdx + 1, endBlockIdx)
      .map((block) => {
        return {
          ...block,
          content: `<${data.tag}>${block.content}</${data.tag}>`,
        };
      });

    return {
      blocks: [
        ...state.blocks.slice(0, startBlockIdx),
        start,
        ...intermediate,
        end,
        ...state.blocks.slice(endBlockIdx + 1),
      ],
    };
  });
}
