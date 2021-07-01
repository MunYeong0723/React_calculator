import React, { useState, useRef, useEffect } from "react";
import "./Calculator.css";

import History from "./History";

function operationPriority(operation) {
  switch (operation) {
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

const calculateExpression = (expression) => {
  let numStack = [];
  let operationStack = [];

  let num = "";
  for (let i = 0; i < expression.length; i++) {
    if (expression.charAt(i) === "%") {
      numStack.push(parseFloat(num) * 0.01);
      num = "";
      continue;
    }
    if (operationPriority(expression.charAt(i)) < 1 || (i === 0 && expression.charAt(i) === "-")) {
      num += expression.charAt(i);
      continue;
    }

    if (num !== "") numStack.push(parseFloat(num));
    num = "";

    if (operationStack.length > 0) {
      // top의 우선순위가 같거나 높으면 먼저 계산
      // 그렇지 않으면 연산자 push
      while (operationPriority(operationStack.slice(-1).toString()) >= operationPriority(expression.charAt(i))) {
        let tmp = 0;
        switch (operationStack.pop()) {
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
    operationStack.push(expression.charAt(i));
  }

  numStack.push(parseFloat(num));

  while (operationStack.length > 0) {
    let tmp = 0;
    switch (operationStack.pop()) {
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
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [historyArr, setHistoryArr] = useState([]);

  useEffect(() => {
    window.addEventListener("keydown", onPressedKeyboard);
    return () => window.removeEventListener("keydown", onPressedKeyboard);
  });

  // ref
  const flag = useRef(false);
  const setFlag = (bool) => {
    flag.current = bool;
  };

  const onChange = (input) => {
    let tmpResult = result + input;

    if (!flag.current) {
      if (!isNaN(input) && result.slice(-1) === "%") tmpResult = result + "*" + input;
      // 연산자가 2번 연속 나오는 경우
      if(input !== '-' && isNaN(result.slice(-1)) && isNaN(input)) tmpResult = result.slice(0, -1) + input;
      // 맨 앞에 연산자가 나오는 경우
      if(input !== '-' && isNaN(input) && result.length === 0) tmpResult = "0" + input;
      setResult(tmpResult);
      return;
    }
    if (!isNaN(input)) tmpResult = input;
    
    setFlag(false);
    setExpression(`Ans = ${result}`);    
    setResult(tmpResult);
  };

  const onReset = () => {
    if (flag.current) {
      setExpression(`Ans = ${result}`);
    }
    setFlag(false);
    setResult("");
  };

  const onRemove = () => {
    if (flag.current) return;
    setResult(result.slice(0, -1));
  };

  const onGetResult = () => {
    let tmp = calculateExpression(result);
    addHistory(result, tmp);

    setExpression(result + "=");
    setResult(tmp);
  };

  const handleCallBack = (childData) => {
    if (flag.current) {
      setExpression(`Ans = ${result}`);
    }
    setFlag(false);
    setResult(childData);
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

  // keyboard effect
  const onPressedKeyboard = (event) => {
    // 숫자 || 연산자 || % -> onChange()
    // Backspace -> CE
    // Enter -> calculate result
    // Escape -> AC
    if(!isNaN(event.key))
      onChange(event.key);

    switch(event.key) {
      case "+":
      case "-":
      case "/":
      case "*":
      case "%":
      case ".":
        onChange(event.key);
        break;
      case "Backspace" :
        onRemove();
        break;
      case "Enter" :
        onGetResult();  
        break;
      case "Escape":
        onReset();  
        break;
      default:
    }
    
  };

  return (
    <div className="root">
      <div className="calculator">
        <div>
          <div className="expression">{expression}</div>
          <div className="result">{result}</div>
        </div>
        <div>
          <div className="buttonLine">
            <button
              className="button"
              onClick={() => {
                onChange("%");
              }}
            >
              %
            </button>
            <button className="button" onClick={onRemove}>
              CE
            </button>
            <button className="button" onClick={onReset}>
              AC
            </button>
          </div>
          <div className="buttonLine">
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
          <div className="buttonLine">
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
          <div className="buttonLine">
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
          <div className="buttonLine">
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
        {historyArr.map((history, index) => (
          <History key={index} exp={history.hisExp} result={history.hisResult} parentCallback={handleCallBack} />
        ))}
      </div>
    </div>
  );
}

export default Calculator;
