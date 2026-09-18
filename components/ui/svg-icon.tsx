import Svg, { Circle, Path } from "react-native-svg";

const COLORS = {
  surface: "#0e1323",
  surfaceLow: "#161b2b",
  surfaceContainer: "#1a1f2f",
  surfaceHigh: "#24293a",
  surfaceHighest: "#2f3446",
  surfaceBright: "#34394a",
  primary: "#ffd58d", // Astral Gold
  onPrimary: "#422c00",
  primaryContainer: "#e5b869",
  onPrimaryContainer: "#674800",
  secondary: "#dab9ff", // Abyssal Amethyst (4-star)
  secondaryContainer: "#6227a3",
  tertiary: "#b4e1ff", // Starlight Azure (3-star)
  tertiaryContainer: "#68c9ff",
  error: "#ffb4ab", // Crimson Accent
  onSurface: "#dee1f8", // Warm Starlight
  onSurfaceVariant: "#d2c5b3", // Aether Slate
  outline: "#9b8f7f",
  outlineVariant: "#4e4538",
};

export { COLORS };

export const SvgSparkle = ({ size = 18, color = COLORS.primary }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </Svg>
);
export const SvgStar = ({ size = 13, color = COLORS.primary, filled = true }: { size?: number; color?: string; filled?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth={filled ? 0 : 2}>
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Svg>
);

export const SvgSwords = ({ size = 16, color = COLORS.primary }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
    <Path d="M13 19l6-6" />
    <Path d="M16 16l4 4" />
    <Path d="M19 21l2-2" />
    <Path d="M9.5 6.5L21 18v3h-3L6.5 9.5" />
  </Svg>
);

export const SvgSearch = ({ size = 18, color = COLORS.primary }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

export const SvgMic = ({ size = 18, color = COLORS.onSurfaceVariant }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <Path d="M12 19v4" />
    <Path d="M8 23h8" />
  </Svg>
);

export const SvgTune = ({ size = 18, color = COLORS.onSurfaceVariant }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
  </Svg>
);

export const SvgPerson = ({ size = 16, color = COLORS.onPrimary }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

export const SvgHeart = ({ size = 18, filled = false, color = COLORS.primary }: { size?: number; filled?: boolean; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

export const SvgUpgrade = ({ size = 18, color = COLORS.onPrimary }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 15l-6-6-6 6" />
  </Svg>
);

export const SvgCompare = ({ size = 18, color = COLORS.onSurfaceVariant }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4" />
  </Svg>
);

export const SvgArrowUp = ({ size = 14, color = COLORS.primary }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 19V5M5 12l7-7 7 7" />
  </Svg>
);

export const SvgClose = ({ size = 20, color = COLORS.onSurfaceVariant }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

export const SvgSort = ({ size = 14, color = COLORS.onSurfaceVariant }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
  </Svg>
);