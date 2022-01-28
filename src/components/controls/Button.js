import "./Button.css";

export default function Button({ data, handleClick }) {
  return (
    <button
      className={`btn ${data.active && "active"}`}
      style={data.styles}
      title={data.tooltip}
      onClick={(e) => handleClick(e, data)}
      dangerouslySetInnerHTML={{__html: data.name}}
    ></button>
  );
}
