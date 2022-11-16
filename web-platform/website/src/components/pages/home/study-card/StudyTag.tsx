import { style } from "typestyle";

export function StudyTag(props: { children: string }) {
  return (
    <span className={`${styles[props.children] || ""} p-1`}>
      {props.children}
    </span>
  );
}

const styles: Record<string, string> = {
  accessibility: style({
    backgroundColor: "#E0ECEC",
  }),

  "artificial intelligence": style({
    backgroundColor: "#D98FFF",
  }),

  "community insights": style({
    backgroundColor: "#D9BFFF",
  }),

  "data & privacy": style({
    backgroundColor: "#B6F4F7",
  }),

  devices: style({
    backgroundColor: "#FFB4DC",
  }),

  misinformation: style({
    backgroundColor: "#FFD5B2",
  }),

  "product discovery": style({
    backgroundColor: "#FFB4DC",
  }),

  "social media": style({
    backgroundColor: "#F5F1BA",
  }),
};
