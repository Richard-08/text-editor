import editOnFocus from "./editOnFocus";
import editOnBlur from "./editOnBlur";
import editOnKeyDown from "./editOnKeyDown";
import editOnBeforeInput from "./editOnBeforeInput";
import editOnSelect from "./editOnSelect";
import editOnFormatting from "./editOnFormatting";

const EditorEditHandler = {
  onFocus: editOnFocus,
  onBlur: editOnBlur,
  onKeyDown: editOnKeyDown,
  onBeforeInput: editOnBeforeInput,
  onSelect: editOnSelect,
  onFormatting: editOnFormatting,
};

export default EditorEditHandler;
