"use client";

import MONTHS from "@/app/data/months";

interface MonthBarColors {
  main: string;
  light: string;
  text: string;
  [key: string]: string | unknown;
}

interface MonthBarProps {
  mesIdx: number;
  setMesIdx: (idx: number) => void;
  activeMonths?: boolean[];
  colors: MonthBarColors;
}

export default function MonthBar({
  mesIdx,
  setMesIdx,
  activeMonths = [],
  colors,
}: MonthBarProps) {
  return (
    <div
      className="scrollx"
      style={{
        display: "flex",
        gap: 8,
        marginTop: 10,
        marginBottom: 18,
        overflowX: "auto",
        paddingBottom: 4,
      }}
    >
      {MONTHS.map((month, idx) => {
        const active = idx === mesIdx;
        const enabled = activeMonths[idx] !== false;

        return (
          <button
            key={month}
            onClick={() => enabled && setMesIdx(idx)}
            style={{
              flex: "0 0 auto",
              cursor: enabled ? "pointer" : "not-allowed",
              padding: "10px 14px",
              borderRadius: 12,
              border: active
                ? `2px solid ${colors.main}`
                : "2px solid rgba(36,31,26,0.12)",
              background: active ? colors.main : "#fff",
              color: active ? "#fff" : colors.text,
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "'Fredoka', sans-serif",
              opacity: enabled ? 1 : 0.4,
              transition:
                "background .20s, border-color .20s, color .20s, transform .20s",
            }}
            onMouseEnter={(e) => {
              if (!active && enabled) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = colors.main;
              }
            }}
            onMouseLeave={(e) => {
              if (!active && enabled) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor =
                  "rgba(36,31,26,0.12)";
              }
            }}
          >
            {month}
          </button>
        );
      })}
    </div>
  );
}
