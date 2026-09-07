import React, { useEffect, useState } from "react";

import {

    FINAL_WORLDS,

    FINAL_CSS,

} from "./data";

import {

    prepareQuestions,

    calculateStars,

} from "./utils";

import useFinalChallenge from "./hooks";

import FinalChallengeEngine from "./engine";

import QuestionCard from "./components/QuestionCard";

import OptionButton from "./components/OptionButton";

import ProgressBar from "./components/ProgressBar";

import LivesBar from "./components/LivesBar";

import FinishScreen from "./components/FinishScreen";

/* ==========================================================
   FINAL CHALLENGE
   Arquitectura 3.0
========================================================== */

interface FinalChallengeProps {
    onBack: () => void;
}

interface WorldData {
    id: string;
    name: string;
    icon: string;
    grad: [string, string];
    description?: string;
    questions: any[];
}

export default function FinalChallenge({
    onBack,
}: FinalChallengeProps) {

    /*=========================================================
        Estados generales
    =========================================================*/

    const [screen, setScreen] = useState<string>("worlds");

    const [worldIndex, setWorldIndex] = useState<number>(0);

    const [stars, setStars] = useState<Record<number, number>>({});

    const [selectedWorld, setSelectedWorld] = useState<WorldData | undefined>(undefined);

    /*=========================================================
        Hook principal
    =========================================================*/

    const game = useFinalChallenge();

    /*=========================================================
        Motor
    =========================================================*/

    const engine = FinalChallengeEngine({

        world: selectedWorld,

        game,

    });

    /*=========================================================
        Cargar preguntas
    =========================================================*/

    useEffect(() => {

        if (!selectedWorld) return;

        const questions = prepareQuestions(

            selectedWorld.questions

        );

        game.loadQuestions(questions);

    }, [selectedWorld]);

    /*=========================================================
        Finalizar Mundo
    =========================================================*/

    function finishWorld(): void {

        const earnedStars = calculateStars(

            game.stats.correct,

            game.stats.correct +

            game.stats.wrong

        );

        setStars((prev) => ({

            ...prev,

            [worldIndex]: Math.max(

                prev[worldIndex] || 0,

                earnedStars

            ),

        }));

        game.finishGame();

        setScreen("finish");

    }

    /*=========================================================
        Selección de mundos
    =========================================================*/

    if (screen === "worlds") {

        return (

            <div className="fc-container">

                <style>{FINAL_CSS}</style>

                <div

                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 20,
                    } as React.CSSProperties}
                >
                    <button
                        className="fc-btn"
                        onClick={onBack}
                    >
                        ←
                    </button>

                    <h2>
                        Final Challenge
                    </h2>

                </div>

                <div

                    style={{
                        display: "grid",
                        gap: 15,
                    } as React.CSSProperties}
                >
                    {FINAL_WORLDS.map(
                        (world, index) => {
                            const unlocked =
                                index === 0 ||
                                stars[index - 1];

                            return (
                                <button
                                    key={world.id}
                                    className="fc-card"
                                    disabled={!unlocked}
                                    onClick={() => {
                                        setWorldIndex(index);
                                        setSelectedWorld(world);
                                        setScreen("game");
                                    }}
                                    style={{
                                        opacity: unlocked
                                            ? 1
                                            : .45,
                                        cursor: unlocked
                                            ? "pointer"
                                            : "default",
                                        textAlign: "left",
                                    } as React.CSSProperties}
                                >
                                    <h3>
                                        {unlocked
                                            ? world.icon
                                            : "🔒"}
                                        {" "}
                                        {world.name}
                                    </h3>

                                    <p>
                                        {world.description}
                                    </p>

                                    <div>
                                        {"⭐".repeat(stars[index] || 0)}
                                    </div>

                                </button>
                            );
                        }
                    )}
                </div>

            </div>

        );

    }    /*=========================================================
        Pantalla del Juego
    =========================================================*/

    if (screen === "game") {

        const question = engine.current;

        if (!question) {
            finishWorld();
            return null;
        }

        return (

            <div className="fc-container">

                <style>{FINAL_CSS}</style>

                <ProgressBar
                    current={game.currentQuestion}
                    total={game.questions.length}
                />

                <LivesBar
                    lives={game.stats.lives}
                    maxLives={3}
                />

                <QuestionCard
                    question={question}
                    current={game.currentQuestion}
                    total={game.questions.length}
                    category={question.category}
                />

                <div

                    style={{
                        display: "grid",
                        gap: 14,
                        marginTop: 25,
                    } as React.CSSProperties}
                >
                    {question.options.map(
                        (option: any, index: number) => (
                            <OptionButton
                                key={index}
                                text={option}
                                selected={game.selectedAnswer === option}
                                correct={game.selectedAnswer !== null && option === question.correct}
                                wrong={game.selectedAnswer === option && option !== question.correct}
                                disabled={game.selectedAnswer !== null}
                                onClick={() => {
                                    if (game.selectedAnswer !== null) return;
                                    game.selectAnswer(option);
                                    engine.checkAnswer(option);
                                    setTimeout(() => {
                                        if (game.stats.lives <= 0) {
                                            finishWorld();
                                            return;
                                        }
                                        if (game.currentQuestion + 1 >= game.questions.length) {
                                            finishWorld();
                                        } else {
                                            engine.next();
                                        }
                                    }, 900);
                                }}
                            />
                        )
                    )}
                </div>

                <div
                    className="fc-stats"
                    style={{ marginTop: 30 }}
                >
                    <div className="fc-stat">
                        <h2>{game.stats.score}</h2>
                        <small>Score</small>
                    </div>

                    <div className="fc-stat">
                        <h2>{game.stats.coins}</h2>
                        <small>Coins</small>
                    </div>

                    <div className="fc-stat">
                        <h2>{game.stats.correct}</h2>
                        <small>Correct</small>
                    </div>

                    <div className="fc-stat">
                        <h2>{game.timeLeft}s</h2>
                        <small>Time</small>
                    </div>

                </div>

            </div>

        );

    }    /*=========================================================
        Pantalla Final
    =========================================================*/

    if (screen === "finish") {

        const earnedStars = calculateStars(

            game.stats.correct,

            game.stats.correct +

            game.stats.wrong

        );

        return (

            <FinishScreen

                world={selectedWorld}

                stats={game.stats}

                stars={earnedStars}

                hasNextWorld={worldIndex < FINAL_WORLDS.length - 1}

                onNext={() => {
                    const nextIndex =
                        worldIndex + 1;
                    setWorldIndex(nextIndex);
                    setSelectedWorld(
                        FINAL_WORLDS[nextIndex]
                    );
                    setScreen("game");
                }}

                onReplay={() => {
                    if (!selectedWorld) return;
                    game.loadQuestions(
                        prepareQuestions(
                            selectedWorld.questions
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
