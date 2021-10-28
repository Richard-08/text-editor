import Selection from "../utils/Selection";

export default function editOnKeyDown(e) {
  if (e.key === "Enter") {
    e.preventDefault();

    this.setState(
      (state) => {
        return {
          blocks: [
            ...state.blocks.slice(0, state.activeBlockIdx + 1),
            {
              type: "paragraph",
              tag: "p",
              content: "<br />",
            },
            ...state.blocks.slice(state.activeBlockIdx + 1),
          ],
        };
      },
      () => {
        Selection.restoreSelection(this.state.activeBlock.nextSibling);
      }
    );
  } else if (e.key === "Backspace") {
    const block_idx = this.state.activeBlockIdx;

    if (this.state.activeBlock.textContent.length === 0) {
      e.preventDefault();

      if (block_idx !== 0) {
        const block =
          this.editorRef.current.childNodes[this.state.activeBlockIdx - 1];
        const selectPosition = block.textContent.length;

        Selection.restoreSelection(block, {
          start: selectPosition,
          end: selectPosition,
        });

        this.setState((state) => {
          return {
            blocks: state.blocks.filter((_, idx) => idx !== block_idx),
          };
        });
      }
    }
  }
}
