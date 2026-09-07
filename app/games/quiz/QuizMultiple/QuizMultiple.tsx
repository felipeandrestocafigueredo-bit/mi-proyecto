import React, { useEffect, useMemo, useRef, useState } from "react";

import StudentProfilePicker from "../../../components/common/StudentProfilePicker";
import { getStudentProfile, saveGameResult, saveStudentResultToSupabase } from "../../engine/playerProfile";

import { QUIZ_WORLDS, QUIZ_COLORS } from "./data";
import { QUIZ_CSS } from "./styles";
import { prepareQuestions } from "./utils";
import useQuiz from "./hooks";
import QuizEngine from "./engine";
import QuestionCard from "./components/QuestionCard";
import OptionButton from "./components/OptionButton";
import ProgressBar from "./components/ProgressBar";
import FinishScreen from "./components/FinishScreen";

interface QuizMultipleProps {
onBack?: () => void;
onExit?: () => void;
vocab?: Array<{ word?: string; en?: string; text?: string; es?: string; translation?: string }>;
lesson?: Record<string, unknown>;
colors?: Record<string, string>;
}

interface WorldItem {
id: string;
title: string;
subtitle: string;
color: string;
icon: string;
questions: any[];
grad?: [string, string];
}

function shuffleArray<T>(items: T[]): T[] {
const copy = [...items];
for (let i = copy.length - 1; i > 0; i -= 1) {
       const j = Math.floor(Math.random() * (i + 1));
       [copy[i], copy[j]] = [copy[j], copy[i]];
}
return copy;
}

function buildQuestionsFromVocab(vocab: QuizMultipleProps["vocab"]): any[] {
const items = Array.isArray(vocab) ? vocab : [];
if (!items.length) return [];

return items.slice(0, 8).map((item, index) => {
       const prompt = item.word ?? item.en ?? item.text ?? `Word ${index + 1}`;
       const correct = item.translation ?? item.es ?? prompt;
       const distractors = items
           .filter((candidate) => {
               const candidateText = candidate.translation ?? candidate.es ?? candidate.word ?? candidate.en ?? "";
               return candidateText && candidateText !== correct && candidateText !== prompt;
           })
           .map((candidate) => candidate.translation ?? candidate.es ?? candidate.word ?? candidate.en ?? "")
           .filter(Boolean)
           .slice(0, 3);

       const options = shuffleArray([correct, ...distractors].slice(0, 4));

       return {
           id: `${prompt}-${index}`,
           question: `¿Qué significa "${prompt}"?`,
           options,
           correct,
           explanation: `La respuesta correcta es "${correct}".`,
       };
});
}

export default function QuizMultiple({ onBack, onExit, vocab, colors }: QuizMultipleProps) {
const [screen, setScreen] = useState<string>("worlds");
const [worldIndex, setWorldIndex] = useState<number>(0);
const [result, setResult] = useState<QuizResult | undefined>(undefined);
const [stars, setStars] = useState<Record<number, number>>({});
const hasSavedResult = useRef(false);

const quiz = useQuiz();
const generatedQuestions = useMemo(() => buildQuestionsFromVocab(vocab), [vocab]);

const world: WorldItem = QUIZ_WORLDS[worldIndex] ?? QUIZ_WORLDS[0];
const worldQuestions = world.questions?.length ? world.questions : generatedQuestions;

useEffect(() => {
       if (screen !== "finish" || !result || hasSavedResult.current) return;

       const profile = getStudentProfile();
       const localResult = saveGameResult({
               gameId: "quizMultiple",
               title: "Quiz Multiple",
               studentName: profile.name,
               avatar: profile.avatar,
               score: result.score,
               percentage: result.accuracy,
               accuracy: result.accuracy,
               attempts: result.total,
               monthIndex: 0,
               weekIndex: 0,
               gradeCode: "g67",
       });

       void saveStudentResultToSupabase(localResult).catch((error) => {
               console.error("No se pudo guardar el resultado de Quiz Multiple en Supabase:", error);
       });
       hasSavedResult.current = true;
}, [screen, result]);

const engine = QuizEngine({
       questions: quiz.questions,
       quiz,
});

useEffect(() => {
       if (screen !== "game") return;

       if (!worldQuestions.length) return;
       quiz.loadQuestions(prepareQuestions(worldQuestions));
}, [screen, worldQuestions, quiz]);

useEffect(() => {
       if (generatedQuestions.length && screen === "worlds") {
           hasSavedResult.current = false;
           setScreen("game");
           setWorldIndex(0);
       }
}, [generatedQuestions, screen]);

function finishQuiz(): void {
       const finalResult = engine.finishQuiz();

       setStars((prev) => ({
           ...prev,
           [worldIndex]: Math.max(prev[worldIndex] || 0, finalResult.stars),
       }));

       setResult({
           ...finalResult,
           total: quiz.questions.length,
           worldIndex,
       });

       setScreen("finish");
}

function isUnlocked(index: number): boolean {
       if (index === 0) return true;
       return !!stars[index - 1];
}

if (screen === "worlds") {
       return (
           <div>
               <style>{QUIZ_CSS}</style>
               <StudentProfilePicker colors={{ main: colors?.main ?? QUIZ_COLORS.info, light: "#E0F2FE", text: "#0F172A" }} compact />
               <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                   <button type="button" onClick={() => (onBack ? onBack() : onExit?.())}>
                       ←
                   </button>
                   <h2>Quiz Multiple</h2>
               </div>

               <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                   {QUIZ_WORLDS.map((item, index) => {
                       const unlocked = isUnlocked(index);
                       return (
                           <button
                               key={item.id}
                               disabled={!unlocked}
                               onClick={() => {
                                   if (!unlocked) return;
                                   setWorldIndex(index);
                                   setScreen("game");
                               }}
                               style={{
                                   padding: 18,
                                   borderRadius: 18,
                                   border: "none",
                                   cursor: unlocked ? "pointer" : "default",
                                   opacity: unlocked ? 1 : 0.45,
                                   textAlign: "left",
                                   background: unlocked ? `linear-gradient(135deg,${item.grad?.[0] || item.color},${item.grad?.[1] || item.color})` : "#DDD",
                                   color: "#FFF",
                               }}
                           >
                               <div style={{ fontSize: "2rem" }}>{unlocked ? item.icon : "🔒"}</div>
                               <h3>{item.title}</h3>
                               <small>{item.questions.length || generatedQuestions.length || 0} Questions</small>
                           </button>
                       );
                   })}
               </div>
           </div>
       );
}

if (screen === "game") {
       const question = engine.current;

       if (!question) return null;

       return (
           <div className="quiz-container">
               <style>{QUIZ_CSS}</style>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                   <span style={{ color: colors?.main ?? QUIZ_COLORS.info, fontWeight: 700 }}>Quiz</span>
                   <button type="button" onClick={() => (onBack ? onBack() : onExit?.())} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 20 }}>
                       ←
                   </button>
               </div>

               <ProgressBar current={quiz.currentQuestion + 1} total={quiz.questions.length} progress={quiz.stats.progress} time={quiz.timeLeft} />
               <QuestionCard question={question} current={quiz.currentQuestion + 1} total={quiz.questions.length} progress={quiz.stats.progress} />

               <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
                   {question.options.map((option: any, index: number) => (
                       <OptionButton
                           key={index}
                           option={option}
                           index={index}
                           selected={quiz.selectedAnswer}
                           correct={question.correct}
                           disabled={quiz.selectedAnswer !== null}
                           onSelect={(answer: string) => {
                               quiz.selectAnswer(answer);
                               engine.checkAnswer(answer);
                               setTimeout(() => {
                                   if (quiz.currentQuestion + 1 >= quiz.questions.length) {
                                       finishQuiz();
                                   } else {
                                       engine.next();
                                   }
                               }, 900);
                           }}
                       />
                   ))}
               </div>

               <div style={{ marginTop: 24, textAlign: "center" }}>
                   <button className="quiz-btn" type="button" onClick={() => setScreen("worlds")}>🏠 Exit Quiz</button>
               </div>
           </div>
       );
}

if (screen === "finish") {
       return (
           <FinishScreen
               result={result}
               onRestart={() => {
                   quiz.reset();
                   quiz.loadQuestions(prepareQuestions(worldQuestions));
                   setScreen("game");
               }}
               onWorlds={() => {
                   quiz.reset();
                   setScreen("worlds");
               }}
               onBack={() => (onBack ? onBack() : onExit?.())}
           />
       );
}

return null;
}

interface QuizResult {
score: number;
correct: number;
total: number;
accuracy: number;
stars: number;
coins: number;
worldIndex: number;
wrong?: number;
streak?: number;
}