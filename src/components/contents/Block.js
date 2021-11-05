import "./Block.css";

import React, { Component } from "react";

export default class Block extends Component {
  render() {
    const data = this.props.data;
    const TagName = data.tag;

    if (data.type === "title" || data.type === "paragraph") {
      return (
        <TagName
          className="block"
          dangerouslySetInnerHTML={{ __html: data.content }}
          data-block={this.props.index}
        />
      );
    }
  }
}
