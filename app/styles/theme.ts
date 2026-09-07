import PERIOD_BY_MONTH from "@/app/data/periods";
import PERIOD_COLORS from "@/app/data/periodColors";

export const INK = "#243B53";

export const COLORS = {
  g67: {
    main: "#2563EB",
    dark: "#1E3A8A",
    mid: "#3B82F6",
    light: "#EFF6FF",
    text: "#0F172A",
    name: "6°-7°",
    glow: "rgba(59,130,246,0.35)",
  },
  g8: {
    main: "#7C3AED",
    dark: "#5B21B6",
    mid: "#8B5CF6",
    light: "#F5F3FF",
    text: "#0F172A",
    name: "8°",
    glow: "rgba(139,92,246,0.35)",
  },
  g9: {
    main: "#059669",
    dark: "#065F46",
    mid: "#10B981",
    light: "#ECFDF5",
    text: "#0F172A",
    name: "9°",
    glow: "rgba(16,185,129,0.35)",
  },
  g1011: {
    main: "#DC2626",
    dark: "#991B1B",
    mid: "#EF4444",
    light: "#FEF2F2",
    text: "#0F172A",
    name: "10°-11°",
    glow: "rgba(239,68,68,0.35)",
  },
};

export function getGradeColors(gradeId: string = "g67") {
  return COLORS[gradeId as keyof typeof COLORS] || COLORS.g67;
}

export interface PeriodColors {
  main: string;
  light: string;
  text: string;
  name: string;
  dark: string;
  mid: string;
  [key: string]: string;
}

export function getPeriodColors(monthIndex: number): PeriodColors {
  const period = PERIOD_BY_MONTH[monthIndex] || "P1";
  const colors = PERIOD_COLORS[period as keyof typeof PERIOD_COLORS] || PERIOD_COLORS.P1;
  return colors as PeriodColors;
}
