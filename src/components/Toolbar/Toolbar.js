import "./Toolbar.css";
import Button from "../Button/Button";

import { TOOLBAR } from "./constants";

export default function Toolbar({ selection, handleControl }) {
  const handleClick = (target) => {
    handleControl(target);
  };

  const controls = () => {
    return TOOLBAR.map((item) => {
      return {
        ...item,
        active: selection.tags.includes(item.tag),
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
