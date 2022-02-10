export default function (selection, node) {
  const range = selection.getRangeAt(0);
  const { firstChild, lastChild } = node;

  let startContainer = range.startContainer.contains(node) ? node : range.startContainer; 
  let endContainer = range.endContainer.contains(node) ? node : range.endContainer; 

  const previousRange = document.createRange();
  previousRange.setStartBefore(firstChild);
  previousRange.setEnd(startContainer, range.startOffset);

  const nextRange = document.createRange();
  nextRange.setStart(endContainer, range.endOffset);
  nextRange.setEndAfter(lastChild);

  const prev = document.createElement("div");
  const current = document.createElement("div");
  const next = document.createElement("div");

  const prevFragment = previousRange.cloneContents();
  const currentFragment = range.cloneContents();
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
