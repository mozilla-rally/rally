import { HTMLAttributes, useEffect, useState } from "react";
import { cssRaw, style } from "typestyle";

export function HomePageBackground({
  children,
  className,
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const [o1] = useState(0.2);
  const [layer1] = useState(0);
  const [layer2] = useState(0);
  const [m, setM] = useState(0);

  // TODO:
  // Animate o1 to 0.2 over 800ms
  // Animate layer1 to 0 over 1100ms and a delay of 200ms (use cubic out easing)
  // Animate layer2 to 0 over 2200ms (use cubic out easing)
  // Animate m from 0 with a duration of 500ms (use cubic out easing)

  function onScroll() {
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
      1000
    );

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    const innerHeight = window.innerHeight;

    const totalDistance = documentHeight - innerHeight;

    const percentScrolled = scrollY / totalDistance;

    setM(percentScrolled);
  }

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`${className || ""} ${styles.background}`}
      style={{
        ...(style || {}),
        ...({
          "--o1": o1,
          "--data1": `${layer1 * 15 + m * 4}px`,
          "--data2": `${-layer2 * 15 + m * 7}px`,
          "--card1": `${-layer1 * 10 - m * 3}px`,
          "--card2": `${layer2 * 10 + m * 6}px`,
        } as React.CSSProperties),
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

cssRaw(":root {--content-width: 700px;}");

const styles = {
  background: style({
    height: "100%",
    backgroundImage: `linear-gradient(
        to left,
        rgba(248, 248, 250, var(--o1, 1)),
        rgba(248, 248, 250, var(--o1, 1))
      ),
      url("img/data1-bg.png"),
      url("img/data2-bg.png"),
      url("img/cards1-bg.png"),
      url("img/cards2-bg.png")`,
    backgroundSize: `auto 900px`,
    backgroundRepeat: `no-repeat`,
    backgroundPosition: `left top,
      calc(15rem + var(--content-width) * 0.85) var(--data1, 0),
      calc(15rem + var(--content-width) * 0.85) var(--data2, 0),
      calc(15rem + var(--content-width) * 0.85) var(--card1, 0),
      calc(15rem + var(--content-width) * 0.85) var(--card2, 0)`,
    backgroundAttachment: `fixed`,
  }),
};
