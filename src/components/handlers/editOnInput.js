import Selection from "../utils/Selection";

export default function editOnInput(editor, e) {
  if (editor.hasSelectedBlock()) {
    const currentSelection = Selection.saveSelection(editor.state.activeBlock);
    const html = editor.state.activeBlock.innerHTML;
    const data = [...editor.state.blocks];
    data[editor.state.activeBlockIdx].content = html;

    editor.setState(
      (state) => ({
        blocks: data,
        selection: { ...state.selection, ...currentSelection },
      }),
      () => {
        Selection.restoreSelection(
          editor.state.activeBlock,
          editor.state.selection
        );
      }
    );
  }
}
