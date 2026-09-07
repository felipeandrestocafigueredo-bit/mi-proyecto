"use client";

import { useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/providers/SessionProvider";

type Tab = "login" | "register";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { refresh } = useSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role },
          },
        });

        if (error) {
          setError(error.message);
          return;
        }

        await refresh();
        router.push("/");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
          return;
        }

        await refresh();
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (e) {
      setError("No se pudo iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#F8FAFC",
      }}
    >
      <div
        style={{
          width: "min(420px, 100%)",
          borderRadius: 28,
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          padding: 28,
          boxShadow: "0 20px 60px rgba(15,23,42,0.15)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <h1
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: "#102A43",
            }}
          >
            La Amistad
          </h1>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>
            English · Gamified Teaching Strategies
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            background: "#F1F5F9",
            borderRadius: 16,
            padding: 4,
            marginBottom: 18,
          }}
        >
          <button
            type="button"
            onClick={() => setTab("login")}
            style={{
              flex: 1,
              borderRadius: 14,
              border: "none",
              padding: "10px 0",
              background: tab === "login" ? "#FFFFFF" : "transparent",
              color: "#0F172A",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: tab === "login" ? "0 2px 8px rgba(15,23,42,0.10)" : "none",
            }}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setTab("register")}
            style={{
              flex: 1,
              borderRadius: 14,
              border: "none",
              padding: "10px 0",
              background: tab === "register" ? "#FFFFFF" : "transparent",
              color: "#0F172A",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: tab === "register" ? "0 2px 8px rgba(15,23,42,0.10)" : "none",
            }}
          >
            Crear cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 700,
                color: "#334155",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid #CBD5E1",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 700,
                color: "#334155",
                marginBottom: 6,
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid #CBD5E1",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          {tab === "register" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: 6,
                }}
              >
                Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "student" | "teacher")}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid #CBD5E1",
                  fontSize: 14,
                  background: "#FFFFFF",
                }}
              >
                <option value="student">Estudiante</option>
                <option value="teacher">Docente</option>
              </select>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                background: "#FEE2E2",
                color: "#991B1B",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              padding: "12px 0",
              borderRadius: 18,
              border: "none",
              background: "#102A43",
              color: "#FFFFFF",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? tab === "login"
                ? "Entrando..."
                : "Creando cuenta..."
              : tab === "login"
                ? "Entrar"
                : "Crear cuenta"}
          </button>
        </form>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <button
            type="button"
            onClick={handleGoogle}
            style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: 18,
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#0F172A",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
}
