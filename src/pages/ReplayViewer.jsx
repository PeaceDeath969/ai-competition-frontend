import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "./ReplayViewer.css";

const CELL_SIZE = 30;

const BombIcon = () => (
    <svg
        width={CELL_SIZE * 0.6}
        height={CELL_SIZE * 0.6}
        viewBox="0 0 64 64"
        className="bomb-icon"
    >
        <circle cx="32" cy="32" r="24" fill="#000" />
        <rect x="28" y="4" width="8" height="12" fill="#ffd700" />
    </svg>
);

const ReplayViewer = () => {
    const { matchId } = useParams();
    const [meta, setMeta] = useState(null);
    const [frames, setFrames] = useState([]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get(`/replays/match/${matchId}`)
            .then(({ data }) => setMeta(data))
            .catch(() => setError("Не удалось загрузить метаданные"));

        api.get(`/replays/match/${matchId}/frames`)
            .then(({ data }) => setFrames(data))
            .catch(() => setError("Не удалось загрузить кадры"));
    }, [matchId]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "ArrowRight") {
                setCurrentFrameIndex((i) => Math.min(i + 1, frames.length - 1));
            } else if (e.key === "ArrowLeft") {
                setCurrentFrameIndex((i) => Math.max(i - 1, 0));
            }
        },
        [frames.length]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }
    if (!meta || frames.length === 0) {
        return <div className="mt-5 text-center">Загрузка реплея...</div>;
    }

    const frame = frames[currentFrameIndex];
    const { grid, bombs, fire, players, tick, width, height } = frame;

    return (
        <div className="container mt-5">
            <h2>🎥 Реплей матча #{matchId}</h2>
            <p>Кадр: {currentFrameIndex + 1} / {frames.length} (тик {tick})</p>
            <p>Используйте стрелки ← и → для навигации</p>

            <div
                className="replay-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${width}, ${CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${height}, ${CELL_SIZE}px)`,
                    gap: "1px",
                    margin: "20px auto",
                }}
            >
                {grid.map((row, y) =>
                    row.map((cellType, x) => {
                        const key = `${x}-${y}`;
                        const hasBomb = bombs.some((b) => b.x === x && b.y === y);
                        const hasFire = fire.some((f) => f.x === x && f.y === y);
                        const playerEntry = Object.entries(players).find(
                            ([, p]) => p.x === x && p.y === y
                        );
                        const playerId = playerEntry ? playerEntry[0] : null;

                        let background;
                        switch (cellType) {
                            case "WALL":
                                background = "#222";
                                break;
                            case "DESTRUCTIBLE":
                                background = "#795548";
                                break;
                            default:
                                background = "#333";
                        }

                        return (
                            <div
                                key={key}
                                className="replay-cell"
                                style={{
                                    width: CELL_SIZE,
                                    height: CELL_SIZE,
                                    background,
                                    position: "relative",
                                }}
                            >
                                {hasBomb && <BombIcon />}
                                {hasFire && <div className="fire" />}
                                {playerId !== null && (
                                    <div
                                        className="player"
                                        style={{
                                            backgroundColor:
                                                playerId === "0" ? "#1e88e5" : "#e53935",
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ReplayViewer;
