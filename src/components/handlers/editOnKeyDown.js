import keyCommandInsertBlock from "./commands/keyCommandInsertBlock";
import keyCommandBackspace from "./commands/keyCommandBackspace";

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
  }
}
