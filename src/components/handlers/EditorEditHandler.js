import editOnKeyDown from "./editOnKeyDown";
import editOnBeforeInput from "./editOnBeforeInput";
import editOnSelect from "./editOnSelect";

const EditorEditHandler = {
  onKeyDown: editOnKeyDown,
  onBeforeInput: editOnBeforeInput,
  onSelect: editOnSelect,
};

export default EditorEditHandler;
