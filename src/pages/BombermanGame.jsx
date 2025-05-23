import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import "./BombermanGame.css";

const CELL_SIZE = 50;
const keyMap = {
    ArrowUp: "UP",
    ArrowDown: "DOWN",
    ArrowLeft: "LEFT",
    ArrowRight: "RIGHT",
    Space: "BOMB",
};
const GRID_ROWS = 11;
const GRID_COLS = 13;
const createGrid = () =>
    Array.from({ length: GRID_ROWS }, (_, y) =>
        Array.from({ length: GRID_COLS }, (_, x) =>
            y % 2 === 1 && x % 2 === 1 ? "WALL" : "EMPTY"
        )
    );

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

const BombermanGame = () => {
    const { state } = useLocation();
    const { lobby } = state || {};
    const { token, user } = useAuthStore();
    const wsRef = useRef(null);

    const [grid, setGrid] = useState(createGrid());
    const [players, setPlayers] = useState({});
    const [bombs, setBombs] = useState([]);
    const [fire, setFire] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [winnerId, setWinnerId] = useState(null);
    const [draw, setDraw] = useState(false);

    useEffect(() => {
        if (!lobby) return;
        const ws = new WebSocket(
            `wss://course.af.shvarev.com/ws/${lobby.id}?token=${token}`
        );
        wsRef.current = ws;

        ws.onopen = () => console.log("WebSocket connected");
        ws.onmessage = ({ data }) => {
            const msg = JSON.parse(data);

            if (msg.event === "init_state" || msg.tick !== undefined) {
                setGrid(msg.grid);
                setPlayers(msg.players);
                setBombs(msg.bombs || []);
                setFire(msg.fire || []);

                const aliveEntries = Object.entries(msg.players).filter(
                    ([, p]) => p.alive
                );
                if (aliveEntries.length === 0) {
                    setGameOver(true);
                    setDraw(true);
                    setWinnerId(null);
                } else if (aliveEntries.length === 1) {
                    setGameOver(true);
                    setDraw(false);
                    setWinnerId(parseInt(aliveEntries[0][0], 10));
                }
            }

            if (msg.result) {
                setGameOver(true);
                if (msg.result === "draw") {
                    setDraw(true);
                    setWinnerId(null);
                } else {
                    setDraw(false);
                    setWinnerId(msg.winner_id);
                }
            }
        };

        ws.onerror = console.error;
        ws.onclose = () => console.log("WebSocket closed");
        return () => ws.close();
    }, [lobby, token]);

    useEffect(() => {
        const handler = (e) => {
            const action = keyMap[e.key] || keyMap[e.code];
            if (action && wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ action }));
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <div className="bomberman-container">
            {grid.map((row, y) => (
                <div key={y} className="row">
                    {row.map((cellType, x) => {
                        const entry = Object.entries(players).find(
                            ([, p]) => p.x === x && p.y === y
                        );
                        const pid = entry ? parseInt(entry[0], 10) : null;
                        const hasBomb = bombs.some((b) => b.x === x && b.y === y);
                        const hasFire = fire.some((f) => f.x === x && f.y === y);

                        const playerColor =
                            pid !== null
                                ? pid === user.id
                                    ? "#1e88e5"
                                    : "#e53935"
                                : null;

                        return (
                            <div
                                key={x}
                                className="replay-cell"
                                style={{
                                    width: CELL_SIZE,
                                    height: CELL_SIZE,
                                    background:
                                        cellType === "WALL"
                                            ? "#222"
                                            : cellType === "DESTRUCTIBLE"
                                                ? "#795548"
                                                : "#333",
                                }}
                            >
                                {hasBomb && <BombIcon />}
                                {hasFire && <div className="fire" />}
                                {pid !== null && (
                                    <div
                                        className="player"
                                        style={{ backgroundColor: playerColor }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}

            {gameOver && (
                <div className="game-over-overlay">
                    <div className="game-over-modal">
                        {draw
                            ? "Ничья!"
                            : winnerId === user.id
                                ? "Победа!"
                                : "Поражение!"}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BombermanGame;
