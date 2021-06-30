import React from "react";
import "./History.css";

function History({ exp, result, parentCallback }) {
  const onTrigger = (str) => {
    parentCallback(str);

    console.log(`str : ${str}`);
  };

  return (
    <div className="history">
      <button
        className="historyBtn"
        onClick={() => {
          onTrigger(exp);
        }}
      >
        {exp}
      </button>
      <p> = </p>
      <button
        className="historyBtn"
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
