import { cssRule } from "typestyle";

cssRule("html, body", {
  fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen",
  margin: 0,
  padding: 0,
});

cssRule("a", {
  color: "inherit",
  textDecoration: "none"
});

cssRule("*", {
  boxSizing: "border-box"
});
