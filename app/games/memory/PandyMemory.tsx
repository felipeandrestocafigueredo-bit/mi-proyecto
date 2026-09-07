import React, { useEffect, useMemo, useRef, useState } from "react";

import StudentProfilePicker from "../../components/common/StudentProfilePicker";
import { getStudentProfile, saveGameResult, saveStudentResultToSupabase } from "../engine/playerProfile";

interface PandyMemoryProps {
   vocab?: Array<{
       word?: string;
       en?: string;
       text?: string;
       es?: string;
       translation?: string;
       emoji?: string;
       image?: string;
   }>;
   colors?: { light?: string; text?: string; main?: string };
   onBack?: () => void;
   onExit?: () => void;
}

interface MemoryCard {
   id: string;
   pairId: string;
   face: string;
   value: string;
   emoji?: string;
   image?: string;
}

function shuffleArray<T>(items: T[]): T[] {
   const copy = [...items];
   for (let i = copy.length - 1; i > 0; i -= 1) {
       const j = Math.floor(Math.random() * (i + 1));
       [copy[i], copy[j]] = [copy[j], copy[i]];
   }
   return copy;
}

function toCardLabel(item: { word?: string; en?: string; text?: string; translation?: string; es?: string }): string {
   return item.translation ?? item.es ?? item.word ?? item.en ?? item.text ?? "Vocabulary";
}

export default function PandyMemory({ vocab = [], colors = {}, onBack, onExit }: PandyMemoryProps) {
   const normalizedVocabulary = useMemo(() => {
       return (Array.isArray(vocab) ? vocab : [])
           .map((item, index) => {
               const word = item.word ?? item.en ?? item.text ?? "";
               const translation = item.translation ?? item.es ?? item.word ?? item.en ?? "";
               return {
                   id: `${word || "card"}-${index}`,
                   word: word || `Word ${index + 1}`,
                   translation: translation || "Vocabulary",
                   emoji: item.emoji || "🎯",
                   image: item.image || "",
               };
           })
           .filter((item) => item.word && item.translation);
   }, [vocab]);

   const [cards, setCards] = useState<MemoryCard[]>([]);
   const [flipped, setFlipped] = useState<string[]>([]);
   const [matched, setMatched] = useState<string[]>([]);
   const [score, setScore] = useState(0);
   const [lives, setLives] = useState(3);
   const [message, setMessage] = useState("Encuentra los pares para ganar puntos.");
   const [isFinished, setIsFinished] = useState(false);
   const [isWon, setIsWon] = useState(false);
   const [profile, setProfile] = useState(getStudentProfile());
   const hasSavedResult = useRef(false);

   useEffect(() => {
       setProfile(getStudentProfile());
   }, []);

   useEffect(() => {
       if (!normalizedVocabulary.length) return;

       const pairs = normalizedVocabulary.slice(0, 8).map((item) => ({
           pairId: item.id,
           word: item.word,
           translation: item.translation,
           emoji: item.emoji,
           image: item.image,
       }));

       const deck: MemoryCard[] = shuffleArray(
           pairs.flatMap((item) => [
               {
                   id: `${item.pairId}-a`,
                   pairId: item.pairId,
                   face: item.word,
                   value: item.word,
                   emoji: item.emoji,
                   image: item.image,
               },
               {
                   id: `${item.pairId}-b`,
                   pairId: item.pairId,
                   face: item.translation,
                   value: item.translation,
                   emoji: item.emoji,
                   image: item.image,
               },
           ])
       );

       setCards(deck);
       setFlipped([]);
       setMatched([]);
       setScore(0);
       setLives(3);
       setMessage("Encuentra los pares para ganar puntos.");
       setIsFinished(false);
       setIsWon(false);
       hasSavedResult.current = false;
   }, [normalizedVocabulary]);

   const matchedPairs = matched.length / 2;
   const totalPairs = Math.max(1, Math.ceil(cards.length / 2));

   useEffect(() => {
       if (!isFinished || hasSavedResult.current) return;

       const finalPercentage = totalPairs > 0 ? Math.round((matchedPairs / totalPairs) * 100) : 0;
       const currentProfile = getStudentProfile();
       const localResult = saveGameResult({
           gameId: "pandyMemory",
           title: "Pandy Memory",
           studentName: currentProfile.name,
           avatar: currentProfile.avatar,
           score,
           percentage: finalPercentage,
           accuracy: finalPercentage,
           attempts: totalPairs,
           monthIndex: 0,
           weekIndex: 0,
           gradeCode: "g67",
       });

       void saveStudentResultToSupabase(localResult).catch((error) => {
           console.error("No se pudo guardar el resultado de Pandy Memory en Supabase:", error);
       });
       hasSavedResult.current = true;
   }, [isFinished, matchedPairs, score, totalPairs]);

   function revealCard(cardId: string) {
       if (isFinished || flipped.includes(cardId) || matched.includes(cardId)) return;
       if (flipped.length >= 2) return;

       const nextFlipped = [...flipped, cardId];
       setFlipped(nextFlipped);

       if (nextFlipped.length !== 2) return;

       const [firstId, secondId] = nextFlipped;
       const firstCard = cards.find((card) => card.id === firstId);
       const secondCard = cards.find((card) => card.id === secondId);

       if (!firstCard || !secondCard) {
           setFlipped([]);
           return;
       }

       if (firstCard.pairId === secondCard.pairId) {
           setTimeout(() => {
               setMatched((prev) => [...prev, firstId, secondId]);
               setScore((prev) => prev + 100);
               setMessage("¡Excelente! Pareja correcta.");
               setFlipped([]);

               const nextMatchedCount = (matched.length + 2) / 2;
               if (nextMatchedCount >= totalPairs) {
                   setIsWon(true);
                   setIsFinished(true);
                   setMessage("¡Ganaste! Todas las parejas están encontradas.");
               }
           }, 400);
           return;
       }

       setTimeout(() => {
           setLives((prev) => {
               const next = Math.max(0, prev - 1);
               if (next <= 0) {
                   setIsFinished(true);
                   setIsWon(false);
                   setMessage("Se acabaron las vidas. ¡Inténtalo de nuevo!");
               }
               return next;
           });
           setFlipped([]);
           setMessage("No coincide. Intenta otra vez.");
       }, 700);
   }

   const resetGame = () => {
       setCards((prev) => shuffleArray(prev));
       setFlipped([]);
       setMatched([]);
       setScore(0);
       setLives(3);
       setMessage("Encuentra los pares para ganar puntos.");
       setIsFinished(false);
       setIsWon(false);
   };

   if (!normalizedVocabulary.length) {
       return (
           <div style={{ background: "#fff", borderRadius: 20, padding: 20 }}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                   <h2 style={{ margin: 0 }}>Pandy Memory</h2>
                   {(onBack || onExit) && (
                       <button
                           type="button"
                           onClick={() => (onBack ? onBack() : onExit?.())}
                           style={{
                               border: "none",
                               borderRadius: 12,
                               background: "#F1F5F9",
                               color: "#243B53",
                               padding: "10px 14px",
                               cursor: "pointer",
                               fontWeight: 700,
                           }}
                       >
                           ← Volver
                       </button>
                   )}
               </div>
               <div style={{ color: "#475569" }}>No hay vocabulario disponible para este juego.</div>
           </div>
       );
   }

   return (
       <div style={{ background: "#fff", borderRadius: 24, padding: 24, border: "2px solid rgba(36,31,26,.08)", display: "grid", gap: 18 }}>
           <StudentProfilePicker colors={{ main: colors.main ?? "#2563EB", light: colors.light ?? "#EFF6FF", text: colors.text ?? "#0F172A" }} compact />
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
               <h2 style={{ margin: 0, color: colors.text ?? "#243B53" }}>Pandy Memory</h2>
               {(onBack || onExit) && (
                   <button
                       type="button"
                       onClick={() => (onBack ? onBack() : onExit?.())}
                       style={{
                           border: "none",
                           borderRadius: 12,
                           background: colors.light ?? "#F1F5F9",
                           color: colors.text ?? "#243B53",
                           padding: "10px 14px",
                           cursor: "pointer",
                           fontWeight: 700,
                       }}
                   >
                       ← Volver
                   </button>
               )}
           </div>

           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
               <div style={{ fontWeight: 700, color: "#334155" }}>Puntaje: {score}</div>
               <div style={{ fontWeight: 700, color: "#334155" }}>Vidas: {"❤️".repeat(Math.max(0, lives))}</div>
               <div style={{ fontWeight: 700, color: "#334155" }}>{matchedPairs}/{totalPairs} parejas</div>
           </div>

           <div style={{ padding: "10px 14px", background: "#F8FAFC", borderRadius: 12, color: "#475569", fontWeight: 600 }}>
               {message}
           </div>

           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 10 }}>
               {cards.map((card) => {
                   const isVisible = flipped.includes(card.id) || matched.includes(card.id);
                   return (
                       <button
                           key={card.id}
                           type="button"
                           onClick={() => revealCard(card.id)}
                           disabled={isVisible || isFinished}
                           style={{
                               minHeight: 96,
                               borderRadius: 16,
                               border: isVisible ? "2px solid #2563EB" : "2px solid #E2E8F0",
                               background: isVisible ? "#E0F2FE" : "#F8FAFC",
                               color: "#0F172A",
                               fontWeight: 700,
                               cursor: isVisible || isFinished ? "default" : "pointer",
                               display: "grid",
                               placeItems: "center",
                               gap: 6,
                               boxShadow: isVisible ? "0 8px 20px rgba(37,99,235,.15)" : "none",
                           }}
                       >
                           {isVisible ? (
                               <>
                                   <div style={{ fontSize: 22 }}>{card.emoji || "🎯"}</div>
                                   <div style={{ fontSize: 12, lineHeight: 1.3, textAlign: "center" }}>{card.face}</div>
                               </>
                           ) : (
                               <div style={{ fontSize: 28 }}>?</div>
                           )}
                       </button>
                   );
               })}
           </div>

           {isFinished && (
               <div style={{ display: "grid", gap: 10, padding: "14px 16px", borderRadius: 14, background: isWon ? "#DCFCE7" : "#FEE2E2", color: isWon ? "#166534" : "#991B1B" }}>
                   <div style={{ fontWeight: 800 }}>{isWon ? "¡Juego ganado!" : "Juego terminado"}</div>
                   <div><strong>Puntaje final:</strong> {score}</div>
                   <button
                       type="button"
                       onClick={resetGame}
                       style={{
                           border: "none",
                           borderRadius: 12,
                           background: colors.main ?? "#2563EB",
                           color: "#fff",
                           padding: "10px 16px",
                           fontWeight: 700,
                           cursor: "pointer",
                       }}
                   >
                       Jugar otra vez
                   </button>
               </div>
           )}
       </div>
   );
}
