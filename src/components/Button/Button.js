import "./Button.css";

export default function Button({ data, handleClick }) {
  return (
    <button
      className={`btn ${data.active && "active"}`}
      data-tooltip={data.tooltip}
      onClick={() => handleClick(data)}
    >
      {data.name}
    </button>
  );
}
