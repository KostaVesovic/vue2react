import { useEffect, useState } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log("mounted");
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        setSeconds((s) => s + 1);
      }
    }, 1000);
    return () => {
      clearInterval(id);
      console.log("unmounted");
    };
  }, []);

  return <p>{seconds}s elapsed</p>;
}

export default function Exercise() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow((s) => !s)}>
        {show ? "unmount timer" : "mount timer"}
      </button>
      {show && <Timer />}
    </div>
  );
}
