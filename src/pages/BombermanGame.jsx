
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import "./BombermanGame.css";

const TILE_SIZE = 50;

const keyMap = {
    ArrowUp: "UP",
    ArrowDown: "DOWN",
    ArrowLeft: "LEFT",
    ArrowRight: "RIGHT",
    Space: "BOMB"
};

const BombermanGame = () => {
    const location = useLocation();
    const { lobby } = location.state || {};
    const { token } = useAuthStore();
    const wsRef = useRef(null);

    const [gameState, setGameState] = useState({
        grid: [],
        players: {},
        bombs: [],
        fire: []
    });
    // Устанавливаем WebSocket соединение и подписываемся на события
    useEffect(() => {
        if (!lobby) return;
        const wsUrl = `wss://course.af.shvarev.com/ws/${lobby.id}?token=${token}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
            // Если текущий пользователь хост, отправляем start_game
            const storedUser = JSON.parse(localStorage.getItem("user")) || {};
            if (storedUser.id === lobby.host_id) {
                ws.send(JSON.stringify({ event: "start_game" }));
            }
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            // init_state или любое обновление с tick
            if (msg.event === "init_state" || msg.tick !== undefined) {
                setGameState({
                    grid: msg.grid,
                    players: msg.players,
                    bombs: msg.bombs || [],
                    fire: msg.fire || []
                });
            }
        };

        ws.onerror = (err) => console.error("WebSocket error:", err);
        ws.onclose = () => console.log("WebSocket closed");

        return () => {
            ws.close();
        };
    }, [lobby, token]);

    // Обработчик нажатий клавиш для управления
    useEffect(() => {
        const handleKey = (e) => {
            const action = keyMap[e.code];
            if (action && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ action }));
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    // Рендер сетки
    return (
        <div className="bomberman-container">
            {gameState.grid.map((row, y) => (
                <div key={y} className="row">
                    {row.map((cell, x) => {
                        // Определяем присутствие объектов
                        const isPlayer = Object.values(gameState.players).find(p => p.x === x && p.y === y);
                        const isBomb = gameState.bombs.some(b => b.x === x && b.y === y);
                        const isFire = gameState.fire.some(f => f.x === x && f.y === y);
                        const classNames = ["cell"];

                        if (isFire) classNames.push("fire");
                        else if (isBomb) classNames.push("bomb");
                        else if (cell === "DESTRUCTIBLE") classNames.push("destructible");
                        else if (cell === "WALL") classNames.push("wall");
                        else classNames.push("empty");

                        return (
                            <div
                                key={x}
                                className={classNames.join(" ")}
                                style={{ width: TILE_SIZE, height: TILE_SIZE }}
                            >
                                {isPlayer && (
                                    <div
                                        className="player"
                                        style={{
                                            backgroundColor:
                                                lobby.players.find(p => p.id === isPlayer.id)?.color || "red"
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default BombermanGame;