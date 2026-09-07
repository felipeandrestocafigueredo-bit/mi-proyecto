"use client";

import React, { useMemo } from "react";
import Card from "../common/Card";
import WEEK_TITLES from "../../i18n/weekTitles";

interface LessonData {
  progress?: number;
  tema?: string;
  topic?: string;
  id?: string;
  fecha?: string;
  presentation?: Array<Record<string, unknown>>;
  vocab?: Array<Record<string, unknown>>;
  games?: Array<Record<string, unknown>>;
  resources?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

interface Colors {
  dark?: string;
  mid?: string;
  main?: string;
  accent?: string;
  light?: string;
  text?: string;
  [key: string]: unknown;
}

interface PresentationTabModernProps {
  lesson: LessonData;
  colors?: Colors;
}

interface RewardItem {
  emoji: string;
  title: string;
}

export default function PresentationTabModern({ lesson, colors = {} }: PresentationTabModernProps) {
  const palette = {
    dark: colors?.dark || "#0B1120",
    mid: colors?.mid || "#1E3A8A",
    main: colors?.main || "#3B82F6",
    accent: colors?.accent || "#FFD166",
    light: colors?.light || "#EFF6FF",
    text: colors?.text || "#F8FAFC",
    success: "#22C55E",
    card: "#1E293B",
    cardLight: "#334155",
  };

  const progress = Math.max(0, Math.min(100, lesson?.progress ?? 0));

  const TRANSLATIONS: Record<string, string> = {
    "saludos formales e informales": "Greetings",
    "alfabeto (spelling), números ordinales y cardinales": "Alphabet & Numbers",
    "días de la semana y meses del año": "Days & Months",
    "pronombres personales y verbo to be": "Personal Pronouns & To Be",
    "verbo have y vocabulario de familia": "Verb Have & Family",
    "presente simple afirmativo": "Simple Present Affirmative",
    "presente simple negativo e interrogativo": "Simple Present Negative",
    "evaluación escrita del primer período": "Written Test",
    "retroalimentación y cierre del primer período": "Feedback & Closing",
  };

  function translateTitle(tema: string): string {
    const t = (tema || "").toString().trim();
    if (!t) return "Welcome";
    const lower = t.toLowerCase();
    if (TRANSLATIONS[lower]) return TRANSLATIONS[lower];
    for (const key in TRANSLATIONS) {
      if (lower.includes(key)) return TRANSLATIONS[key];
    }
    return t;
  }

  const displayTitle = (() => {
    const id = lesson?.id;
    if (id && WEEK_TITLES && (WEEK_TITLES as Record<string, string>)[id]) return (WEEK_TITLES as Record<string, string>)[id];
    return translateTitle(lesson?.topic || "");
  })();

  const objective: string =
    (lesson?.presentation?.[0]?.objective as string | undefined) ||
    `Learn "${displayTitle}" with vocabulary, games, and activities!`;

  const rawRewards = lesson?.presentation?.[0]?.rewards;
  const rewards: RewardItem[] = Array.isArray(rawRewards)
    ? (rawRewards as RewardItem[])
    : [
        { emoji: "⭐", title: "+100 XP" },
        { emoji: "🥇", title: "Weekly Badge" },
        { emoji: "🏆", title: "New Achievement" },
        { emoji: "🎯", title: "Perfect Score" },
      ];

  const missionLabel = "WEEKLY MISSION";

  const rewardCards = useMemo(
    () =>
      rewards.map((r, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: 16,
            minWidth: 120,
            borderRadius: 16,
            background: "linear-gradient(145deg, rgba(255,255,255,.12), rgba(255,255,255,.04))",
            border: "1px solid rgba(255,255,255,.15)",
            color: "#fff",
            transform: "translateY(0)",
            transition: "all .5s cubic-bezier(.4,0,.2,1)",
            cursor: "default",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,.4)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
          }}
        >
          <div style={{ fontSize: 32, animation: "bounce 2.5s ease-in-out infinite", display: "inline-block" }}>{r.emoji}</div>
          <div style={{ fontSize: 13, fontWeight: 800 }}>{r.title}</div>
        </div>
      )),
    [rewards]
  );

  const marioColors: Record<string, { bg: string; text: string; shadow: string; border: string }> = {
    Words: { bg: "#FF4757", text: "#FFFFFF", shadow: "rgba(255,71,87,.55)", border: "#FFFFFF" },
    Games: { bg: "#1E90FF", text: "#FFFFFF", shadow: "rgba(30,144,255,.55)", border: "#FFFFFF" },
    Resources: { bg: "#D69E2E", text: "#1A202C", shadow: "rgba(214,158,46,.55)", border: "#FFFFFF" },
    "Total XP": { bg: "#FFA502", text: "#1A202C", shadow: "rgba(255,165,2,.55)", border: "#FFFFFF" },
  };

  const stats = [
    { emoji: "📚", label: "Words", value: lesson?.vocab?.length || 0 },
    { emoji: "🎮", label: "Games", value: lesson?.games?.length || 0 },
    { emoji: "🌐", label: "Resources", value: lesson?.resources?.length || 0 },
    { emoji: "⭐", label: "Total XP", value: (lesson?.games as any[])?.reduce((acc, g) => acc + (g.score || 0) * 100, 0) || 0 },
  ];

  return (
    <div style={{ display: "grid", gap: 20, justifyItems: "center", textAlign: "center" }}>
      <style>{`
        @keyframes floatUpDown {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(2deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-8px) rotate(-2deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes xpShimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(60px) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {/* HERO - Gamificado */}
      <div
        style={{
          borderRadius: 24,
          padding: 32,
          color: "#fff",
          background: `linear-gradient(135deg, ${palette.dark} 0%, ${palette.mid} 50%, ${palette.dark} 100%)`,
          backgroundSize: "200% 200%",
          animation: "gradientShift 10s ease infinite",
          display: "grid",
          gap: 20,
          boxShadow: "0 20px 50px rgba(10,30,80,.5)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,.1)",
        }}
      >
        {/* Decorative game elements */}
        <div style={{
          position: "absolute",
          top: 20,
          right: 30,
          fontSize: 48,
          opacity: 0.15,
          animation: "floatUpDown 6s ease-in-out infinite",
        }}>🎮</div>
        <div style={{
          position: "absolute",
          bottom: 30,
          left: 40,
          fontSize: 36,
          opacity: 0.1,
          animation: "floatUpDown 8s ease-in-out infinite reverse",
        }}>⭐</div>
        <div style={{
          position: "absolute",
          top: "50%",
          right: 10,
          fontSize: 28,
          opacity: 0.08,
          animation: "floatUpDown 5s ease-in-out infinite 1s",
        }}>🏆</div>

        <div style={{ display: "grid", justifyItems: "center", textAlign: "center", gap: 10, position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(255,255,255,.15)",
              backdropFilter: "blur(8px)",
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 800,
              border: "1px solid rgba(255,255,255,.2)",
              justifySelf: "center",
            }}
          >
            🎮 {missionLabel}
          </div>

          <h1
            style={{
              margin: "8px 0",
              fontFamily: "Fredoka, sans-serif",
              fontSize: 44,
              lineHeight: "1.05",
              color: "#fff",
            }}
          >
            {displayTitle}
          </h1>

          <div
            style={{
              opacity: 0.95,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,.1)",
              padding: "6px 14px",
              borderRadius: 999,
              backdropFilter: "blur(4px)",
            }}
          >
            📅 {lesson?.fecha || "—"}
          </div>

          <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 8 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 }}>Level</div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 24,
                  background: "linear-gradient(135deg, #FFD166, #FFA500)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                3
              </div>
            </div>

            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 28,
                background: "linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.06))",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 12px 28px rgba(0,0,0,.35), inset 0 2px 4px rgba(255,255,255,.2)",
                transform: "translateY(0)",
                animation: "floatUpDown 5s ease-in-out infinite",
                fontSize: 44,
                border: "2px solid rgba(255,255,255,.15)",
                position: "relative",
              }}
            >
              🎮
              <div
                style={{
                  position: "absolute",
                  inset: "-4px",
                  borderRadius: 32,
                  border: "2px solid rgba(255,255,255,.1)",
                  animation: "pulse 3s ease-in-out infinite",
                }}
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 }}>Rank</div>
              <div style={{ fontWeight: 800, fontSize: 20 }}>🥇 Gold</div>
            </div>
          </div>
        </div>

        {/* XP BAR */}
        <div style={{ display: "grid", gap: 10, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <span>⚡</span> Weekly Progress
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                background: "rgba(255,255,255,.2)",
                padding: "3px 12px",
                borderRadius: 999,
                backdropFilter: "blur(4px)",
              }}
            >
              {progress}%
            </div>
          </div>

          <div
            style={{
              height: 22,
              borderRadius: 999,
              background: "rgba(255,255,255,.12)",
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(255,255,255,.1)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${palette.success}, #4ADE80, ${palette.success})`,
                borderRadius: 999,
                transition: "width 1.5s cubic-bezier(.4,0,.2,1)",
                position: "relative",
                boxShadow: "0 0 20px rgba(34,197,94,.6)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)",
                  backgroundSize: "200% 100%",
                  animation: progress > 0 ? "xpShimmer 3s linear infinite" : "none",
                }}
              />
            </div>
          </div>

          <div style={{ fontSize: 12, opacity: 0.85, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span>🎯</span> Complete activities to unlock games & earn rewards
          </div>
        </div>
      </div>

      {/* CONTENT CARDS */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 340px" }}>
        <div style={{ display: "grid", gap: 14 }}>
          <Card
            title="🎯 Objective"
            titleColor="#fff"
            style={{
              background: "linear-gradient(145deg, #1D4ED8, #312E81)",
              border: "2px solid rgba(255,255,255,.14)",
              textAlign: "center",
              display: "grid",
              justifyItems: "center",
            }}
          >
            <div style={{ color: "#E0F2FE", lineHeight: 1.7, fontWeight: 600, maxWidth: 660, margin: "0 auto" }}>{objective}</div>
          </Card>

          <Card
            title="🏆 Rewards"
            subtitle="Unlock these rewards by completing the mission!"
            titleColor="#fff"
            style={{
              background: "linear-gradient(145deg, #F97316, #EC4899 55%, #8B5CF6)",
              border: "3px solid #FDBA74",
              boxShadow: "0 10px 26px rgba(236,72,153,.22)",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>{rewardCards}</div>
          </Card>

          <Card
            title="💡 Pro Tips"
            titleColor="#fff"
            style={{
              background: "linear-gradient(145deg, #0891B2, #0D9488 55%, #16A34A)",
              border: "3px solid #67E8F9",
              boxShadow: "0 10px 26px rgba(13,148,136,.22)",
              textAlign: "center",
            }}
          >
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", lineHeight: 2, display: "grid", gap: 6, justifyItems: "center" }}>
              {(Array.isArray(lesson?.presentation?.[0]?.tips) ? (lesson.presentation[0].tips as string[]) : ["Listen to pronunciation carefully", "Practice with Flashcards", "Complete all games for bonus XP", "Review vocabulary daily"]).map((t, i) => (
                <li key={i} style={{ color: "#FFFFFF", fontWeight: 600 }}>{t}</li>
              ))}
            </ul>
          </Card>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {/* Stats Card */}
          <Card
            style={{
              background: "linear-gradient(145deg, #1E293B, #0F172A)",
              border: "2px solid rgba(255,255,255,.12)",
            }}
          >
            <div style={{ display: "grid", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                📊 Statistics
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {stats.map((stat, i) => {
                  const theme = marioColors[stat.label] || { bg: palette.cardLight, text: "#fff", shadow: "rgba(0,0,0,.3)", border: "#FFFFFF" };
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 18px",
                        borderRadius: 18,
                        background: theme.bg,
                        color: theme.text,
                        border: `4px solid ${theme.border}`,
                        boxShadow: `6px 6px 0px ${theme.shadow}, inset 0 3px 0px rgba(255,255,255,.3)`,
                        transition: "all .4s cubic-bezier(.4,0,.2,1)",
                        cursor: "default",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px) rotate(-2deg)";
                        e.currentTarget.style.boxShadow = `10px 14px 0px ${theme.shadow}, inset 0 3px 0px rgba(255,255,255,.4)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) rotate(0deg)";
                        e.currentTarget.style.boxShadow = `6px 6px 0px ${theme.shadow}, inset 0 3px 0px rgba(255,255,255,.3)`;
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 26, filter: "drop-shadow(2px 3px 0px rgba(0,0,0,.25))" }}>{stat.emoji}</span>
                        <span style={{ fontSize: 17, fontWeight: 800, textShadow: "2px 2px 0px rgba(0,0,0,.2)" }}>{stat.label}</span>
                      </div>
                      <span style={{ fontWeight: 900, fontSize: 24, fontFamily: "Fredoka, sans-serif", textShadow: "3px 3px 0px rgba(0,0,0,.2)" }}>{stat.value}</span>
                      <div style={{ position: "absolute", top: 0, right: 0, width: 28, height: 28, background: "rgba(255,255,255,.3)", borderBottomLeftRadius: 14 }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Level Progress Card */}
          <Card
            style={{
              background: "linear-gradient(145deg, #1E293B, #0F172A)",
              border: "2px solid rgba(255,255,255,.12)",
            }}
          >
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 800, color: "#fff" }}>
                🏆 Your Level
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #FFD166, #FFA500)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 26,
                    boxShadow: "0 6px 18px rgba(255,209,102,.4)",
                    animation: "bounce 2.5s ease-in-out infinite",
                  }}
                >
                  ⭐
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: 1 }}>Current Level</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", fontFamily: "Fredoka, sans-serif" }}>3</div>
                </div>
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,.7)" }}>
                  <span>XP Progress</span>
                  <span style={{ fontWeight: 700 }}>{Math.min(100, progress * 3)} / 300 XP</span>
                </div>
                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: "rgba(255,255,255,.1)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, progress * 3)}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${palette.accent}, #FFA500)`,
                      borderRadius: 999,
                      transition: "width 1.2s ease",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.08)",
                }}
              >
                <span style={{ fontSize: 18 }}>🏆</span>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: 0.5 }}>Current Rank</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: palette.accent }}>🥇 Gold Student</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Projections Card */}
          <Card
            style={{
              background: "linear-gradient(145deg, #1E293B, #0F172A)",
              border: "2px solid rgba(255,255,255,.12)",
            }}
          >
            <div style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                📽️ Projections
              </div>
              <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14, lineHeight: 1.6 }}>
                Add a URL or upload a presentation to project it in class.
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 14,
                    border: "none",
                    cursor: "pointer",
                    background: `linear-gradient(135deg, ${palette.main}, ${palette.mid})`,
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 14,
                    transition: "all .3s ease",
                    boxShadow: "0 4px 14px rgba(59,130,246,.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(59,130,246,.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(59,130,246,.4)";
                  }}
                >
                  🎞️ View
                </button>
                <button
                  style={{
                    padding: "12px 16px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,.15)",
                    background: "rgba(255,255,255,.08)",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 14,
                    color: "#fff",
                    transition: "all .3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.12)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  📤 Upload
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
