import keyCommandInsertBlock from "./commands/keyCommandInsertBlock";
import keyCommandBackspace from "./commands/keyCommandBackspace";
import keyCommandRedo from "./commands/keyCommandRedo";
import keyCommandUndo from "./commands/keyCommandUndo";

export default function editOnKeyDown(editor, e) {
  switch (e.key) {
    case "Enter":
      e.preventDefault();
      keyCommandInsertBlock(editor);
      break;

    case "Backspace":
      e.preventDefault();
      keyCommandBackspace(editor);
      break;
    case "z":
      if (e.ctrlKey) {
        keyCommandUndo(editor);
      }
      break;
    case "y":
      if (e.ctrlKey) {
        keyCommandRedo(editor);
      }
      break;
    default:
      break;
  }
}
