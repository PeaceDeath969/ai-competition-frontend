import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GameLobby.css";

const GameLobby = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([
        { id: 1, name: "Игрок 1", avatar: "https://i.pravatar.cc/100?img=1", ready: false },
        { id: 2, name: "Игрок 2", avatar: "https://i.pravatar.cc/100?img=2", ready: false }
    ]);
    const [timer, setTimer] = useState(null); // Таймер перед началом игры

    const handleReady = (id) => {
        setPlayers((prev) =>
            prev.map((player) => (player.id === id ? { ...player, ready: true } : player))
        );
    };

    // ✅ Запуск таймера, когда все игроки готовы
    useEffect(() => {
        if (players.every((player) => player.ready)) {
            setTimer(5); // Таймер на 5 секунд перед стартом
        }
    }, [players]);

    // ✅ Обратный отсчёт и переход в игру
    useEffect(() => {
        if (timer !== null && timer > 0) {
            const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
            return () => clearTimeout(countdown);
        } else if (timer === 0) {
            console.log("➡ Переход в игру...");
            navigate("/game", { state: { players } }); // ✅ Передаём список игроков в `state`
        }
    }, [timer, navigate, players]);

    return (
        <div className="lobby-container">
            <h2 className="text-center mb-4">🏆 Лобби перед матчем</h2>

            <div className="players-list">
                {players.map((player) => (
                    <div key={player.id} className="player-card">
                        <img src={player.avatar} alt={player.name} className="player-avatar" />
                        <h5>{player.name}</h5>
                        {player.ready ? <span className="text-success">✅ Готов</span> : <span className="text-warning">⏳ Ожидает...</span>}
                        {!player.ready && (
                            <button className="btn btn-success" onClick={() => handleReady(player.id)}>Я готов</button>
                        )}
                    </div>
                ))}
            </div>

            {/* ✅ Таймер перед стартом игры */}
            {timer !== null && (
                <div className="timer mt-3">
                    <h4>⏳ Игра начнётся через: {timer} сек</h4>
                    <div className="progress">
                        <div className="progress-bar bg-primary" style={{ width: `${(timer / 5) * 100}%` }}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameLobby;
