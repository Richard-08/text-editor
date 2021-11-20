import "./Button.css";

export default function Button({ data, handleClick }) {
  return (
    <button
      className={`btn ${data.active && "active"}`}
      style={data.styles}
      data-tooltip={data.tooltip}
      onClick={(e) => handleClick(e, data)}
    >
      {data.name}
    </button>
  );
}
