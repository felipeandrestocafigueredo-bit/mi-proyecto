import type { Lesson } from "../../models/LessonModel";
import { createLesson } from "../../models/LessonModel";

interface WeekCardColors {
  main: string;
  light: string;
  text: string;
  dark: string;
  mid: string;
  name: string;
  [key: string]: string;
}

interface WeekCardProps {
  lesson?: Lesson | null;
  week?: Lesson | null;
  index: number;
  colors: WeekCardColors;
  onClick: () => void;
  editMode?: boolean;
  onEdit?: () => void;
}

export default function WeekCard({
  lesson,
  week,
  index,
  colors,
  onClick,
  editMode = false,
  onEdit,
}: WeekCardProps) {

  const currentLesson = lesson ?? week ?? createLesson({});

  const hasContent =
      (currentLesson?.games?.length || 0) > 0 ||
      (currentLesson?.vocab?.length || 0) > 0;

  return (
    <div
      style={{
        width: "100%",
        animation: "popIn .25s ease",
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: "100%",
          textAlign: "left",
          background: "#fff",
          border: "2px solid rgba(36,31,26,.08)",
          borderRadius: 18,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          cursor: "pointer",
          transition: ".25s",
          boxShadow: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.borderColor = colors.main;
          e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(36,31,26,.08)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* ==========================
            Número semana
        ========================== */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: colors.light,
            color: colors.text,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 800,
            fontSize: 15,
            flexShrink: 0,
          }}
        >
          S{index + 1}
        </div>

        {/* ==========================
            Información
        ========================== */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 17,
                color: colors.text,
              }}
            >
              {currentLesson?.topic ?? "No topic"}
            </div>
            {
              currentLesson.badge && (
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: colors.light,
                    color: colors.text,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {currentLesson.badge}
                </span>
              )
            }
          </div>
          <div
            style={{
              marginTop: 6,
              color: "#64748B",
              fontSize: 13,
            }}
          >
            📅 {currentLesson?.fecha ?? "Fecha no disponible"}
          </div>
        </div>

        {/* ==========================
            Indicadores + botón edición
        ========================== */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            {editMode && (
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                title="Editar esta semana"
                style={{
                  border: "none",
                  borderRadius: 10,
                  background: "rgba(37,99,235,0.12)",
                  color: colors.text,
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(37,99,235,0.22)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(37,99,235,0.12)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                ✏️
              </div>
            )}
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: hasContent ? colors.main : "#CBD5E1",
              }}
            />
          </div>
      </button>
    </div>
  );
}
