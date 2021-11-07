import "./Editor.css";

import Toolbar from "../controls/Toolbar";
import Block from "../contents/Block";
import Selection from "../utils/Selection";
import EditorEditHandler from "../handlers/EditorEditHandler";
import { getBlockNode } from "../utils/helpers";

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
          content: "Hello&nbsp;<em>there!</em>",
        },
        {
          type: "paragraph",
          tag: "p",
          content: "Hi&nbsp;<strong>everyone!</strong>",
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
      activeBlock: null,
      activeBlockIdx: null,
    };

    this.blockSelector = "[data-block]";

    this.editorRef = React.createRef();

    this.handler = EditorEditHandler;

    this.handleKeyDown = this.buildHandler("onKeyDown");
    this.handleBeforeInput = this.buildHandler("onBeforeInput");
    this.handleSelect = this.buildHandler("onSelect");
    this.handleControl = this.handleControl.bind(this);
  }

  buildHandler(eventName) {
    return (e) => {
      const method = this.handler[eventName];
      if (method) {
        method(this, e);
      }
    };
  }

  handleControl(value) {
    if (this.state.activeBlock) {
      const data = [...this.state.blocks];

      if (value.type === "block") {
        data[this.state.activeBlockIdx].tag = value.tag;
      }

      this.setState({ blocks: data }, () => {
        this.setState(
          (state) => ({
            activeBlock:
              this.editorRef.current.childNodes[state.activeBlockIdx],
          }),
          () => {
            Selection.restoreSelection(
              this.state.activeBlock,
              this.state.selection
            );
          }
        );
      });
    }
  }

  hasSelectedBlock() {
    const { startBlock, startBlockIdx, endBlock, endBlockIdx } =
      this.state.selection;

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
    }
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
