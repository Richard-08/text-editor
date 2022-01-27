export const FORMATTING_PARAMS = [
  {
    tag: "h1",
    type: "block",
    name: "H1",
    tooltip: "Heading 1",
    role: "button",
  },
  {
    tag: "h2",
    type: "block",
    name: "H2",
    tooltip: "Heading 2",
    role: "button",
  },
  {
    tag: "h3",
    type: "block",
    name: "H3",
    tooltip: "Heading 3",
    role: "button",
  },
  {
    tag: "h4",
    type: "block",
    name: "H4",
    tooltip: "Heading 4",
    role: "button",
  },
  {
    tag: "h5",
    type: "block",
    name: "H5",
    tooltip: "Heading 5",
    role: "button",
  },
  {
    tag: "h6",
    type: "block",
    name: "H6",
    tooltip: "Heading 6",
    role: "button",
  },
  {
    tag: "p",
    type: "block",
    name: "P",
    tooltip: "Paragraph",
    role: "button",
  },
  {
    role: "separator",
  },
  {
    tag: "blockquote",
    type: "block",
    name: "Quote",
    tooltip: "Quote",
    role: "button",
  },
  {
    role: "separator",
  },
  {
    tag: "strong",
    type: "inline",
    name: "B",
    tooltip: "Bold",
    role: "button",
    styles: {
      fontWeight: "bold",
    },
  },
  {
    tag: "em",
    type: "inline",
    name: "I",
    tooltip: "Italic",
    role: "button",
    styles: {
      fontStyle: "italic",
    },
  },
  {
    tag: "code",
    type: "inline",
    name: "Code",
    tooltip: "Code",
    role: "button",
  },
  {
    tag: "mark",
    type: "inline",
    name: "Mark",
    tooltip: "Marked text",
    role: "button",
  },
  {
    tag: "del",
    type: "inline",
    name: "Del",
    tooltip: "Deleted text",
    role: "button",
  },
  {
    tag: "ins",
    type: "inline",
    name: "Ins",
    tooltip: "Inserted text",
    role: "button",
  },
  {
    tag: "sup",
    type: "inline",
    name: "Sup",
    tooltip: "Superscript text",
    role: "button",
  },
  {
    tag: "sub",
    type: "inline",
    name: "Sub",
    tooltip: "Subscript text",
    role: "button",
  },
];

export const INIT_STATE = {
  blocks: [
    {
      type: "paragraph",
      tag: "h1",
      content: "Title",
    },
    {
      type: "paragraph",
      tag: "p",
      content: "<em>Hello</em> <em>there!</em>",
    },
    {
      type: "paragraph",
      tag: "p",
      content: "Hi <strong><em>everyone!</em></strong>",
    },
  ],
  selection: {
    start: 0,
    end: 0,
    isCollapsed: true,
    formatting: [],
    startBlock: null,
    endBlock: null,
    startBlockIdx: null,
    endBlockIdx: null,
  },
};

export const KEY_COMMANDS = [
  {
    name: "split-block",
    keyName: "Enter",
    keyCode: 13,
  },
  {
    name: "backspace",
    keyName: "Backspace",
    keyCode: 8,
  },
  {
    name: "redo",
    keyName: "y",
    keyCode: 89,
    modificator: "ctrlKey",
  },
  {
    name: "undo",
    keyName: "z",
    keyCode: 90,
    modificator: "ctrlKey",
  },
];
