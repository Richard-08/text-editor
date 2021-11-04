import keyCommandInsertBlock from "./commands/keyCommandInsertBlock";
import keyCommandBackspace from "./commands/keyCommandBackspace";

export default function editOnKeyDown(editor, e) {
  if (e.key === "Enter") {
    e.preventDefault();
    
    keyCommandInsertBlock(editor);
  } else if (e.key === "Backspace") {
    e.preventDefault();

    keyCommandBackspace(editor);
  }
}
