import React, { useState, useRef } from "react";
import "./Calculator.css";

import History from "./History";

function operPrioirty(oper) {
  switch (oper) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
      return 2;
    default:
      return 0;
  }
}

const calExp = (exp) => {
  let numStack = [];
  let operStack = [];

  let num = "";
  for (let i = 0; i < exp.length; i++) {
    if (exp.charAt(i) === "%") {
      numStack.push(parseFloat(num) * 0.01);
      num = "";
      continue;
    }
    if (operPrioirty(exp.charAt(i)) < 1 || (i === 0 && exp.charAt(i) === "-")) {
      num += exp.charAt(i);
      continue;
    }

    if (num !== "") numStack.push(parseFloat(num));
    num = "";

    if (operStack.length > 0) {
      // top의 우선순위가 같거나 높으면 먼저 계산
      // 그렇지 않으면 연산자 push
      while (operPrioirty(operStack.slice(-1).toString()) >= operPrioirty(exp.charAt(i))) {
        let tmp = 0;
        switch (operStack.pop()) {
          case "+":
            tmp = numStack.pop() + numStack.pop();
            break;
          case "-":
            tmp = numStack.pop() * -1 + numStack.pop();
            break;
          case "*":
            tmp = numStack.pop() * numStack.pop();
            break;
          case "/":
            tmp = (1 / numStack.pop()) * numStack.pop();
            break;
          default:
        }

        numStack.push(tmp);
      }
    }
    operStack.push(exp.charAt(i));
  }

  numStack.push(parseFloat(num));

  while (operStack.length > 0) {
    let tmp = 0;
    switch (operStack.pop()) {
      case "+":
        tmp = numStack.pop() + numStack.pop();
        break;
      case "-":
        tmp = numStack.pop() * -1 + numStack.pop();
        break;
      case "*":
        tmp = numStack.pop() * numStack.pop();
        break;
      case "/":
        tmp = (1 / numStack.pop()) * numStack.pop();
        break;
      default:
    }

    numStack.push(tmp);
  }

  return String(numStack.pop());
  //   return eval(exp);
};

function Calculator() {
  const [exp, setExp] = useState("");
  const [result, setResult] = useState("");
  const [historyArr, setHistoryArr] = useState([]);

  const flag = useRef(false);
  const setFlag = (bool) => {
    flag.current = bool;
  };

  const addHistory = (exp, result) => {
    setHistoryArr([
      ...historyArr,
      {
        hisExp: exp,
        hisResult: result,
      },
    ]);
    setFlag(true);
  };

  const onChange = (input) => {
    setResult(result + input);
    if (!flag.current) {
      if (result.slice(-1) === "%") setResult(result + "*" + input);
      return;
    }

    setFlag(false);
    setExp(`Ans = ${result}`);

    if (!isNaN(input)) setResult(input);
  };

  const onGetResult = () => {
    let tmp = calExp(result);
    addHistory(result, tmp);

    setExp(result + "=");
    setResult(tmp);
  };

  return (
    <div className="root">
      <div className="calculator">
        <div>
          <div className="expression">{exp}</div>
          <div className="result">{result}</div>
        </div>
        <div>
          <div className="btnLine">
            <button
              className="button"
              onClick={() => {
                onChange("%");
              }}
            >
              %
            </button>
            <button
              className="button"
              onClick={() => {
                setResult(result.slice(0, -1));
              }}
            >
              CE
            </button>
            <button
              className="button"
              onClick={() => {
                setResult("");
                setExp("");
              }}
            >
              AC
            </button>
          </div>
          <div className="btnLine">
            <button
              className="button"
              onClick={() => {
                onChange("7");
              }}
            >
              7
            </button>
            <button
              className="button"
              onClick={() => {
                onChange("8");
              }}
            >
              8
            </button>
            <button
              className="button"
              onClick={() => {
                onChange("9");
              }}
            >
              9
            </button>
            <button
              className="button"
              onClick={() => {
                onChange("/");
              }}
            >
              /
            </button>
          </div>
          <div className="btnLine">
            <button
              className="button"
              onClick={() => {
                onChange("4");
              }}
            >
              4
            </button>
            <button
              className="button"
              onClick={() => {
                onChange("5");
              }}
            >
              5
            </button>
            <button
              className="button"
              onClick={() => {
                onChange("6");
              }}
            >
              6
            </button>
            <button
              className="button"
              onClick={() => {
                onChange("*");
              }}
            >
              *
            </button>
          </div>
          <div className="btnLine">
            <button
              className="button"
              onClick={() => {
                onChange("1");
              }}
            >
              1
            </button>
            <button
              className="button"
              onClick={() => {
                onChange("2");
              }}
            >
              2
            </button>
            <button
              className="button"
              onClick={() => {
                onChange("3");
              }}
            >
              3
            </button>
            <button
              className="button"
              onClick={() => {
                onChange("-");
              }}
            >
              -
            </button>
          </div>
          <div className="btnLine">
            <button
              className="button"
              onClick={() => {
                onChange("0");
              }}
            >
              0
            </button>
            <button
              className="button"
              onClick={() => {
                onChange(".");
              }}
            >
              .
            </button>
            <button className="button" onClick={onGetResult}>
              =
            </button>
            <button
              className="button"
              onClick={() => {
                onChange("+");
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="historyAll">
        {historyArr.map((history) => (
          <History
            exp={history.hisExp}
            result={history.hisResult}
            parentCallback={(childData) => {
              setExp("");
              setResult(childData);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Calculator;
