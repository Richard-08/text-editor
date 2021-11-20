import Selection from "../../utils/Selection";

export default function toggleBlockNode(editor, data) {
  if (editor.singleLineSelection()) {
    formatOnSingleLineSelection(editor, data);
  } else {
    formatOnMultiLineSelection(editor, data);
  }
}

function formatOnSingleLineSelection(editor, value) {
  const { startBlockIdx } = editor.state.selection;

  editor.setState(
    (state) => {
      const data = [...state.blocks];
      const block = { ...data[startBlockIdx] };

      data[startBlockIdx] = {
        ...block,
        tag: block.tag === value.tag ? "p" : value.tag,
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

function formatOnMultiLineSelection(editor, value) {}
