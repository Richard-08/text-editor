export function getNodeHierarchy(node, parent) {
  let tags = [];
  if (node === parent) {
    tags.push(node.nodeName.toLowerCase());
    let childTags = [];
    let allTextNodes = true;
    node.childNodes.forEach((el) => {
      if (el.textContent.trim()) {
        childTags.push(el.nodeName.toLowerCase());
      }
      if (el.nodeType !== 3) {
        allTextNodes = false;
      }
    });
    if (
      !allTextNodes &&
      childTags.length &&
      childTags.every((tag) => tag === childTags[0])
    ) {
      tags = [...tags, ...childTags];
    }
  } else {
    while (node && node.parentNode && node !== parent) {
      tags.push(node.parentNode.nodeName.toLowerCase());
      node = node.parentNode;
    }
  }
  return tags;
}

export function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
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
const EMPTY_TAGS = /<(\w+)>((<(\w+)>)+(<\/(\w+)>)+)?<\/(\w+)>/gi;

function getTagName(str, type = "open") {
  const match = str.match(type === "open" ? OPEN_TAG_REGEX : CLOSE_TAG_REGEX);
  return match && match.length >= 1 ? match[1] : null;
}

export function removeTag(str, type = "open") {
  return str.replace(type === "open" ? OPEN_TAG_REGEX : CLOSE_TAG_REGEX, "");
}

export function removeAllTags(str, tagName) {
  const regex = new RegExp(`(<\/?(${tagName})([^>]+)?>)`, "gi");
  const result = str.replace(regex, "");
  return result;
}

export function removeAllEmptyTags(str) {
  return str.replace(EMPTY_TAGS, "");
}

export function hasSameTags(startStr, endStr) {
  const startTag = getTagName(startStr, "close");
  const endTag = getTagName(endStr);

  return startTag && endTag && startTag === endTag;
}

export function isEqual(arr1, arr2) {
  let result = true;
  for (let i = 0; i < arr1.length; i += 1) {
    const keys = Object.keys(arr1[i]);
    for (let j = 0; j < keys.length; j += 1) {
      if (!arr2[i] || arr2[i][j] || arr1[i][j] !== arr2[i][j]) {
        result = false;
        break;
      }
    }
  }

  return result;
}
