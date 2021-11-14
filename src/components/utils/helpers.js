export function getNodeHierarchy(node, parent) {
  const tags = [];
  while (node && node.parentNode && node !== parent) {
    tags.push(node.parentNode.nodeName.toLowerCase());
    node = node.parentNode;
  }
  return tags;
}

export function getBlockNode(node, selector) {
  const parentNode = node.nodeType === 3 ? node.parentNode : node;
  const blockNode =
    parentNode.dataset && parentNode.dataset.block
      ? parentNode
      : parentNode.closest(selector);
  const blockIdx = parseInt(blockNode.dataset.block);

  return {
    node: blockNode,
    index: blockIdx,
  };
}

const SPECIAL_CHARS = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  /* '"': "&quot;", */
};

export function htmlEntities(str) {
  const special_char = SPECIAL_CHARS[str];
  if (special_char) {
    const regexp = new RegExp(`${str}`);
    return str.replace(regexp, special_char);
  }

  return str;
}

export function removeLastChar(str, char) {
  const special_char = SPECIAL_CHARS[char];

  if (special_char) {
    const regexp = new RegExp(`${special_char}$`);
    return str.replace(regexp, "");
  }

  return str.slice(0, str.length - 1);
}

/* 
const fragment = document.createElement("div");
    fragment.textContent = str;
    return fragment.innerHTML;
  return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
  */

const OPEN_TAG_REGEX = /^<(\w+)>/;
const CLOSE_TAG_REGEX = /<\/(\w+)>$/;

function getTagName(str, type = "open") {
  const match = str.match(type === "open" ? OPEN_TAG_REGEX : CLOSE_TAG_REGEX);
  return match && match.length >= 1 ? match[1] : null;
}

export function removeTag(str, type = "open") {
  return str.replace(type === "open" ? OPEN_TAG_REGEX : CLOSE_TAG_REGEX, "");
}

export function hasSameTags(startStr, endStr) {
  const startTag = getTagName(startStr, "close");
  const endTag = getTagName(endStr);

  return startTag && endTag && startTag === endTag;
}
