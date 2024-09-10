import { useEffect, useState } from "react";
import { useUI } from "../state/ui";
import Logo from "../components/logo";

export default function Loading() {
  const { color } = useUI();

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
        <Logo color={color.current} />

        <h1>{"Loading" + ".".repeat(dotCount)}</h1>
      </div>

      <div className="bg"></div>
    </main>
  );
}
