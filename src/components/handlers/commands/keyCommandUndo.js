import Selection from "../../utils/Selection";

export default function keyCommandUndo(editor) {
  if (editor.history[editor.currentStateIdx - 1]) {
    editor.currentStateIdx -= 1;
    editor.history = editor.history.slice(0, editor.currentStateIdx + 1);
    const prevState = editor.history[editor.currentStateIdx];

    editor.setState(
      {
        blocks: [...prevState.blocks],
        selection: { ...prevState.selection },
      },
      () => {
        const { startBlockIdx, start, end } = editor.state.selection;
        const block =
          startBlockIdx === null
            ? editor.getRootNode().lastChild
            : editor.getRootNode().childNodes[startBlockIdx];
        Selection.restoreSelection(block, { start, end });
      }
    );
  }
}
