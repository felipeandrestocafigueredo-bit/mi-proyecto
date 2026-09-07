import GRADOS from "@/app/data/grades";
import { INK } from "@/app/styles/theme";

interface GradoBarProps {
  grado: string;
  setGrado: (id: string) => void;
}

function GradoBar({ grado, setGrado }: GradoBarProps) {
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
      {GRADOS.map((item) => {
        const active = item.id === grado;

        // Más adelante podrá venir desde academic
        const hasContent = true;

        return (
          <button
            key={item.id}
            onClick={() => setGrado(item.id)}
            style={{
              flex: "0 0 auto",
              cursor: "pointer",
              padding: "12px 18px",
              borderRadius: 14,
              border: active
                ? "2px solid #241F1A"
                : "2px solid rgba(36,31,26,0.12)",
              background: active ? "#241F1A" : "#fff",
              color: active ? "#fff" : INK,
              fontWeight: 700,
              fontSize: 15,
              fontFamily: "'Fredoka', sans-serif",
              boxShadow: active
                ? "0 4px 0 rgba(0,0,0,0.15)"
                : "0 2px 0 rgba(36,31,26,0.06)",
              transform: active ? "translateY(1px)" : "translateY(0)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
              transition:
                "background .20s, border-color .20s, color .20s, transform .20s, box-shadow .20s",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "#241F1A";
                e.currentTarget.style.boxShadow =
                  "0 5px 12px rgba(0,0,0,0.12)";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor =
                  "rgba(36,31,26,0.12)";
                e.currentTarget.style.boxShadow =
                  "0 2px 0 rgba(36,31,26,0.06)";
              }
            }}
          >
            <span>Grado {item.label}</span>

            {!hasContent && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: 6,
                  background: active
                    ? "rgba(255,255,255,.18)"
                    : "rgba(36,31,26,.08)",
                  color: active ? "#fff" : "rgba(36,31,26,.55)",
                }}
              >
                PRONTO
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default GradoBar;