import keyCommandInsertBlock from "./commands/keyCommandInsertBlock";
import keyCommandBackspace from "./commands/keyCommandBackspace";
import keyCommandRedo from "./commands/keyCommandRedo";
import keyCommandUndo from "./commands/keyCommandUndo";

import { KEY_COMMANDS } from "../core/constants";

function defineCommand(e, commands) {
  return commands.find((command) => {
    if (command.modificator) {
      return e.key === command.keyName && e[command.modificator];
    }
    return e.key === command.keyName;
  });
}

export default function editOnKeyDown(editor, e) {
  let command = defineCommand(e, KEY_COMMANDS);

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
