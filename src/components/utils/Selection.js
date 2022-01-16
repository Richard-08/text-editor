const Selection = {
  getSelection() {
    return window.getSelection();
  },

  saveSelection(el) {
    const range = window.getSelection().getRangeAt(0);
    const preSelectionRange = range.cloneRange();

    preSelectionRange.selectNodeContents(el);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);

    const start = preSelectionRange.toString().length;

    return {
      start: start,
      end: start + range.toString().length,
    };
  },

  restoreSelection(el, savedSelection = { start: 0, end: 0 }) {
    let charIndex = 0;

    const range = document.createRange();
    range.setStart(el, 0);
    range.collapse(true);

    const nodeStack = [el];
    let node;
    let foundStart = false;
    let stop = false;

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType === 3) {
        let nextCharIndex = charIndex + node.length;
        if (
          !foundStart &&
          savedSelection.start >= charIndex &&
          savedSelection.start <= nextCharIndex
        ) {
          range.setStart(node, savedSelection.start - charIndex);
          foundStart = true;
        }
        if (
          foundStart &&
          savedSelection.end >= charIndex &&
          savedSelection.end <= nextCharIndex
        ) {
          range.setEnd(node, savedSelection.end - charIndex);
          stop = true;
        }
        charIndex = nextCharIndex;
      } else {
        let i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  },
};

export default Selection;
