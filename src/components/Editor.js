import "./Editor.css";

import Toolbar from "./Toolbar/Toolbar";
import Block from "./Block/Block";
import Selection from "./utils/Selection";
import { getNodeHierarchy, getBlockNode } from "./utils/helpers";

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

    this.handleKey = this.handleKey.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleControl = this.handleControl.bind(this);
  }

  handleKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();

      if (this.state.selection.startBlock && this.state.selection.endBlock) {
        const selection = Selection.getSelection();
        const splittedStartBlock = Selection.splitNode(
          selection,
          this.state.selection.startBlock
        );
        const splittedEndBlock = this.state.selection.isCollapsed
          ? splittedStartBlock
          : Selection.splitNode(selection, this.state.selection.endBlock);

        if (this.state.selection.isCollapsed) {
          this.setState(
            (state) => {
              const index = state.selection.startBlockIdx;
              state.blocks[index].content = splittedStartBlock.prev;

              return {
                blocks: [
                  ...state.blocks.slice(0, index + 1),
                  {
                    ...state.blocks[index],
                    content: splittedStartBlock.next,
                  },
                  ...state.blocks.slice(index + 1),
                ],
              };
            },
            () => {
              Selection.restoreSelection(this.state.activeBlock.nextSibling);
            }
          );
        } else {
          this.setState(
            (state) => {
              const { startBlockIdx, endBlockIdx } = state.selection;

              state.blocks[startBlockIdx].content =
                splittedStartBlock.prev === "<br>"
                  ? splittedStartBlock.next
                  : splittedStartBlock.prev;
              state.blocks[endBlockIdx].content =
                splittedEndBlock.prev === "<br>"
                  ? splittedEndBlock.next
                  : splittedEndBlock.prev;

              return {
                blocks: [
                  ...state.blocks.slice(0, startBlockIdx + 1),
                  state.blocks[endBlockIdx],
                  ...state.blocks.slice(endBlockIdx + 1),
                ],
              };
            },
            () => {
              const block =
                this.editorRef.current.childNodes[
                  this.state.selection.startBlockIdx + 1
                ];
              Selection.restoreSelection(block);
            }
          );
        }
      }
    } else if (e.key === "Backspace") {
      if (this.state.selection.isCollapsed) {
        const block_idx = this.state.activeBlockIdx;

        if (
          this.state.selection.start === 0 &&
          this.state.selection.end === 0
        ) {
          e.preventDefault();

          if (block_idx !== 0) {
            this.setState(
              (state) => {
                if (state.activeBlock.textContent.length) {
                  state.blocks[state.activeBlockIdx - 1].content +=
                    state.blocks[state.activeBlockIdx].content;
                }

                return {
                  blocks: state.blocks.filter((_, idx) => idx !== block_idx),
                };
              },
              () => {
                const block =
                  this.editorRef.current.childNodes[
                    this.state.activeBlockIdx - 1
                  ];
                const selectPosition = block.textContent.length;

                Selection.restoreSelection(block, {
                  start: selectPosition,
                  end: selectPosition,
                });
              }
            );
          }
        }
      } else {
      }
    }
  }

  handleChange() {
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
          startBlock.index < endBlock.index ? startBlock.index : endBlock.index,
        endBlock:
          startBlock.index > endBlock.index ? startBlock.node : endBlock.node,
        endBlockIdx:
          startBlock.index > endBlock.index ? startBlock.index : endBlock.index,
      },
      activeBlock: currentBlock,
      activeBlockIdx: parseInt(currentBlock.dataset.block),
    });
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
          onKeyDown={this.handleKey}
          onInput={this.handleChange}
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
