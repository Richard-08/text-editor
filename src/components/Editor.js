import "./Editor.css";

import Toolbar from "./Toolbar/Toolbar";
import Block from "./Block/Block";
import Selection from "./utils/Selection";
import { getNodeHierarchy, getBlockNode } from "./utils/helpers";
import EditorEditHandler from "./handlers/EditorEditHandler";

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

    this.editorRef = React.createRef();

    this.handler = EditorEditHandler;

    this.handleKeyDown = this.buildHandler("onKeyDown");
    this.handleInput = this.handleInput.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
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

  handleInput() {
    if (this.state.activeBlock) {
      const currentSelection = Selection.saveSelection(this.state.activeBlock);
      const html = this.state.activeBlock.innerHTML;
      const data = [...this.state.blocks];
      data[this.state.activeBlockIdx].content = html;

      this.setState(
        (state) => ({
          blocks: data,
          selection: { ...state.selection, ...currentSelection },
        }),
        () => {
          Selection.restoreSelection(
            this.state.activeBlock,
            this.state.selection
          );
        }
      );
    }
  }

  handleSelect() {
    const { isCollapsed, anchorNode, focusNode } = Selection.getSelection();
    if (anchorNode && focusNode) {
      const blockSelector = "[data-block]";
      const startBlock = getBlockNode(anchorNode, blockSelector);
      const endBlock = isCollapsed
        ? startBlock
        : getBlockNode(focusNode, blockSelector);

      const currentBlock = isCollapsed ? startBlock.node : endBlock.node;
      const { start, end } = Selection.saveSelection(currentBlock);

      const currentNode = isCollapsed ? anchorNode : focusNode;

      this.setState({
        selection: {
          start,
          end,
          isCollapsed,
          tags: getNodeHierarchy(currentNode, currentBlock),
          startBlock:
            startBlock.index < endBlock.index ? startBlock.node : endBlock.node,
          startBlockIdx:
            startBlock.index < endBlock.index
              ? startBlock.index
              : endBlock.index,
          endBlock:
            startBlock.index > endBlock.index ? startBlock.node : endBlock.node,
          endBlockIdx:
            startBlock.index > endBlock.index
              ? startBlock.index
              : endBlock.index,
        },
        activeBlock: currentBlock,
        activeBlockIdx: parseInt(currentBlock.dataset.block),
      });
    }
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
    return this.state.selection.startBlock && this.state.selection.endBlock;
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
          onInput={this.handleInput}
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
