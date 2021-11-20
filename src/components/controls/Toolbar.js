import "./Toolbar.css";
import Button from "./Button";

import { TOOLBAR } from "./constants";

export default function Toolbar({ selection, handleControl }) {
  const handleClick = (e, value) => {
    handleControl(e, value)
  };

  const controls = () => {
    return TOOLBAR.map((item) => {
      return {
        ...item,
        active: /* editor.state. */selection.tags.includes(item.tag),
      };
    });
  };

  return (
    <div className="toolbar">
      {controls().map((item, index) => {
        if (item.role === "button") {
          return <Button data={item} key={index} handleClick={handleClick} />;
        } else {
          return <div className="separator" key={index}></div>;
        }
      })}
    </div>
  );
}
