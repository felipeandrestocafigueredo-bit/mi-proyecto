import { useEffect, useState } from "react";

interface VocabItem {
    word?: string;
    en?: string;
    english?: string;
    emoji?: string;
    pronunciation?: string;
    phonetic?: string;
    topic?: string;
    category?: string;
    categoryLabel?: string;
}

interface FlashcardsGameProps {
    vocab?: VocabItem[];
    colors?: { light?: string; text?: string; main?: string };
}

export default function FlashcardsGame({ vocab = [], colors = {} }: FlashcardsGameProps) {
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        setIndex(0);
    }, [vocab]);

    const hasVocab: boolean = vocab.length > 0;
    const item: VocabItem = hasVocab ? vocab[index] : {};
    const front: string = item.en ?? item.word ?? item.english ?? "-";
    const emoji: string = item.emoji ?? "🌟";
    const pronunciation: string = item.pronunciation ?? item.phonetic ?? "";
    const theme: string = item.topic ?? item.category ?? item.categoryLabel ?? "Vocabulary";

    function handleNext(): void {
        if (!hasVocab) return;
        setIndex((current) => (current + 1) % vocab.length);
    }

    function handlePrev(): void {
        if (!hasVocab) return;
        setIndex((current) => (current - 1 + vocab.length) % vocab.length);
    }

    function handleSpeak(): void {
        if (!front) {
            return;
        }

        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(front);
            utterance.lang = "en-US";
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    }

    if (!hasVocab) {
        return (
            <div
                style={{
                    background: "#fff",
                    borderRadius: 24,
                    padding: 24,
                    border: "2px solid rgba(36,31,26,.08)",
                    minHeight: 260,
                    display: "grid",
                    placeItems: "center",
                    color: "#64748B",
                } as React.CSSProperties}
            >
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                    No hay Flashcards disponibles para esta semana.
                </div>
                <div>Revisa la configuración de vocabulario o vuelve a seleccionar otra semana.</div>
            </div>
        );
    }

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 24,
                padding: 24,
                border: "2px solid rgba(36,31,26,.08)",
                display: "grid",
                gap: 18,
            } as React.CSSProperties}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                } as React.CSSProperties}
            >
                <div style={{ fontWeight: 700, fontSize: 18 }}>{theme}</div>
                <div style={{ color: "#64748B", fontSize: 14 }}>
                    {index + 1} / {vocab.length}
                </div>
            </div>

            <div
                style={{
                    minHeight: 260,
                    borderRadius: 22,
                    background: colors.light ?? "#F8FAFC",
                    color: colors.text ?? "#1E293B",
                    display: "grid",
                    placeItems: "center",
                    padding: 24,
                    textAlign: "center",
                    boxShadow: "0 18px 45px rgba(15,23,42,.05)",
                } as React.CSSProperties}
            >
                <div style={{ fontSize: 72, marginBottom: 18, lineHeight: 1 }}>
                    {emoji}
                </div>
                <div style={{ fontSize: 42, fontWeight: 800, marginBottom: pronunciation ? 12 : 18 }}>
                    {front}
                </div>
                {pronunciation && (
                    <div style={{ fontSize: 18, color: "#334155", marginBottom: 16 }}>
                        {pronunciation}
                    </div>
                )}
                <button
                    type="button"
                    onClick={handleSpeak}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 16px",
                        borderRadius: 14,
                        border: "none",
                        background: colors.main ?? "#2563EB",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 700,
                    } as React.CSSProperties}
                >
                    🔊 Escuchar
                </button>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={!hasVocab}
                    style={{
                        flex: 1,
                        padding: "12px 18px",
                        borderRadius: 14,
                        border: "none",
                        background: colors.light ?? "#E2E8F0",
                        color: colors.text ?? "#0F172A",
                        cursor: hasVocab ? "pointer" : "not-allowed",
                        fontWeight: 700,
                        opacity: hasVocab ? 1 : 0.55,
                    } as React.CSSProperties}
                >
                    ← Anterior
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!hasVocab}
                    style={{
                        flex: 1,
                        padding: "12px 18px",
                        borderRadius: 14,
                        border: "none",
                        background: colors.main ?? "#2563EB",
                        color: "#fff",
                        cursor: hasVocab ? "pointer" : "not-allowed",
                        fontWeight: 700,
                        opacity: hasVocab ? 1 : 0.55,
                    } as React.CSSProperties}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
