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
  isEqual,
} from "../utils/helpers";
import { FORMATTING_PARAMS, INIT_STATE } from "./constants";

import React, { Component } from "react";

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = INIT_STATE;

    this.history = [INIT_STATE];
    this.currentStateIdx = 0;
    this.historyRecord = false;
    this.canMakeHistoryRecord = false;
    this.prevActionStatus = false;

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

  componentDidUpdate(prevProps, prevState) {
    if (this.historyRecord && this.prevActionStatus) {
      this.history = this.history.slice(0, this.currentStateIdx + 1);

      if (
        !isEqual(prevState.blocks, this.state.blocks)
      ) {
        this.history.push(prevState);
      }

      this.history.push(this.state);
      this.currentStateIdx = this.history.length - 1;

      console.log(this.history);
      this.historyRecord = false;
      this.canMakeHistoryRecord = false;
    }
    this.prevActionStatus = this.canMakeHistoryRecord;
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

  getBlocksFomatting(startBlock, endBlock) {
    const { isCollapsed, anchorNode, anchorOffset, focusNode, focusOffset } =
      Selection.getSelection();

    if (isCollapsed) {
      return getNodeHierarchy(anchorNode, startBlock);
    } else {
      if (!anchorNode.textContent.slice(anchorOffset).length) {
        return getNodeHierarchy(focusNode, endBlock);
      } else if (!focusNode.textContent.slice(0, focusOffset).length) {
        return getNodeHierarchy(anchorNode, startBlock);
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
