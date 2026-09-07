"use client";

import { useState } from "react";
import { useSession } from "@/app/providers/SessionProvider";
import { useAccessControl } from "@/app/providers/AccessControlProvider";
import { createClient } from "@/app/lib/supabase/client";

interface HeaderColors {
  dark: string;
  mid: string;
  main: string;
  light: string;
  text: string;
  name: string;
  glow?: string;
}

interface HeaderProps {
  colors: HeaderColors;
}

function Header({ colors }: HeaderProps) {
  const { user, loading } = useSession();
  const { accessMode, editMode, teacherPanelOpen, enterTeacherMode, setTeacherPanelOpen, setMinimized } = useAccessControl();

  const showTeacherButton = accessMode === "visitor" || accessMode === "teacher";

  const handleTeacherControlClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (accessMode !== "teacher") {
      enterTeacherMode();
    } else {
      setMinimized(false);
      setTeacherPanelOpen(!teacherPanelOpen);
    }
  };

  return (
    <header style={{
      background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.mid} 55%, ${colors.dark} 100%)`,
      padding: "0", color: "#fff", position: "relative", overflow: "hidden",
      transition: "background 0.5s",
      }}>

      {/* ── pixel grid background ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(${colors.main}18 1px, transparent 1px),
          linear-gradient(90deg, ${colors.main}18 1px, transparent 1px)
        `,
        backgroundSize: "28px 28px",
        pointerEvents: "none",
      }} />

      {/* ── subtle scanline ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
      }} />

      {/* ── bottom corner glow ── */}
      <div style={{
        position: "absolute", bottom: -40, right: 60, width: 220, height: 220,
        borderRadius: "50%", background: colors.glow || "rgba(255,255,255,0.1)",
        filter: "blur(50px)", pointerEvents: "none",
      }} />

      {/* ── floating gamification icons ── */}
      {[
        { icon:"🎮", top:"18%", right:"6%",  anim:"floatA 3.2s ease-in-out infinite", size:32 },
        { icon:"⭐", top:"55%", right:"14%", anim:"floatB 2.8s ease-in-out infinite", size:26 },
        { icon:"🏆", top:"20%", right:"20%", anim:"floatC 3.6s ease-in-out infinite", size:22 },
        { icon:"🎯", top:"65%", right:"4%",  anim:"floatA 4s ease-in-out infinite 0.5s", size:20 },
        { icon:"⚡", top:"40%", right:"28%", anim:"pulse 2s ease-in-out infinite", size:18 },
      ].map((f, i) => (
        <div key={i} style={{
          position: "absolute", top: f.top, right: f.right,
          fontSize: f.size, animation: f.anim, pointerEvents: "none",
          userSelect: "none", opacity: 0.75,
        }}>
          {f.icon}
        </div>
      ))}

      {/* ── content ── */}
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        width: "100%",
        padding: "24px 20px 50px",
        position: "relative", zIndex: 1,
         boxSizing: "border-box",
         textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 20, padding: "4px 12px", marginBottom: 10,
        }}>
          <span style={{ fontSize: 13 }}>🏫</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", opacity: 0.9 }}>
            La Amistad Educational Institution · English
          </span>
        </div>
        
        {/* main title */}
        <h1 style={{
          fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
          fontSize: "clamp(26px, 5.5vw, 38px)",
           margin: "0 0 4px", letterSpacing: -0.5, lineHeight: 1.1,
           textShadow: `0 0 30px ${colors.glow || "rgba(255,255,255,0.3)"}`,
        }}>
          Gamified Teaching Strategies
        </h1>

        {/* subtitle */}
        <p style={{ margin: "6px auto 14px", opacity: 0.85, fontSize: 14, maxWidth: 500, lineHeight: 1.5, textAlign: "center" }}>
          Learn English by playing · XP, challenges and achievements every week 🚀
        </p>

        {/* gamification chips + teacher control */}
        <div style={{
          display: "flex", justifyContent: "center", flexWrap: "wrap",
          gap: 10, alignItems: "center",
        }}>
          {[
            { icon:"🎮", label:"Interactive games" },
            { icon:"📇", label:"Flashcards with audio" },
            { icon:"🌐", label:"Digital resources" },
          ].map((chip, i) => (
            <button
              key={i}
              type="button"
              disabled
              style={{
                border: "none",
                borderRadius: 18,
                background: "rgba(255,255,255,0.20)",
                color: "#fff",
                padding: "12px 18px",
                cursor: "not-allowed",
                fontWeight: 700,
                minWidth: 170,
                textAlign: "center",
                opacity: 0.85,
                transition: "background 0.2s",
              }}
            >
              {chip.icon} {chip.label}
            </button>
          ))}

          {showTeacherButton && (
            <button
              type="button"
              onClick={handleTeacherControlClick}
              style={{
                border: "none",
                borderRadius: 18,
                background: accessMode === "teacher"
                  ? (editMode
                      ? "rgba(22,160,73,0.30)"
                      : "rgba(37,99,235,0.30)")
                  : "rgba(255,255,255,0.20)",
                color: "#fff",
                padding: "12px 18px",
                cursor: "pointer",
                fontWeight: 700,
                minWidth: 170,
                textAlign: "center",
                position: "relative",
                zIndex: 2,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.30)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  accessMode === "teacher"
                    ? (editMode
                        ? "rgba(22,160,73,0.30)"
                        : "rgba(37,99,235,0.30)")
                    : "rgba(255,255,255,0.20)";
              }}
            >
              {accessMode === "teacher"
                ? (editMode ? "✏️ Modo edición ON" : "🔐 Teacher activo")
                : "🔐 Teacher Control"}
            </button>
          )}

          {user && !loading && (
            <span
              style={{
                borderRadius: 14,
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {user.email} · {user.role === "teacher" ? "Docente" : "Estudiante"}
            </span>
          )}

          {user && !loading && (
            <LogoutButton />
          )}
        </div>
      </div>

      {/* ── decorative XP bar at bottom ── */}
      <div style={{ background: "rgba(0,0,0,0.2)", height: 5, position: "relative", marginBottom: 5 }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%", width: "68%",
          background: `linear-gradient(90deg, ${colors.main}, #fff8)`,
          borderRadius: "0 4px 4px 0",
          transition: "width 0.5s",
        }} />
      </div>
    </header>
  );
}

function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      style={{
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.35)",
        background: "rgba(255,255,255,0.10)",
        color: "#fff",
        padding: "8px 12px",
        fontSize: 12,
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? "Saliendo..." : "Cerrar sesión"}
    </button>
  );
}

export default Header;
