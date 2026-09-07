"use client";

import { useEffect, useState } from "react";
import { AVATAR_OPTIONS, getStudentProfile, saveStudentProfile } from "@/app/games/engine/playerProfile";

interface StudentProfilePickerProps {
  compact?: boolean;
  colors?: { main?: string; light?: string; text?: string };
}

export default function StudentProfilePicker({ compact = false, colors = {} }: StudentProfilePickerProps) {
  const [profile, setProfile] = useState(getStudentProfile());

  useEffect(() => {
    setProfile(getStudentProfile());
  }, []);

  function updateProfile(next: Partial<typeof profile>) {
    const merged = { ...profile, ...next };
    setProfile(merged);
    saveStudentProfile(merged);
  }

  return (
    <div
      style={{
        display: "grid",
        gap: compact ? 10 : 14,
        padding: compact ? "12px 14px" : "16px 18px",
        borderRadius: 18,
        background: "linear-gradient(135deg, rgba(59,130,246,.08), rgba(168,85,247,.08))",
        border: "1px solid rgba(148,163,184,.25)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontWeight: 800, color: colors.text ?? "#0F172A" }}>👤 Perfil del estudiante</div>
        <div style={{ fontSize: 12, color: "#475569" }}>Se guarda automáticamente</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div
          style={{
            minWidth: compact ? 42 : 52,
            height: compact ? 42 : 52,
            borderRadius: "50%",
            background: colors.main ?? "#2563EB",
            display: "grid",
            placeItems: "center",
            fontSize: compact ? 22 : 28,
            boxShadow: "0 8px 18px rgba(37,99,235,.18)",
          }}
        >
          {profile.avatar}
        </div>

        <input
          value={profile.name}
          onChange={(event) => updateProfile({ name: event.target.value })}
          placeholder="Escribe tu nombre"
          style={{
            flex: 1,
            minWidth: 180,
            borderRadius: 12,
            border: "1px solid #CBD5E1",
            padding: "10px 12px",
            fontSize: 14,
            fontWeight: 700,
            color: "#0F172A",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {AVATAR_OPTIONS.map((avatar) => (
          <button
            key={avatar}
            type="button"
            onClick={() => updateProfile({ avatar })}
            style={{
              width: compact ? 34 : 40,
              height: compact ? 34 : 40,
              borderRadius: "50%",
              border: profile.avatar === avatar ? `2px solid ${colors.main ?? "#2563EB"}` : "1px solid #CBD5E1",
              background: profile.avatar === avatar ? "rgba(37,99,235,.08)" : "#fff",
              cursor: "pointer",
              fontSize: compact ? 18 : 22,
            }}
            aria-label={`Seleccionar avatar ${avatar}`}
          >
            {avatar}
          </button>
        ))}
      </div>
    </div>
  );
}
