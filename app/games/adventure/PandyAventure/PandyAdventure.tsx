import React, { useState } from "react";

import {
    PA_WORLDS,
} from "./data";

import {
    PA_CSS,
} from "./styles";

import {
    paStars,
} from "./utils";

import useAdventure from "./hooks";

import AdventureEngine from "./engine";

import World from "./components/World";
import Player from "./components/Player";
import HUD from "./components/HUD";
import MissionBar from "./components/MissionBar";
import FinishScreen from "./components/FinishScreen";

/* ============================================================
   PANDY ADVENTURE
   Arquitectura 3.0
============================================================ */

interface PandyAdventureProps {
    onBack: () => void;
}

interface ResultData {
    correct: number;
    total: number;
    stars: number;
    worldIndex: number;
}

export default function PandyAdventure({
    onBack,
}: PandyAdventureProps) {

    /*=========================================================
      Estados generales
    =========================================================*/

    const [screen, setScreen] = useState<string>("worlds");

    const [worldIndex, setWorldIndex] = useState<number>(0);

    const [playerName] = useState<string>("Jugador");

    const [stars, setStars] = useState<Record<number, number>>({});

    const [result, setResult] = useState<ResultData | null>(null);

    /*=========================================================
      Hook principal
    =========================================================*/

    const adventure = useAdventure();

    /*=========================================================
      Motor del juego
    =========================================================*/

    const engine = AdventureEngine({

        world: PA_WORLDS[worldIndex],

        adventure,

    });

    /*=========================================================
      Finalizar un mundo
    =========================================================*/

    function handleFinish(stats: { correct: number; total: number }) {

        const earnedStars = paStars(

            Math.round(

                (stats.correct / stats.total) * 100

            )

        );

        setStars((prev) => ({

            ...prev,

            [worldIndex]: Math.max(

                prev[worldIndex] || 0,

                earnedStars

            ),

        }));

        setResult({

            ...stats,

            stars: earnedStars,

            worldIndex,

        });

        setScreen("end");

    }

    /*=========================================================
      Mundos desbloqueados
    =========================================================*/

    function isUnlocked(index: number): boolean {

        if (index === 0) return true;

        return !!stars[index - 1];

    }

    /*=========================================================
      Selector de mundos
    =========================================================*/

    if (screen === "worlds") {

        return (

            <div

                style={{
                    fontFamily: "'Nunito',sans-serif",
                } as React.CSSProperties}
            >

                <style>{PA_CSS}</style>

                <div

                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 14,
                    } as React.CSSProperties}
                >

                    <button

                        onClick={onBack}

                        style={{

                            background: "none",

                            border: "none",

                            cursor: "pointer",

                            fontSize: 20,

                        } as React.CSSProperties}

                    >

                        ←

                    </button>

                    <h3

                        style={{
                            margin: 0,
                        } as React.CSSProperties}
                    >
                        🐼 Pandy Adventure
                    </h3>

                </div>

                <div

                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                    } as React.CSSProperties}
                >

                    {PA_WORLDS.map((world, index) => {

                        const unlocked = isUnlocked(index);

                        return (

                            <World

                                key={world.id}

                                world={world}

                                unlocked={unlocked}

                                stars={stars[index] || 0}

                                onClick={() => {

                                    if (!unlocked) return;

                                    setWorldIndex(index);

                                    setScreen("game");

                                }}

                            />

                        );

                    })}

                </div>

            </div>

        );

    }
        /*=========================================================
      Pantalla del juego
    =========================================================*/

    if (screen === "game") {

        const currentWorld = PA_WORLDS[worldIndex];

        return (

            <div

                style={{
                    background: `linear-gradient(135deg,${currentWorld.grad[0]},${currentWorld.grad[1]})`,
                    borderRadius: 20,
                    overflow: "hidden",
                    minHeight: 650,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                } as React.CSSProperties}
            >

                <style>{PA_CSS}</style>

                <HUD

                    playerName={playerName}

                    lives={adventure.lives}

                    coins={adventure.coins}

                    score={adventure.score}

                    onBack={() => setScreen("worlds")}

                />

                <MissionBar

                    targetWord={engine.target?.word}

                    progress={engine.progress}

                    time={engine.time}

                    onSpeak={engine.speakWord}

                />

                <div

                    style={{
                        flex: 1,
                        position: "relative",
                        overflow: "hidden",
                    } as React.CSSProperties}
                >

                    <World

                        world={currentWorld}

                        engine={engine}

                    />

                    <Player

                        lane={engine.playerLane}

                        animation={engine.playerAnimation}

                    />

                </div>

            </div>

        );

    }

    /*=========================================================
      Pantalla Final
    =========================================================*/

    if (screen === "end") {

        if (!result) return null;

        return (

            <FinishScreen

                world={PA_WORLDS[result.worldIndex]}

                result={result}

                onReplay={() => {

                    adventure.reset();

                    setScreen("game");

                }}

                onNext={

                    result.worldIndex < PA_WORLDS.length - 1

                        ? () => {

                              adventure.reset();

                              setWorldIndex(result.worldIndex + 1);

                              setScreen("game");

                          }

                        : null

                }

                onWorlds={() => {

                    adventure.reset();

                    setScreen("worlds");

                }}

                onBack={onBack}

            />

        );

    }

    return null;

}
