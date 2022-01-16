export default function (selection, startNode, endNode) {
  const { focusOffset, focusNode, anchorOffset, anchorNode } = selection;
  let splittedStartNode;
  let splittedEndNode;

  if (startNode.contains(focusNode)) {
    splittedStartNode = getSplittedNode(focusOffset, focusNode, startNode);
    splittedEndNode = getSplittedNode(anchorOffset, anchorNode, endNode);
  } else {
    splittedStartNode = getSplittedNode(anchorOffset, anchorNode, startNode);
    splittedEndNode = getSplittedNode(focusOffset, focusNode, endNode);
  }

  return {
    start: splittedStartNode,
    end: {
      current: splittedEndNode.prev,
      next: splittedEndNode.current,
    },
  };
}

function getSplittedNode(offset, selectedNode, node) {
  const { firstChild, lastChild } = node;

  const prevRange = document.createRange();
  prevRange.setStartBefore(firstChild);
  prevRange.setEnd(selectedNode, offset);

  const currentRange = document.createRange();
  currentRange.setStart(selectedNode, offset);
  currentRange.setEndAfter(lastChild);

  const prev = document.createElement("div");
  const current = document.createElement("div");

  const prevFragment = prevRange.cloneContents();
  const currentFragment = currentRange.cloneContents();

  prev.appendChild(prevFragment);
  current.appendChild(currentFragment);

  return {
    prev: {
      text: prev.textContent,
      html: prev.innerHTML,
    },
    current: {
      text: current.textContent,
      html: current.innerHTML,
    },
  };
}
