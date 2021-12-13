import Selection from "../../utils/Selection";

export default function keyCommandRedo(editor) {
  if (editor.history[editor.currentStateIdx + 1]) {
    editor.currentStateIdx += 1;
    const nextState = editor.history[editor.currentStateIdx];

    editor.setState({ ...nextState }, () => {
      const { startBlockIdx, start, end } = nextState.selection; // NEED REFACTOR
      const block = editor.getRootNode().childNodes[startBlockIdx];
      Selection.restoreSelection(block, { start, end });
    });
  }
}
