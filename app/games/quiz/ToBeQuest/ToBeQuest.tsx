import React, { useState } from "react";

import {

    TOBE_WORLDS,

} from "./data";

import {

    TOBE_CSS,

} from "./styles";

import {

    prepareQuestions,

    calculateStars,

    calculateAccuracy,

} from "./utils";

import useToBeQuest from "./hooks";

import ToBeEngine from "./engine";

import QuestionCard from "./components/QuestionCard";

import OptionButton from "./components/OptionButton";

import ProgressBar from "./components/ProgressBar";

import FinishScreen from "./components/FinishScreen";

/* ==========================================================
   TO BE QUEST
   Arquitectura 3.0
========================================================== */

interface ToBeQuestProps {
    onBack: () => void;
}

interface ResultData {
    correct: number;
    total: number;
    stars: number;
    score: number;
    coins: number;
    accuracy: number;
    streak?: number;
    wrong?: number;
}

export default function ToBeQuest({
    onBack,
}: ToBeQuestProps) {

    /*=========================================================
        Estados
    =========================================================*/

    const [screen, setScreen] = useState<string>("worlds");

    const [worldIndex, setWorldIndex] = useState<number>(0);

    const [stars, setStars] = useState<Record<number, number>>({});

    const [result, setResult] = useState<ResultData | undefined>(undefined);

    /*=========================================================
        Hook
    =========================================================*/

    const quiz = useToBeQuest();

    /*=========================================================
        Engine
    =========================================================*/

    const engine = ToBeEngine({

        questions: quiz.questions,

        quiz,

    });

    /*=========================================================
        Finalizar Mundo
    =========================================================*/

    function handleFinish(): void {

        const stats = engine.finishQuiz();

        stats.total = quiz.questions.length;

        stats.accuracy = calculateAccuracy(

            stats.correct,

            stats.total

        );

        stats.stars = calculateStars(

            stats.correct,

            stats.total

        );

        setStars((prev) => ({

            ...prev,

            [worldIndex]:

                Math.max(

                    prev[worldIndex] || 0,

                    stats.stars

                ),

        }));

        setResult(stats);

        setScreen("finish");

    }

    /*=========================================================
        Pantalla de Mundos
    =========================================================*/

    if (screen === "worlds") {

        return (

            <div className="tobe-container">

                <style>{TOBE_CSS}</style>

                <div

                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 25,
                    } as React.CSSProperties}
                >

                    <h2>
                        📘 To Be Quest
                    </h2>

                    <button

                        className="tobe-btn"

                        style={{
                            width: 120,
                            background: "#64748B",
                            color: "#FFF",
                        } as React.CSSProperties}

                        onClick={onBack}

                    >
                        ← Back
                    </button>

                </div>

                <div

                    style={{
                        display: "grid",
                        gap: 18,
                    } as React.CSSProperties}
                >
                    {TOBE_WORLDS.map((world, index) => (

                        <button
                            key={world.id}
                            className="tobe-card"
                            style={{
                                cursor: "pointer",
                                textAlign: "left",
                                border: "none",
                                background: `linear-gradient(135deg,${world.grad[0]},${world.grad[1]})`,
                                color: "#FFF",
                            } as React.CSSProperties}
                            onClick={() => {
                                setWorldIndex(index);
                                quiz.loadQuestions(
                                    prepareQuestions(
                                        world.questions
                                    )
                                );
                                setScreen("game");
                            }}
                        >
                            <h2>
                                {world.icon} {world.name}
                            </h2>
                            <p>
                                {world.questions.length} Questions
                            </p>
                            <div

                                style={{
                                    fontSize: "1.5rem",
                                } as React.CSSProperties}
                            >
                                {"⭐".repeat(stars[index] || 0)}
                            </div>
                        </button>
                    ))}
                </div>

            </div>

        );

    }    /*=========================================================
        Pantalla del Juego
    =========================================================*/

    if (screen === "game") {

        const question = engine.current;

        if (!question) {
            handleFinish();
            return null;
        }

        return (

            <div className="tobe-container">

                <style>{TOBE_CSS}</style>

                <ProgressBar
                    current={quiz.currentQuestion + 1}
                    total={quiz.questions.length}
                    progress={quiz.stats.progress}
                    time={quiz.timeLeft}
                />

                <QuestionCard
                    question={question}
                    current={quiz.currentQuestion + 1}
                    total={quiz.questions.length}
                    progress={quiz.stats.progress}
                />

                <div

                    style={{
                        display: "grid",
                        gap: 15,
                        marginTop: 25,
                    } as React.CSSProperties}
                >
                    {question.options.map((option: any, index: number) => (
                        <OptionButton
                            key={index}
                            index={index}
                            option={option}
                            selected={quiz.selectedAnswer}
                            correct={question.correct}
                            disabled={quiz.selectedAnswer !== null}
                            onSelect={(answer: string) => {
                                if (quiz.selectedAnswer) return;
                                quiz.selectAnswer(answer);
                                engine.checkAnswer(answer);
                                setTimeout(() => {
                                    if (
                                        quiz.currentQuestion + 1 >=
                                        quiz.questions.length
                                    ) {
                                        handleFinish();
                                    } else {
                                        engine.next();
                                    }
                                }, 900);
                            }}
                        />
                    ))}
                </div>

                <div

                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 30,
                        color: "#64748B",
                        fontWeight: 700,
                    } as React.CSSProperties}
                >
                    <span>
                        ⭐ Score: {quiz.stats.score}
                    </span>
                    <span>
                        🪙 Coins: {quiz.stats.coins}
                    </span>
                    <span>
                        ✅ Correct: {quiz.stats.correct}
                    </span>
                </div>

            </div>

        );

    }    /*=========================================================
        Pantalla Final
    =========================================================*/

    if (screen === "finish") {

        return (

            <FinishScreen
                result={result}
                onRestart={() => {
                    quiz.loadQuestions(
                        prepareQuestions(
                            TOBE_WORLDS[worldIndex].questions
                        )
                    );
                    setScreen("game");
                }}
                onWorlds={() => {
                    setScreen("worlds");
                }}
                onBack={onBack}
            />

        );

    }

    /*=========================================================
        Seguridad
    =========================================================*/

    return null;

}
