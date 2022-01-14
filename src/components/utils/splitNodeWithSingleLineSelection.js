export default function (selection, node) {
  const { focusOffset, focusNode, anchorOffset, anchorNode } = selection;
  const range = selection.getRangeAt(0);
  const { firstChild, lastChild } = node;

  const previousRange = document.createRange();
  previousRange.setStartBefore(firstChild);
  previousRange.setEnd(range.startContainer, range.startOffset);

  const currentRange = document.createRange();
  if (anchorOffset > focusOffset) {
    currentRange.setStart(focusNode, focusOffset);
  } else {
    currentRange.setStart(anchorNode, anchorOffset);
  }
  currentRange.setEndAfter(lastChild);

  const nextRange = document.createRange();
  nextRange.setStart(range.endContainer, range.endOffset);
  nextRange.setEndAfter(lastChild);

  const prev = document.createElement("div");
  const current = document.createElement("div");
  const next = document.createElement("div");

  const prevFragment = previousRange.cloneContents();
  const currentFragment = currentRange.cloneContents();
  const nextFragment = nextRange.cloneContents();

  prev.appendChild(prevFragment);
  current.appendChild(currentFragment);
  next.appendChild(nextFragment);

  return {
    prev: {
      text: prev.textContent,
      html: prev.innerHTML,
    },
    current: {
      text: current.textContent,
      html: current.innerHTML,
    },
    next: {
      text: next.textContent,
      html: next.innerHTML,
    },
  };
}
