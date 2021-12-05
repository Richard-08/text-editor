import Selection from "../../utils/Selection";
import { removeAllTags } from "../../utils/helpers";

export default function toggleInlineNode(editor, data) {
  if (editor.singleLineSelection()) {
    formatOnSingleLineSelection(editor, data);
  } else {
    formatOnMultiLineSelection(editor, data);
  }
}

function formatOnSingleLineSelection(editor, data) {
  const { splittedStartBlock, splittedEndBlock } = editor.splitSelectedBlocks();
  const { tags, startBlockIdx } = editor.state.selection;
  console.log(splittedStartBlock, splittedEndBlock);

  let formattingFragment = splittedStartBlock.current.html;
  let filtered_tags = [...tags];

  if (tags.includes(data.tag)) {
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
  console.log(formattingFragment);

  const content =
    splittedStartBlock.prev.html +
    formattingFragment +
    splittedStartBlock.next.html;

  editor.setState(
    (state) => {
      const data = [...state.blocks];
      data[startBlockIdx].content = content;

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

function formatOnMultiLineSelection(editor, data) {}
