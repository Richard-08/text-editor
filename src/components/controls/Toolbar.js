import "./Toolbar.css";
import Button from "./Button";

export default function Toolbar({ selection, handleControl, params }) {
  const handleClick = (e, value) => {
    handleControl(e, value);
  };

  const controls = () => {
    return params.map((item) => {
      return {
        ...item,
        active: selection.formatting.includes(item.tag),
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
