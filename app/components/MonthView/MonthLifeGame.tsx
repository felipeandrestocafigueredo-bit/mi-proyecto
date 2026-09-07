"use client";

import { useMemo, useState } from "react";
import { getGrade } from "@/app/academic/Index";
import { AVATAR_OPTIONS, getStudentProfile, saveGameResult, saveStudentProfile, saveStudentResultToSupabase } from "@/app/games/engine/playerProfile";
import { MONTH_GAME_INFO } from "../../data/monthGameInfo";

interface MonthLifeGameProps {
  mesIdx: number;
  gradeCode?: string;
  colors: {
    main: string;
    [key: string]: unknown;
  };
  onPlay?: () => void;
}

interface VocabularyEntry {
  word: string;
  translation: string;
  emoji: string;
  topic: string;
}

interface ChallengeQuestion {
  id: string;
  prompt: string;
  type: "Vocabulario" | "Oraciones" | "Gramática" | "Comprensión";
  options: string[];
  answer: string;
  explanation: string;
  visual?: string;
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const rotation = Math.abs((seed * 31 + index * 17) % (index + 1));
    const current = copy[index];
    copy[index] = copy[rotation];
    copy[rotation] = current;
  }
  return copy;
}

function buildFallbackVocabulary(): VocabularyEntry[] {
  return [
    { word: "book", translation: "libro", emoji: "📘", topic: "school" },
    { word: "family", translation: "familia", emoji: "👨‍👩‍👧", topic: "people" },
    { word: "school", translation: "escuela", emoji: "🏫", topic: "place" },
    { word: "happy", translation: "feliz", emoji: "😊", topic: "emotion" },
    { word: "friend", translation: "amigo", emoji: "🤝", topic: "people" },
    { word: "music", translation: "música", emoji: "🎵", topic: "fun" },
    { word: "bread", translation: "pan", emoji: "🥖", topic: "food" },
    { word: "morning", translation: "mañana", emoji: "🌅", topic: "time" },
  ];
}

function buildMonthVocabulary(gradeCode: string, mesIdx: number): VocabularyEntry[] {
  const gradeData = getGrade(gradeCode) as Record<string, Array<{ vocab?: Array<Record<string, unknown>> }>>;
  const monthLessons = gradeData[String(mesIdx)] ?? [];

  const rawVocabulary = monthLessons.flatMap((lesson) => (Array.isArray(lesson.vocab) ? lesson.vocab : []));

  const vocabulary = rawVocabulary
    .map((entry) => {
      const word = String(entry.word ?? entry.en ?? entry.text ?? "").trim();
      const translation = String(entry.translation ?? entry.es ?? "").trim();
      const emoji = String(entry.emoji ?? "✨").trim();
      const topic = String(entry.topic ?? entry.categoryLabel ?? entry.category ?? "vocabulary").trim();

      if (!word || !translation) {
        return null;
      }

      return {
        word,
        translation,
        emoji,
        topic,
      };
    })
    .filter((item): item is VocabularyEntry => Boolean(item));

  const uniqueByWord = new Map<string, VocabularyEntry>();
  vocabulary.forEach((item) => uniqueByWord.set(item.word.toLowerCase(), item));

  return Array.from(uniqueByWord.values());
}

function buildChallenge(gradeCode: string, mesIdx: number): ChallengeQuestion[] {
  const basePool = buildMonthVocabulary(gradeCode, mesIdx);
  const vocabularyPool = basePool.length > 0 ? basePool : buildFallbackVocabulary();

  const selected = shuffleWithSeed(vocabularyPool, mesIdx + gradeCode.length).slice(0, Math.min(8, vocabularyPool.length));

  return selected.map((item, index) => {
    const distractors = shuffleWithSeed(
      vocabularyPool.filter((entry) => entry.word.toLowerCase() !== item.word.toLowerCase()).map((entry) => entry.translation),
      mesIdx + index + 41,
    ).slice(0, 3);

    const options = shuffleWithSeed([item.translation, ...distractors].slice(0, 4), mesIdx + index + 7);

    const questionType = index % 4 === 0 ? "Vocabulario" : index % 4 === 1 ? "Comprensión" : index % 4 === 2 ? "Oraciones" : "Gramática";

    if (index % 4 === 0) {
      return {
        id: `${gradeCode}-${mesIdx}-emoji-${item.word}`,
        type: "Vocabulario",
        prompt: "¿Qué palabra corresponde a esta imagen?",
        visual: item.emoji,
        answer: item.word,
        explanation: `${item.word} significa “${item.translation}”.`,
        options: shuffleWithSeed([item.word, ...vocabularyPool.filter((entry) => entry.word.toLowerCase() !== item.word.toLowerCase()).slice(0, 3).map((entry) => entry.word)], mesIdx + index + 101),
      };
    }

    if (index % 4 === 1) {
      return {
        id: `${gradeCode}-${mesIdx}-meaning-${item.word}`,
        type: "Comprensión",
        prompt: `¿Qué significa “${item.word}”?`,
        answer: item.translation,
        explanation: `La palabra “${item.word}” se usa para decir “${item.translation}” en español.`,
        options,
      };
    }

    if (index % 4 === 2) {
      const sentence = `Complete la oración: “I need my ___ for reading class.”`;
      return {
        id: `${gradeCode}-${mesIdx}-sentence-${item.word}`,
        type: "Oraciones",
        prompt: sentence,
        answer: item.word,
        explanation: `La opción correcta es “${item.word}” porque se relaciona con el tema de ${item.topic}.`,
        options: shuffleWithSeed([item.word, ...vocabularyPool.filter((entry) => entry.word.toLowerCase() !== item.word.toLowerCase()).slice(0, 3).map((entry) => entry.word)], mesIdx + index + 202),
      };
    }

    return {
      id: `${gradeCode}-${mesIdx}-grammar-${item.word}`,
      type: "Gramática",
      prompt: `Elige la opción correcta para la palabra “${item.word}”.`,
      answer: item.translation,
      explanation: `La respuesta correcta es “${item.translation}” porque corresponde al significado de “${item.word}”.`,
      options: shuffleWithSeed([item.translation, ...distractors].slice(0, 4), mesIdx + index + 303),
    };
  });
}

export default function MonthLifeGame({ mesIdx, gradeCode = "g67", colors, onPlay }: MonthLifeGameProps) {
  const info = MONTH_GAME_INFO?.[mesIdx] || {
    title: "Juego de vidas",
    description: "Evalúa el progreso del mes y guarda el resultado de la evaluación.",
    standards: [],
  };

  const profile = useMemo(() => getStudentProfile(), []);
  const [studentName, setStudentName] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [started, setStarted] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const challenge = useMemo(() => buildChallenge(gradeCode, mesIdx), [gradeCode, mesIdx]);
  const currentQuestion = challenge[questionIndex];
  const percentage = challenge.length ? Math.round((score / challenge.length) * 100) : 0;

  function beginChallengeSetup() {
    setShowProfileEditor(true);
  }

  function beginChallenge() {
    const nextProfile = saveStudentProfile({
      name: studentName,
      avatar: selectedAvatar,
    });

    setStarted(true);
    setShowProfileEditor(false);
    setStudentName(nextProfile.name);
    setSelectedAvatar(nextProfile.avatar);
    onPlay?.();
  }

  function handleAnswer(option: string) {
    if (!currentQuestion || selectedOption) return;

    const isCorrect = option === currentQuestion.answer;
    const nextScore = isCorrect ? score + 1 : score;
    setSelectedOption(option);
    setScore(nextScore);

    window.setTimeout(() => {
      if (questionIndex >= challenge.length - 1) {
        const finalPercentage = Math.round((nextScore / challenge.length) * 100);
        const finalResult = saveGameResult({
          gameId: `monthly-life-game-${gradeCode}-${mesIdx}`,
          title: info.title,
          studentName: studentName || profile.name,
          avatar: selectedAvatar || profile.avatar,
          score: nextScore,
          percentage: finalPercentage,
          accuracy: finalPercentage,
          attempts: 1,
          monthIndex: mesIdx,
          weekIndex: 0,
          gradeCode,
        });

        void saveStudentResultToSupabase(finalResult).catch((error) => {
          console.error("No se pudo guardar el resultado del juego mensual en Supabase:", error);
        });
        setCompleted(true);
        setStarted(true);
        return;
      }

      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    }, 750);
  }

  function handleReset() {
    setStarted(false);
    setShowProfileEditor(false);
    setCompleted(false);
    setQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setStudentName(profile.name);
    setSelectedAvatar(profile.avatar);
    onPlay?.();
  }

  if (!challenge.length) {
    return null;
  }

  return (
    <div style={{ marginTop: 28, background: "#fff", borderRadius: 22, border: "2px solid rgba(36,31,26,.08)", overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,.06)" }}>
      <div style={{ background: colors.main, color: "#fff", padding: 22, textAlign: "center" }}>
        <div style={{ fontSize: 38 }}>❤️</div>
        <h2 style={{ margin: "8px 0 4px", fontFamily: "Fredoka", textAlign: "center" }}>{info.title}</h2>
        <div style={{ opacity: 0.95, textAlign: "center" }}>{info.description}</div>
      </div>

      <div style={{ padding: 24, display: "grid", gap: 18 }}>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.5, color: "#334155", textTransform: "uppercase", textAlign: "center" }}>Juego de vidas</div>
          {info.standards.length > 0 ? (
            info.standards.map((standard, index) => (
              <div key={`${info.title}-${standard.description}-${index}`} style={{ display: "grid", gap: 4, padding: "10px 12px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <div style={{ color: "#475569", fontSize: 12 }}>{standard.description}</div>
              </div>
            ))
          ) : (
            <div style={{ color: "#475569", fontSize: 13 }}>Este mes se evaluará el vocabulario, la comprensión y la producción de oraciones del grado seleccionado.</div>
          )}
        </div>

        {!started ? (
          <div style={{ display: "grid", gap: 18 }}>
            {!showProfileEditor ? (
              <button
                onClick={beginChallengeSetup}
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: 16,
                  padding: "16px",
                  background: colors.main,
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 18,
                  cursor: "pointer",
                  boxShadow: "0 12px 24px rgba(37,99,235,.22)",
                }}
              >
                START
              </button>
            ) : (
              <>
                <div style={{ padding: 18, borderRadius: 18, background: "linear-gradient(135deg, #F8FAFC, #EEF2FF)", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#334155", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>Estudiante</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 62, height: 62, display: "grid", placeItems: "center", borderRadius: "50%", background: "#E0F2FE", fontSize: 28, boxShadow: "0 8px 16px rgba(14,165,233,.2)" }}>{selectedAvatar}</div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, marginBottom: 6, color: "#334155" }}>Nombre del estudiante</label>
                    <input
                      value={studentName}
                      onChange={(event) => setStudentName(event.target.value.slice(0, 24))}
                      placeholder="Escribe tu nombre"
                      style={{
                        width: "100%",
                        borderRadius: 12,
                        border: "1px solid #CBD5E1",
                        padding: "12px 14px",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#0F172A",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#334155", marginBottom: 8 }}>Selecciona tu avatar</div>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                      {AVATAR_OPTIONS.map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar)}
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            border: selectedAvatar === avatar ? "2px solid #2563EB" : "1px solid #CBD5E1",
                            background: selectedAvatar === avatar ? "#DBEAFE" : "#FFFFFF",
                            fontSize: 22,
                            cursor: "pointer",
                            boxShadow: selectedAvatar === avatar ? "0 8px 16px rgba(37,99,235,.15)" : "none",
                          }}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={beginChallenge}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: 16,
                    padding: "16px",
                    background: colors.main,
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 18,
                    cursor: "pointer",
                    boxShadow: "0 12px 24px rgba(37,99,235,.22)",
                  }}
                >
                  START
                </button>
              </>
            )}
          </div>
        ) : completed ? (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ padding: 18, borderRadius: 18, background: "linear-gradient(135deg, #ECFDF5, #EFF6FF)", border: "1px solid #BBF7D0", textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#166534", textTransform: "uppercase" }}>Resultado del estudiante</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#E0F2FE", display: "grid", placeItems: "center", fontSize: 24 }}>{selectedAvatar}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{studentName || profile.name}</div>
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", marginTop: 12 }}>{percentage}%</div>
              <div style={{ color: "#334155", marginTop: 6 }}>
                Respondió {score} de {challenge.length} preguntas correctamente.
              </div>
            </div>
            <button onClick={handleReset} style={{ width: "100%", border: "none", borderRadius: 16, padding: "14px 16px", background: "#0F172A", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
              🔄 Reintentar evaluación
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", background: "#E0F2FE", fontSize: 22 }}>{selectedAvatar}</div>
                <div style={{ fontWeight: 800, color: "#0F172A" }}>{studentName || "Estudiante"}</div>
              </div>
              <div style={{ padding: "6px 10px", borderRadius: 999, background: "#E0F2FE", color: "#075985", fontSize: 12, fontWeight: 800 }}>{percentage}%</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ fontWeight: 800, color: "#0F172A" }}>Pregunta {questionIndex + 1} / {challenge.length}</div>
              <div style={{ padding: "6px 10px", borderRadius: 999, background: "#F1F5F9", color: "#334155", fontSize: 12, fontWeight: 800 }}>{currentQuestion.type}</div>
            </div>

            {currentQuestion.visual && (
              <div style={{ display: "grid", placeItems: "center", padding: 18, borderRadius: 18, background: "linear-gradient(135deg, #EEF2FF, #F0FDF4)", border: "1px solid #DBEAFE", minHeight: 120 }}>
                <div style={{ fontSize: 64, filter: "drop-shadow(0 10px 18px rgba(59,130,246,.18))" }}>{currentQuestion.visual}</div>
              </div>
            )}

            <div style={{ padding: 18, borderRadius: 16, background: "linear-gradient(135deg, #F8FAFC, #EEF2FF)", border: "1px solid #E2E8F0", fontWeight: 700, color: "#0F172A", fontSize: 16, lineHeight: 1.6 }}>
              {currentQuestion.prompt}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQuestion.answer;
                const background = !selectedOption
                  ? "#FFFFFF"
                  : isCorrect
                    ? "#DCFCE7"
                    : isSelected
                      ? "#FEE2E2"
                      : "#FFFFFF";

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswer(option)}
                    disabled={Boolean(selectedOption)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      borderRadius: 14,
                      border: isCorrect && selectedOption ? "1px solid #22C55E" : "1px solid #CBD5E1",
                      background,
                      padding: "12px 14px",
                      fontWeight: 700,
                      color: "#0F172A",
                      cursor: selectedOption ? "default" : "pointer",
                      transition: "all .2s ease",
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selectedOption && (
              <div style={{ padding: 12, borderRadius: 12, background: selectedOption === currentQuestion.answer ? "#DCFCE7" : "#FEF2F2", border: `1px solid ${selectedOption === currentQuestion.answer ? "#86EFAC" : "#FCA5A5"}`, color: "#0F172A", fontSize: 13, lineHeight: 1.5 }}>
                {selectedOption === currentQuestion.answer ? "¡Correcto!" : `Respuesta correcta: ${currentQuestion.answer}`}<br />
                <span style={{ color: "#334155" }}>{currentQuestion.explanation}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
