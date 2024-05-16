import { useEffect, useState } from "react";
import Logo from "../components/logo";

export default function Loading() {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev === 3 ? 0 : ++prev));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="loading-page">
      <div className="container">
        <Logo theme="pink" />

        <h1>{"Loading" + ".".repeat(dotCount)}</h1>
      </div>

      <div className="bg"></div>
    </main>
  );
}
