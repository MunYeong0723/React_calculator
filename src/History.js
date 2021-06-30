import React from "react";
import "./History.css";

function History({ exp, result, parentCallback }) {
  const onTrigger = (str) => {
    parentCallback(str);
  };

  return (
    <div className="history">
      <button
        className="historyButton"
        onClick={() => {
          onTrigger(exp);
        }}
      >
        {exp}
      </button>
      <p> = </p>
      <button
        className="historyButton"
        onClick={() => {
          onTrigger(result);
        }}
      >
        {result}
      </button>
    </div>
  );
}

export default History;
