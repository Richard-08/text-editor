import "./Editor.css";

import Toolbar from "../controls/Toolbar";
import Block from "../contents/Block";
import Selection from "../utils/Selection";
import EditorEditHandler from "../handlers/EditorEditHandler";
import { getBlockNode, removeTag, hasSameTags } from "../utils/helpers";

import React, { Component } from "react";

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blocks: [
        {
          type: "paragraph",
          tag: "h1",
          content: "Title",
        },
        {
          type: "paragraph",
          tag: "p",
          content: "Hello <em>there!</em>",
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
        tags: [],
        startBlock: null,
        endBlock: null,
        startBlockIdx: null,
        endBlockIdx: null,
      },
    };

    this.blockSelector = "[data-block]";

    this.editorRef = React.createRef();

    this.handler = EditorEditHandler;

    this.handleFocus = this.buildHandler("onFocus");
    this.handleBlur = this.buildHandler("onBlur");
    this.handleKeyDown = this.buildHandler("onKeyDown");
    this.handleBeforeInput = this.buildHandler("onBeforeInput");
    this.handleSelect = this.buildHandler("onSelect");
    this.handleControl = this.buildHandler("onFormatting");
  }

  handleFocus(e) {
    console.log(e);
  }

  handleBlur(e) {
    console.log(e);
  }

  buildHandler(eventName) {
    return (e, data) => {
      const method = this.handler[eventName];
      if (method) {
        method(this, e, data);
      }
    };
  }

  hasActiveBlock() {
    const { startBlock, startBlockIdx, endBlock } = this.state.selection;

    if (startBlock && endBlock) {
      const { isCollapsed, anchorNode, focusNode } = window.getSelection();
      const anchorBlock = getBlockNode(anchorNode, this.blockSelector);
      const focusBlock = isCollapsed
        ? anchorBlock
        : getBlockNode(focusNode, this.blockSelector);

      if (isCollapsed) {
        return (
          anchorBlock.node.isEqualNode(startBlock) &&
          anchorBlock.index === startBlockIdx
        );
      }

      return anchorBlock.index < focusBlock.index
        ? anchorBlock.node.isEqualNode(startBlock) &&
            focusBlock.node.isEqualNode(endBlock)
        : anchorBlock.node.isEqualNode(endBlock) &&
            focusBlock.node.isEqualNode(startBlock);
    }
  }

  splitSelectedBlocks() {
    const { isCollapsed, startBlock, endBlock } = this.state.selection;
    const selection = Selection.getSelection();

    const splittedStartBlock = Selection.splitNode(selection, startBlock);
    const splittedEndBlock =
      isCollapsed || this.singleLineSelection()
        ? splittedStartBlock
        : Selection.splitNode(selection, endBlock);

    return {
      splittedStartBlock,
      splittedEndBlock,
    };
  }

  formattedSplitBlock() {
    const { splittedStartBlock } = this.splitSelectedBlocks();

    let startContent = splittedStartBlock.prev.html;
    let endContent = splittedStartBlock.next.html;

    while (hasSameTags(startContent, endContent)) {
      startContent = removeTag(startContent, "close");
      endContent = removeTag(endContent);
    }
    return {
      prev: {
        html: startContent,
        text: splittedStartBlock.prev.text,
      },
      next: {
        html: endContent,
        text: splittedStartBlock.next.text,
      },
    };
  }

  singleLineSelection() {
    return (
      this.state.selection.startBlockIdx === this.state.selection.endBlockIdx
    );
  }

  getBlockContent(block) {
    if (block.prev && block.next) {
      return {
        text: block.prev.text || block.next.text,
        html: block.prev.text
          ? block.prev.html
          : block.next.text
          ? block.next.html
          : "<br>",
      };
    } else {
      return block.text ? block.html : "<br>";
    }
  }

  render() {
    return (
      <div className="text-editor">
        <Toolbar
          handleControl={this.handleControl}
          selection={this.state.selection}
        />
        <div
          className="editor"
          contentEditable
          suppressContentEditableWarning
          onKeyDown={this.handleKeyDown}
          onBeforeInput={this.handleBeforeInput}
          onSelect={this.handleSelect}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          ref={this.editorRef}
        >
          {this.state.blocks.map((item, i) => (
            <Block data={item} index={i} key={i} />
          ))}
        </div>
      </div>
    );
  }
}
