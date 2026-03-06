import { useState, useEffect, useCallback } from "react";

const buttons = [
  ["AC", "+/-", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

const isOp = (v) => ["÷", "×", "−", "+"].includes(v);

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(false);
  const [flash, setFlash] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 120);
  };



  const handleInput = useCallback((val) => {
    if (val === "AC") {
      setDisplay("0");
      setPrev(null);
      setOp(null);
      setFresh(false);
      return;
    }
    if (val === "+/-") {
      setDisplay((d) => String(parseFloat(d) * -1));
      return;
    }
    if (val === "%") {
      setDisplay((d) => String(parseFloat(d) / 100));
      return;
    }
    if (isOp(val)) {
      setPrev(parseFloat(display));
      setOp(val);
      setFresh(true);
      return;
    }
    if (val === "=") {
      if (op && prev !== null) {
        const cur = parseFloat(display);
        const opMap = { "+": prev + cur, "−": prev - cur, "×": prev * cur, "÷": prev / cur };
        const result = opMap[op];
        const resultStr = Number.isInteger(result) ? String(result) : parseFloat(result.toFixed(10)).toString();
        triggerFlash();
        setDisplay(resultStr);
        setPrev(null);
        setOp(null);
        setFresh(false);
      }
      return;
    }
    if (val === ".") {
      if (fresh) { setDisplay("0."); setFresh(false); return; }
      if (!display.includes(".")) setDisplay((d) => d + ".");
      return;
    }
    if (fresh) {
      setDisplay(val);
      setFresh(false);
    } else {
      setDisplay((d) => (d === "0" ? val : d.length < 12 ? d + val : d));
    }
}, [display, prev, op, fresh, triggerFlash]);

   const pressButton = useCallback((val) => {
    setPressedKey(val);
    setTimeout(() => setPressedKey(null), 150);
    handleInput(val);
}, [handleInput]);

  useEffect(() => {
    const keyMap = {
      "0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9",
      ".":".","+":"+","-":"−","*":"×","/":"÷","Enter":"=","Escape":"AC","%":"%"
    };
    const handler = (e) => {
      if (keyMap[e.key]) pressButton(keyMap[e.key]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [display, prev, op, fresh, pressButton]);

  const fontSize = display.length > 9 ? "2rem" : display.length > 6 ? "2.8rem" : "3.8rem";

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(ellipse at 30% 20%, #1a0a2e 0%, #0d0d1a 60%, #000 100%)",
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap');
        .calc-wrap {
          position: relative;
        }
        .glow-ring {
          position: absolute;
          inset: -2px;
          border-radius: 42px;
          background: linear-gradient(135deg, #7b4fff, #ff4fa3, #4fffdb, #7b4fff);
          background-size: 300% 300%;
          animation: gradShift 4s ease infinite;
          z-index: 0;
          filter: blur(1px);
        }
        @keyframes gradShift {
          0%{background-position:0% 50%}
          50%{background-position:100% 50%}
          100%{background-position:0% 50%}
        }
        .calc-body {
          position: relative;
          z-index: 1;
          background: #111118;
          border-radius: 40px;
          padding: 28px 24px 24px;
          width: 320px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .display-area {
          padding: 18px 20px 12px;
          text-align: right;
          min-height: 110px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          position: relative;
          overflow: hidden;
        }
        .op-indicator {
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #7b4fff;
          text-transform: uppercase;
          min-height: 18px;
          transition: opacity 0.2s;
          margin-bottom: 4px;
        }
        .display-number {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          color: #fff;
          line-height: 1;
          transition: font-size 0.15s ease, color 0.15s ease;
          word-break: break-all;
        }
        .display-number.flash {
          color: #4fffdb;
        }
        .btn-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 16px;
        }
        .btn {
          border: none;
          border-radius: 18px;
          height: 68px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.2rem;
          cursor: pointer;
          transition: transform 0.08s ease, filter 0.08s ease, box-shadow 0.08s ease;
          position: relative;
          overflow: hidden;
        }
        .btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: rgba(255,255,255,0);
          transition: background 0.1s;
        }
        .btn:active::after, .btn.pressed::after {
          background: rgba(255,255,255,0.12);
        }
        .btn:active, .btn.pressed {
          transform: scale(0.93);
        }
        .btn-func {
          background: linear-gradient(145deg, #2a2a3e, #1e1e30);
          color: #b0b0cc;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .btn-func:hover {
          background: linear-gradient(145deg, #32324a, #26263c);
          color: #d0d0ee;
        }
        .btn-op {
          background: linear-gradient(145deg, #8b5fff, #6b3fff);
          color: #fff;
          box-shadow: 0 4px 20px rgba(123,79,255,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .btn-op:hover {
          background: linear-gradient(145deg, #9b6fff, #7b4fff);
          box-shadow: 0 6px 24px rgba(123,79,255,0.55);
        }
        .btn-op.active-op {
          background: linear-gradient(145deg, #4fffdb, #00d4aa);
          color: #000;
          box-shadow: 0 4px 20px rgba(79,255,219,0.5);
        }
        .btn-num {
          background: linear-gradient(145deg, #1e1e2e, #161624);
          color: #e8e8f8;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .btn-num:hover {
          background: linear-gradient(145deg, #26263a, #1e1e30);
          color: #fff;
        }
        .btn-eq {
          background: linear-gradient(145deg, #ff4fa3, #cc2d7a);
          color: #fff;
          box-shadow: 0 4px 20px rgba(255,79,163,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .btn-eq:hover {
          background: linear-gradient(145deg, #ff6fb8, #e03d90);
          box-shadow: 0 6px 26px rgba(255,79,163,0.6);
        }
        .btn-zero {
          grid-column: span 2;
          border-radius: 20px;
          text-align: left;
          padding-left: 28px;
        }
        .calc-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #3a3a5c;
          text-align: center;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(123,79,255,0.3), transparent);
          margin: 4px 0 0;
        }
      `}</style>

      <div className="calc-wrap">
        <div className="glow-ring" />
        <div className="calc-body">
          <div className="calc-label">NEXUS CALC</div>
          <div className="divider" />

          <div className="display-area">
            <div className="op-indicator">
              {prev !== null && op ? `${prev} ${op}` : ""}
            </div>
            <div
              className={`display-number${flash ? " flash" : ""}`}
              style={{ fontSize }}
            >
              {display}
            </div>
          </div>

          <div className="btn-grid">
            {buttons.map((row, ri) =>
              row.map((val, ci) => {
                const isZero = val === "0";
                const isFunc = ["AC", "+/-", "%"].includes(val);
                const isOperator = isOp(val);
                const isEq = val === "=";
                const isActiveOp = isOperator && op === val;
                const isPressed = pressedKey === val;

                let cls = "btn";
                if (isZero) cls += " btn-zero btn-num";
                else if (isEq) cls += " btn-eq";
                else if (isFunc) cls += " btn-func";
                else if (isOperator) cls += ` btn-op${isActiveOp ? " active-op" : ""}`;
                else cls += " btn-num";
                if (isPressed) cls += " pressed";

                return (
                  <button
                    key={`${ri}-${ci}`}
                    className={cls}
                    onClick={() => pressButton(val)}
                  >
                    {val}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
