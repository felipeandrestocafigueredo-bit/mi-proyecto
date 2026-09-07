export default function ErrorState({ text = "Ocurrió un error.", onRetry }: { text?: string; onRetry?: () => void }) {
  return (
    <div
      style={{
        border: "2px solid rgba(220,38,38,0.25)",
        borderRadius: 16,
        padding: "36px 20px",
        textAlign: "center",
        color: "rgba(36,31,26,0.75)",
        fontSize: 14.5,
        lineHeight: 1.5,
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
      <div>{text}</div>
      {typeof onRetry === "function" && (
        <button
          onClick={onRetry}
          style={{
            marginTop: 14,
            border: "none",
            borderRadius: 12,
            padding: "10px 16px",
            background: "#DC2626",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
