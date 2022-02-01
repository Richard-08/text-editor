import keyCommandInsertBlock from "./commands/keyCommandInsertBlock";
import keyCommandBackspace from "./commands/keyCommandBackspace";
import keyCommandRedo from "./commands/keyCommandRedo";
import keyCommandUndo from "./commands/keyCommandUndo";

export default function editOnKeyDown(editor, e) {
  let command = editor.defineCommand(e);

  if (command && command.name) {
    switch (command.name) {
      case "split-block":
        e.preventDefault();
        keyCommandInsertBlock(editor);
        break;

      case "backspace":
        e.preventDefault();
        keyCommandBackspace(editor);
        break;
      case "undo":
        e.preventDefault();
        keyCommandUndo(editor);
        break;
      case "redo":
        e.preventDefault();
        keyCommandRedo(editor);
        break;
      default:
        break;
    }
  }
}
