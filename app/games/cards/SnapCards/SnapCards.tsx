import React, { useEffect, useMemo, useRef } from "react";

import StudentProfilePicker from "../../../components/common/StudentProfilePicker";
import { getStudentProfile, saveGameResult, saveStudentResultToSupabase } from "../../engine/playerProfile";

import "./styles";

import {

    SNAP_CSS,

} from "./styles";

import {

    SNAP_DATA,

    SNAP_CONFIG,

} from "./data";

import useSnapCards from "./hooks";

import SnapEngine from "./engine";

import Card from "./components/Card";

import ProgressBar from "./components/ProgressBar";

import ScoreBoard from "./components/ScoreBoard";

import FinishScreen from "./components/FinishScreen";

/* ==========================================================
   SNAP CARDS
   Arquitectura Oficial 3.0
========================================================== */

interface SnapCardsProps {
    lesson?: string;
    vocab?: { word: string; emoji?: string; image?: string }[];
    onExit?: () => void;
}

interface CardData {
    id?: string;
    word: string;
    emoji?: string;
    image?: string;
    selected?: boolean;
    correct?: boolean;
    wrong?: boolean;
}

interface GameResults {
    score: number;
    lives: number;
    rounds: number;
    total: number;
    stars: number;
}

export default function SnapCards({
    vocab = [],
    onExit,
}: SnapCardsProps) {

    /*=========================================================
        Hook principal
    =========================================================*/

    const game = useSnapCards();
    const hasSavedResult = useRef(false);

    /*=========================================================
        Vocabulario utilizado
    =========================================================*/

    const vocabulary = useMemo<CardData[]>(() => {

        if (

            Array.isArray(vocab) &&

            vocab.length

        ) {

            return vocab;

        }

        return SNAP_DATA;

    }, [vocab]);

    /*=========================================================
        Motor del juego
    =========================================================*/

    const engine = useMemo(() =>

        SnapEngine({

            vocabulary,

            game,

        }),

        [vocabulary, game]

    );

    /*=========================================================
        Iniciar juego
    =========================================================*/

    useEffect(() => {

        engine.start();

    }, []);

    /*=========================================================
        Cuenta regresiva
    =========================================================*/

    useEffect(() => {

        if (

            !game.playing ||

            game.finished

        ) {

            return;

        }

        const timer = setInterval(() => {

            game.setTimeLeft((time: number) => {

                if (time <= 1) {

                    clearInterval(timer);

                    engine.timeout();

                    return 0;

                }

                return time - 1;

            });

        }, 1000);

        return () => clearInterval(timer);

    }, [

        game.playing,

        game.finished,

    ]);

    /*=========================================================
        Resultado
    =========================================================*/

    const results: GameResults = engine.getResults();

    useEffect(() => {
        if (!game.finished || hasSavedResult.current) return;

        const profile = getStudentProfile();
        const percentage = results.total ? Math.round((results.rounds / results.total) * 100) : 0;

        const localResult = saveGameResult({
           gameId: "snapCards",
           title: "Snap Cards",
           studentName: profile.name,
           avatar: profile.avatar,
           score: results.score,
           percentage,
           accuracy: percentage,
           attempts: results.total,
           monthIndex: 0,
           weekIndex: 0,
           gradeCode: "g67",
        });

        void saveStudentResultToSupabase(localResult).catch((error) => {
           console.error("No se pudo guardar el resultado de Snap Cards en Supabase:", error);
        });

        hasSavedResult.current = true;
    }, [game.finished, results.rounds, results.score, results.total]);

    /*=========================================================
        Render
    =========================================================*/

    return (

        <>

            <style>{SNAP_CSS}</style>

            <div className="snap-container">
                <StudentProfilePicker colors={{ main: "#2563EB", light: "#DBEAFE", text: "#0F172A" }} compact />

                <div className="snap-header">

                    <h2 className="snap-title">

                        ⚡ Snap Cards

                    </h2>

                </div>

                <ScoreBoard

                    score={game.score}

                    lives={game.lives}

                    timeLeft={game.timeLeft}

                    stars={results.stars}

                />

                <ProgressBar

                    progress={game.progress}

                    current={game.current}

                    total={game.total}

                />                <div className="snap-target">

                    <h3>

                        Find this card

                    </h3>

                    {game.target && (

                        <div className="snap-target-card">

                            {game.target.image ? (

                                <img

                                    src={game.target.image}

                                    alt={game.target.word}

                                    className="snap-target-image"

                                />

                            ) : (

                                <div className="snap-target-emoji">

                                    {game.target.emoji}

                                </div>

                            )}

                            <h2>

                                {game.target.word}

                            </h2>

                        </div>

                    )}

                </div>

                {game.message && (

                    <div className="snap-message">

                        {game.message}

                    </div>

                )}

                <div className="snap-board">

                    {game.cards.map((card: CardData, index: number) => (

                        <Card

                            key={card.id ?? `${card.word}-${index}`}

                            card={card}

                            selected={

                                game.target?.word === card.word

                            }

                            disabled={

                                game.finished

                            }

                            onClick={() => engine.selectCard(card)}

                        />

                    ))}

                </div>

                {game.finished && (

                    <FinishScreen

                        score={results.score}

                        stars={results.stars}

                        correct={results.rounds}

                        total={results.total}

                        onRestart={() => engine.restart()}

                        onExit={onExit}

                    />

                )}            </div>

        </>

    );

}
