import React, { Component } from "react";
import "./Editor.css";

import Toolbar from "../controls/Toolbar";
import Block from "../contents/Block";
import Selection from "../utils/Selection";
import EditorEditHandler from "../handlers/EditorEditHandler";
import {
  removeTag,
  hasSameTags,
  getNodeHierarchy,
  intersection,
} from "../utils/helpers";
import { FORMATTING_PARAMS, INIT_STATE, KEY_COMMANDS } from "./constants";
import splitNode from "../utils/splitNodeWithSingleLineSelection";

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = INIT_STATE;

    this.history = [INIT_STATE];
    this.currentStateIdx = 0;
    this.canMakeHistoryRecord = false;

    this.timer = null;
    this.timeout = 500;

    this.blockSelector = "[data-block]";
    this.editorRef = React.createRef();

    this.handler = EditorEditHandler;

    this.handleFocus = this.buildHandler("onFocus");
    this.handleBlur = this.buildHandler("onBlur");
    this.handleKeyDown = this.buildHandler("onKeyDown");
    this.handleKeyPress = this.buildHandler("onKeyPress");
    this.handleBeforeInput = this.buildHandler("onBeforeInput");
    this.handleSelect = this.buildHandler("onSelect");
    this.handleControl = this.buildHandler("onFormatting");
  }

  componentDidUpdate(prevProps, prevState) {
    clearTimeout(this.timer);
    if (this.canMakeHistoryRecord) {
      this.history = this.history.slice(0, this.currentStateIdx + 1);
      this.history.push(this.state);
      this.currentStateIdx = this.history.length - 1;

      //console.log(this.history);
      this.canMakeHistoryRecord = false;
    }
  }

  buildHandler(eventName) {
    return (e, data) => {
      const method = this.handler[eventName];
      if (method) {
        method(this, e, data);
      }
    };
  }

  commitState(state, callback) {
    this.setState(state, callback);
    this.canMakeHistoryRecord = true;
  }

  hasActiveBlock() {
    const { startBlock, startBlockIdx, endBlock } = this.state.selection;

    if (startBlock && endBlock) {
      const { isCollapsed, anchorNode, focusNode } = window.getSelection();
      const anchorBlock = this.getBlockNode(anchorNode);
      const focusBlock = isCollapsed
        ? anchorBlock
        : this.getBlockNode(focusNode);

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

    const splittedStartBlock = splitNode(selection, startBlock);
    const splittedEndBlock =
      isCollapsed || this.singleLineSelection()
        ? splittedStartBlock
        : splitNode(selection, endBlock);

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

  formattedSplitContent(str) {
    let content = str;

    while (hasSameTags(content, content)) {
      content = removeTag(content, "close");
      content = removeTag(content);
    }

    return content;
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

  getBlockNode(node) {
    let root = this.getRootNode();
    if (node !== root) {
      const parentNode = node.nodeType === 3 ? node.parentNode : node;
      const blockNode =
        parentNode.dataset && parentNode.dataset.block
          ? parentNode
          : parentNode.closest(this.blockSelector);
      const blockIdx = parseInt(blockNode.dataset.block);

      return {
        node: blockNode,
        index: blockIdx,
      };
    }
    let { anchorOffset } = window.getSelection();

    return {
      node: root.childNodes[anchorOffset],
      index: anchorOffset,
    };
  }

  getBlocksFormatting(startBlock, endBlock) {
    let root = this.getRootNode();
    let { isCollapsed, anchorNode, anchorOffset, focusNode, focusOffset } =
      Selection.getSelection();

    if (isCollapsed) {
      return getNodeHierarchy(anchorNode, startBlock);
    } else {
      if (!anchorNode.textContent.slice(anchorOffset).length) {
        return getNodeHierarchy(focusNode, endBlock);
      } else if (!focusNode.textContent.slice(0, focusOffset).length) {
        return getNodeHierarchy(anchorNode, startBlock);
      } else if (anchorNode === root || focusNode === root) {
        return getNodeHierarchy(startBlock, startBlock);
      }
      return intersection(
        getNodeHierarchy(anchorNode, startBlock),
        getNodeHierarchy(focusNode, endBlock)
      );
    }
  }

  isBlockTag(value) {
    const data = FORMATTING_PARAMS.find(
      (param) => param.tag === value.toLowerCase()
    );
    return data && data.type === "block";
  }

  getRootNode() {
    return this.editorRef.current;
  }

  defineCommand(event) {
    return KEY_COMMANDS.find((command) => {
      if (command.modificator) {
        return event.key === command.keyName && event[command.modificator];
      }
      return event.key === command.keyName;
    });
  }

  render() {
    return (
      <div className="text-editor">
        <Toolbar
          params={FORMATTING_PARAMS}
          handleControl={this.handleControl}
          selection={this.state.selection}
        />
        <div
          className="editor"
          contentEditable
          suppressContentEditableWarning
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyPress}
          onBeforeInput={this.handleBeforeInput}
          onSelect={this.handleSelect}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          ref={this.editorRef}
          tabIndex="0"
          role="textbox"
          spellCheck="true"
        >
          {this.state.blocks.map((item, i) => (
            <Block data={item} index={i} key={i} />
          ))}
        </div>
      </div>
    );
  }
}
