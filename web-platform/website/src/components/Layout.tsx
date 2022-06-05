import { NavigationBar } from "./navigation-bar";

export function Layout(props: { children?: JSX.Element }) {
  return (
    <>
      <NavigationBar />
      {props.children}
    </>
  );
}
