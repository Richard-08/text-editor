export default function editOnKeyPress(editor, e) {
  let command = editor.defineCommand(e);

  if (
    command?.name !== "split-block" &&
    command?.name !== "undo" &&
    command?.name !== "redo" &&
    e.key !== "Control"
  ) {
    clearTimeout(editor.timer);

    editor.timer = setTimeout(() => {
      const blocks = [];
      const selection = { ...editor.state.selection };
      editor.state.blocks.forEach((block) => {
        blocks.push({ ...block });
      });

      editor.history.push({ blocks, selection });
      editor.currentStateIdx = editor.history.length - 1;
    }, editor.timeout);
  }
}
