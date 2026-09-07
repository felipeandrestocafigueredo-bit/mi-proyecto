"use client";

import { useState, useEffect, useCallback } from "react";

import EmptyState from "../../components/common/EmptyState";

interface WordItem {
    id?: string;
    word?: string;
    image?: string;
    emoji?: string;
    translation?: string;
    pronunciation?: string;
    sentence?: string;
    category?: string;
    [key: string]: unknown;
}

interface FlashCardsGameProps {
    vocab?: WordItem[];
    colors?: Record<string, string>;
}

function speakText(text: string, onStart: () => void, onEnd: () => void): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) {
        onEnd();
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = onStart;
    utterance.onend = onEnd;
    utterance.onerror = onEnd;

    window.speechSynthesis.speak(utterance);
}

export default function FlashCardsGame({
    vocab = [],
    colors,
}: FlashCardsGameProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setCurrentIndex(0);
        setIsRevealed(false);
        setIsVisible(true);
    }, [vocab]);

    useEffect(() => {
        return () => {
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const total = vocab.length;
    const currentWord = vocab[currentIndex];
    const mainColor = colors?.main || "#2563EB";
    const lightColor = colors?.light || "#F8FAFC";
    const textColor = colors?.text || "#1E293B";

    if (!total) {
        return (
            <div
                style={{
                    display: "grid",
                    gap: 16,
                }}
            >
                <EmptyState
                    text="No existe vocabulario para mostrar."
                />
            </div>
        );
    }

    if (currentIndex >= total) {
        return (
            <div
                style={{
                    background: "#fff",
                    borderRadius: 28,
                    padding: "clamp(36px, 6vw, 56px) clamp(24px, 4vw, 40px)",
                    textAlign: "center",
                    border: "2px solid rgba(36,31,26,0.06)",
                    boxShadow: "0 24px 80px rgba(15,23,42,0.10), 0 0 0 1px rgba(36,31,26,0.06)",
                    display: "grid",
                    gap: 20,
                    animation: "floatIn 0.4s ease",
                }}
            >
                <div
                    style={{
                        fontSize: 72,
                        lineHeight: 1,
                    }}
                >
                    🎉
                </div>
                <h2
                    style={{
                        margin: 0,
                        fontSize: 32,
                        fontWeight: 800,
                        color: textColor,
                        fontFamily: "Fredoka",
                    }}
                >
                    ¡Excelente!
                </h2>
                <p
                    style={{
                        margin: 0,
                        fontSize: 17,
                        color: "#64748B",
                        lineHeight: 1.6,
                    }}
                >
                    Has repasado{" "}
                    <strong style={{ color: mainColor, fontSize: 18 }}>{total}</strong>{" "}
                    {total === 1 ? "palabra" : "palabras"}
                </p>
                <div
                    style={{
                        display: "flex",
                        gap: 14,
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginTop: 10,
                    }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            setCurrentIndex(0);
                            setIsRevealed(false);
                            setIsVisible(true);
                        }}
                        style={{
                            padding: "14px 28px",
                            borderRadius: 16,
                            border: "none",
                            background: mainColor,
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 16,
                            cursor: "pointer",
                            transition: "transform 0.15s ease, opacity 0.15s ease",
                            boxShadow: "0 6px 20px rgba(37,99,235,0.25)",
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.transform = "scale(0.97)";
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        ↻ Repasar nuevamente
                    </button>
                </div>
            </div>
        );
    }

    const handleListen = () => {
        if (isSpeaking || !currentWord?.word) return;

        setIsSpeaking(true);
        speakText(
            currentWord.word,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false)
        );
    };

    const handleNext = () => {
        if (currentIndex >= total - 1) return;

        setIsVisible(false);
        setIsRevealed(false);

        setTimeout(() => {
            setCurrentIndex((i) => i + 1);
            setIsVisible(true);
        }, 220);
    };

    const handlePrev = () => {
        if (currentIndex <= 0) return;

        setIsVisible(false);
        setIsRevealed(false);

        setTimeout(() => {
            setCurrentIndex((i) => i - 1);
            setIsVisible(true);
        }, 220);
    };

    const progress = ((currentIndex + 1) / total) * 100;

    return (
        <div
            style={{
                display: "grid",
                gap: 20,
                maxWidth: 680,
                margin: "0 auto",
                width: "100%",
            }}
        >
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.96); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.06); }
                }
                @keyframes floatIn {
                    from { opacity: 0; transform: translateY(14px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                }}
            >
                <div
                    style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: textColor,
                        fontFamily: "Fredoka",
                        whiteSpace: "nowrap",
                    }}
                >
                    {currentIndex + 1} / {total}
                </div>
                <div
                    style={{
                        flex: 1,
                        height: 10,
                        borderRadius: 999,
                        background: "#E2E8F0",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: "100%",
                            borderRadius: 999,
                            background: mainColor,
                            transition: "width 0.35s ease",
                        }}
                    />
                </div>
            </div>

            <div
                onClick={() => setIsRevealed((prev) => !prev)}
                style={{
                    background: "#fff",
                    borderRadius: 28,
                    padding: "clamp(28px, 6vw, 48px) clamp(24px, 5vw, 40px)",
                    textAlign: "center",
                    cursor: "pointer",
                    boxShadow: "0 24px 80px rgba(15,23,42,0.10), 0 0 0 1px rgba(36,31,26,0.06)",
                    border: "2px solid rgba(36,31,26,0.06)",
                    display: "grid",
                    gap: 18,
                    transform: isVisible ? "scale(1)" : "scale(0.96)",
                    opacity: isVisible ? 1 : 0,
                    transition: "transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease",
                    animation: isVisible ? "floatIn 0.35s ease" : "none",
                    userSelect: "none",
                }}
            >
                <div
                    style={{
                        fontSize: "clamp(88px, 18vw, 130px)",
                        lineHeight: 1,
                        margin: "0 auto",
                        animation: "fadeIn 0.4s ease",
                    }}
                >
                    {currentWord.emoji || "📘"}
                </div>

                <h2
                    style={{
                        margin: 0,
                        fontSize: "clamp(32px, 7vw, 48px)",
                        fontWeight: 800,
                        color: textColor,
                        fontFamily: "Fredoka",
                        lineHeight: 1.15,
                    }}
                >
                    {currentWord.word}
                </h2>

                {currentWord.pronunciation && (
                    <div
                        style={{
                            fontSize: "clamp(17px, 3.5vw, 22px)",
                            color: "#64748B",
                            fontStyle: "italic",
                            marginTop: -6,
                        }}
                    >
                        {currentWord.pronunciation}
                    </div>
                )}

                <div
                    style={{
                        overflow: "hidden",
                        transition: "all 0.35s ease",
                        maxHeight: isRevealed ? 240 : 0,
                        opacity: isRevealed ? 1 : 0,
                        marginTop: isRevealed ? 6 : 0,
                    }}
                >
                    {isRevealed && (
                        <div
                            style={{
                                display: "grid",
                                gap: 12,
                                animation: "fadeIn 0.3s ease",
                            }}
                        >
                            {currentWord.translation && (
                                <div
                                    style={{
                                        fontSize: "clamp(20px, 4vw, 26px)",
                                        color: mainColor,
                                        fontWeight: 700,
                                    }}
                                >
                                    {currentWord.translation}
                                </div>
                            )}
                            {currentWord.sentence && (
                                <div
                                    style={{
                                        fontSize: "clamp(15px, 2.8vw, 18px)",
                                        color: "#374151",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {currentWord.sentence}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleListen();
                    }}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        padding: "12px 24px",
                        borderRadius: 16,
                        border: "none",
                        background: isSpeaking ? "#F1F5F9" : mainColor,
                        color: isSpeaking ? textColor : "#fff",
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        transform: isSpeaking ? "scale(1.03)" : "scale(1)",
                        animation: isSpeaking ? "pulse 1.2s ease-in-out infinite" : "none",
                        fontFamily: "Fredoka",
                        margin: "0 auto",
                        boxShadow: isSpeaking ? "none" : "0 6px 20px rgba(37,99,235,0.25)",
                    }}
                    aria-label={isSpeaking ? "Reproduciendo pronunciación" : "Escuchar pronunciación"}
                >
                    <span
                        style={{
                            fontSize: 20,
                            lineHeight: 1,
                        }}
                    >
                        🔊
                    </span>
                    {isSpeaking ? "Escuchando..." : "Listen"}
                </button>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    flexWrap: "wrap",
                }}
            >
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    aria-label="Tarjeta anterior"
                    style={{
                        flex: 1,
                        minWidth: 130,
                        padding: "15px 22px",
                        borderRadius: 16,
                        border: "none",
                        background: currentIndex === 0 ? "#F1F5F9" : "#fff",
                        color: currentIndex === 0 ? "#94A3B8" : textColor,
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                        opacity: currentIndex === 0 ? 0.6 : 1,
                        transition: "all 0.15s ease",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                        fontFamily: "Fredoka",
                    }}
                >
                    ← Anterior
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentIndex >= total - 1}
                    aria-label="Siguiente tarjeta"
                    style={{
                        flex: 1,
                        minWidth: 130,
                        padding: "15px 22px",
                        borderRadius: 16,
                        border: "none",
                        background:
                            currentIndex >= total - 1 ? "#F1F5F9" : mainColor,
                        color:
                            currentIndex >= total - 1 ? "#94A3B8" : "#fff",
                        fontWeight: 700,
                        fontSize: 16,
                        cursor:
                            currentIndex >= total - 1 ? "not-allowed" : "pointer",
                        opacity: currentIndex >= total - 1 ? 0.6 : 1,
                        transition: "all 0.15s ease",
                        boxShadow:
                            currentIndex >= total - 1
                                ? "none"
                                : "0 6px 20px rgba(37,99,235,0.25)",
                        fontFamily: "Fredoka",
                    }}
                >
                    Siguiente →
                </button>
            </div>
        </div>
    );
}
