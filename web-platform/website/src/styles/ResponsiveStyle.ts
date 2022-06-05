import { media, types } from "typestyle";
import { ScreenSize } from "./ScreenSize";

type NestedCSSProperties = types.NestedCSSProperties;
type MediaQuery = types.MediaQuery;

// These styles correspond to bootstrap breakpoints
// Ref: https://getbootstrap.com/docs/5.2/layout/grid/#variables
const screenMediaQueries: MediaQuery[] = [
  { maxWidth: 575.9999 }, // Extra Small
  { minWidth: 576, maxWidth: 767.99999 }, // Small
  { minWidth: 768, maxWidth: 991.99999 }, // Medium
  { minWidth: 992, maxWidth: 1199.99999 }, // Large
  { minWidth: 1200, maxWidth: 1399.99999 }, // xLarge
  { minWidth: 1400 }, // xxxLarge
];

export function createResponsiveStyle(
  size: ScreenSize,
  css: NestedCSSProperties,
  applyToHigherSizes: boolean = false
): NestedCSSProperties {
  // If small and up are enabled, no need for media query
  if (size === ScreenSize.Small && applyToHigherSizes) {
    return css;
  }

  if (applyToHigherSizes) {
    return media({ minWidth: screenMediaQueries[size].minWidth }, css);
  }

  return media(screenMediaQueries[size], css);
}