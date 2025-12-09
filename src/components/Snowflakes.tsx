import { useMemo } from "react";

const Snowflakes = () => {
  const flakes = useMemo(() => Array.from({ length: 20 }), []);
  
  return (
    <>
      {flakes.map((_, i) => (
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 3 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 20 + 10}px`,
            opacity: Math.random() * 0.5 + 0.3,
          }}
        >
          ❄
        </div>
      ))}
    </>
  );
};

export default Snowflakes;
