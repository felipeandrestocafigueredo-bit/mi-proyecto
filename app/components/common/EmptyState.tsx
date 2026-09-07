export default function EmptyState({ text = "Sin contenido por ahora." }: { text?: string }) {
  return (
    <div
      style={{
        border: "2px dashed rgba(36,31,26,.18)",
        borderRadius: 16,
        padding: "36px 20px",
        textAlign: "center",
        color: "rgba(36,31,26,.55)",
        fontSize: 14.5,
        lineHeight: 1.5,
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 10 }}>📭</div>
      <div>{text}</div>
    </div>
  );
}
