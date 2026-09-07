import React from "react";

import Podium from "./Podium";

import {
    calculateAccuracy,
    calculateRanking,
} from "../utils";

/* ==========================================================
   FINISH SCREEN
   Final Challenge
   Arquitectura 3.0
========================================================== */

interface WorldData {
    id: string;
    name: string;
    icon: string;
    grad: [string, string];
    description?: string;
    questions: any[];
}

interface GameStats {
    score: number;
    correct: number;
    wrong: number;
    coins: number;
    lives: number;
}

interface FinishScreenProps {
    world?: WorldData;
    stats: GameStats;
    stars: number;
    onReplay: () => void;
    onWorlds: () => void;
    onBack: () => void;
    onNext?: () => void;
    hasNextWorld?: boolean;
}

interface RankingData {
    rank: string;
    score: number;
    accuracy: number;
    coins: number;
}

export default function FinishScreen({
    world,
    stats,
    stars,
    onReplay,
    onWorlds,
    onBack,
    onNext,
    hasNextWorld = false,
}: FinishScreenProps) {

    const accuracy = calculateAccuracy(

        stats.correct,

        stats.correct + stats.wrong

    );

    const ranking: RankingData = calculateRanking({

        score: stats.score,

        accuracy,

        coins: stats.coins,

    });

    return (

        <div className="fc-container">
            <div className="fc-card fc-pop">

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: 20,
                    } as React.CSSProperties}
                >
                    <div
                        style={{
                            fontSize: "3rem",
                            marginBottom: 10,
                        } as React.CSSProperties}
                    >
                        🏆
                    </div>

                    <h2
                        style={{
                            margin: 0,
                            color: "#0F172A",
                        } as React.CSSProperties}
                    >
                        Final Challenge Complete!
                    </h2>

                    <p
                        style={{
                            color: "#64748B",
                            marginTop: 8,
                        } as React.CSSProperties}
                    >
                        {world?.name}
                    </p>

                </div>

                {/* Estrellas */}

                <div
                    className="fc-stars"
                    style={{
                        textAlign: "center",
                        marginBottom: 25,
                    } as React.CSSProperties}
                >
                    {"⭐".repeat(stars)}
                    {"☆".repeat(3 - stars)}
                </div>

                {/* Podio */}

                <Podium stars={stars} />

                {/* Estadísticas */}

                <div className="fc-stats">

                    <div className="fc-stat">
                        <h2>{stats.score}</h2>
                        <small>Score</small>
                    </div>

                    <div className="fc-stat">
                        <h2>{stats.correct}</h2>
                        <small>Correct</small>
                    </div>

                    <div className="fc-stat">
                        <h2>{stats.wrong}</h2>
                        <small>Wrong</small>
                    </div>

                    <div className="fc-stat">
                        <h2>{accuracy}%</h2>
                        <small>Accuracy</small>
                    </div>

                    <div className="fc-stat">
                        <h2>{stats.coins}</h2>
                        <small>Coins</small>
                    </div>

                    <div className="fc-stat">
                        <h2>{ranking.rank}</h2>
                        <small>Rank</small>
                    </div>

                </div>

                {/* Ranking */}

                <div
                    style={{
                        marginTop: 25,
                        marginBottom: 30,
                        textAlign: "center",
                    } as React.CSSProperties}
                >
                    <h3
                        style={{
                            marginBottom: 10,
                        } as React.CSSProperties}
                    >
                        Final Rank
                    </h3>

                    <div
                        style={{
                            fontSize: "3rem",
                            fontWeight: 800,
                            color: "#2563EB",
                        } as React.CSSProperties}
                    >
                        {ranking.rank}
                    </div>

                </div>

                {/* Botones */}

                <div

                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    } as React.CSSProperties}
                >
                    {hasNextWorld && (
                        <button
                            className="fc-btn"
                            onClick={onNext}
                        >
                            ▶ Next World
                        </button>
                    )}

                    <button
                        className="fc-btn"
                        onClick={onReplay}
                    >
                        🔄 Play Again
                    </button>

                    <button
                        className="fc-btn"
                        onClick={onWorlds}
                    >
                        🗺 Choose World
                    </button>

                    <button
                        className="fc-btn"
                        onClick={onBack}
                    >
                        ← Back to Panel
                    </button>

                </div>

            </div>

        </div>

    );

}
