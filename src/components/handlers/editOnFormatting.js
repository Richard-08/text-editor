import toggleBlockNode from "./formatting/toggleBlockNode";
import toggleInlineNode from "./formatting/toggleInlineNode";

export default function editOnFormatting(editor, e, data) {
  if (editor.hasActiveBlock()) {
    if (data.type === "block") {
      toggleBlockNode(editor, data);
    } else {
      toggleInlineNode(editor, data);
    }
  }
}
