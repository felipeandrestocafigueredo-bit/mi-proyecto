"use client";

import { useState } from "react";

import { useAccessControl } from "@/app/providers/AccessControlProvider";

export default function AccessCodeEntry() {
  const { enterWithCode, accessCode } = useAccessControl();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    setError(null);
    const result = enterWithCode(code);
    if (!result.ok) {
      setError(result.message);
    }
  }

  const showHint = attempted && !code;
  const showCode = false;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #0F172A 100%)",
        fontFamily: "'Fredoka', sans-serif",
      }}
    >
      <div
        style={{
          width: "min(460px, 100%)",
          borderRadius: 28,
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          boxShadow: "0 40px 90px rgba(15,23,42,.30)",
          padding: 48,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 8 }}>🎮</div>

        <h1
          style={{
            margin: "0 0 8px",
            fontSize: 32,
            fontWeight: 800,
            color: "#102A43",
            fontFamily: "'Fredoka', sans-serif",
          }}
        >
          Bienvenidos a Gamifica
        </h1>

        <p
          style={{
            margin: "0 0 28px",
            color: "#475569",
            fontSize: 15,
            lineHeight: 1.6,
            maxWidth: 380,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Ingresa tu código de acceso para explorar las estrategias
          gamificadas de la institución.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 700,
                color: "#334155",
                marginBottom: 6,
                textAlign: "left",
              }}
            >
              Código de acceso
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 14,
                border: "1px solid #CBD5E1",
                fontSize: 15,
                outline: "none",
                transition: "border-color .2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#CBD5E1";
              }}
            />
            {showHint && (
              <div
                style={{
                  marginTop: 6,
                  color: "#991B1B",
                  fontSize: 12,
                  textAlign: "left",
                }}
              >
                Ingresa el código de acceso.
              </div>
            )}
          </div>

          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "#FEE2E2",
                color: "#991B1B",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: 4,
              padding: "14px 0",
              borderRadius: 18,
              border: "none",
              background: "#102A43",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              transition: "background .2s, transform .1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1E4A6E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#102A43";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(1px)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Entrar a la plataforma
          </button>
        </form>

        {showCode && (
          <div
            style={{
              marginTop: 20,
              padding: "10px 14px",
              borderRadius: 10,
              background: "#F1F5F9",
              color: "#475569",
              fontSize: 12,
            }}
          >
            Código maestro: <code>{accessCode}</code>
          </div>
        )}

        <p
          style={{
            marginTop: 24,
            color: "#94A3B8",
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          Acceso para estudiantes, docentes y comunidad educativa.
          <br />
          El docente podrá activar el modo edición desde el botón de{" "}
          <strong>Teacher Control</strong>.
        </p>
      </div>
    </main>
  );
}
