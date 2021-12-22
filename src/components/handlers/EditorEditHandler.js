import editOnBlur from "./editOnBlur";
import editOnFocus from "./editOnFocus";
import editOnSelect from "./editOnSelect";
import editOnKeyDown from "./editOnKeyDown";
import editOnKeyPress from "./editOnKeyPress";
import editOnFormatting from "./editOnFormatting";
import editOnBeforeInput from "./editOnBeforeInput";

const EditorEditHandler = {
  onBlur: editOnBlur,
  onFocus: editOnFocus,
  onSelect: editOnSelect,
  onKeyDown: editOnKeyDown,
  onKeyPress: editOnKeyPress,
  onFormatting: editOnFormatting,
  onBeforeInput: editOnBeforeInput,
};

export default EditorEditHandler;
