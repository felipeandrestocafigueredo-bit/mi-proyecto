export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 50,
        padding: "24px 20px 36px",
        textAlign: "center",
        borderTop: "1px solid rgba(36,31,26,.08)",
        color: "#64748B",
        fontSize: 13,
        lineHeight: 1.8,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          color: "#243B53",
          marginBottom: 6,
        }}
      >
        🇬🇧 Panel de Juegos Didácticos de Inglés
      </div>

      <div>
        Inglés 6°–11° • Institución Educativa La Amistad
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: 12,
          opacity: .75,
        }}
      >
        Arquitectura Oficial 3.0 • Desarrollado semana a semana
      </div>
    </footer>
  );
}