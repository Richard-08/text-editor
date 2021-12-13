import Selection from "../../utils/Selection";

export default function toggleBlockNode(editor, value) {
  const { startBlockIdx, endBlockIdx } = editor.state.selection;

  editor.commitState(
    (state) => {
      const data = state.blocks
        .slice(startBlockIdx, endBlockIdx + 1)
        .map((block) => {
          return {
            ...block,
            tag: editor.singleLineSelection()
              ? block.tag === value.tag
                ? "p"
                : value.tag
              : value.tag,
          };
        });

      return {
        blocks: [
          ...state.blocks.slice(0, startBlockIdx),
          ...data,
          ...state.blocks.slice(endBlockIdx + 1),
        ],
      };
    },
    () => {
      Selection.restoreSelection(
        editor.editorRef.current.childNodes[endBlockIdx],
        editor.state.selection
      );
    }
  );
}
