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
    const [timer, setTimer] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");

    const handleReady = (id) => {
        setPlayers((prev) =>
            prev.map((player) => (player.id === id ? { ...player, ready: true } : player))
        );
    };

    useEffect(() => {
        if (players.every((player) => player.ready)) {
            setTimer(5); // Стартуем таймер на 5 секунд
        }
    }, [players]);

    useEffect(() => {
        if (timer !== null && timer > 0) {
            const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
            return () => clearTimeout(countdown);
        } else if (timer === 0) {
            navigate("/game");
        }
    }, [timer, navigate]);

    // Чат в лобби
    const sendMessage = () => {
        if (message.trim() !== "") {
            setChatMessages([...chatMessages, { sender: "Вы", text: message }]);
            setMessage("");
        }
    };

    return (
        <div className="lobby-container">
            <h2 className="text-center mb-4">🏆 Лобби перед матчем</h2>

            {/* Игроки в лобби */}
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

            {timer !== null && (
                <div className="timer mt-3">
                    <h4>⏳ Игра начнётся через: {timer} сек</h4>
                    <div className="progress">
                        <div className="progress-bar bg-primary" style={{ width: `${(timer / 5) * 100}%` }}></div>
                    </div>
                </div>
            )}

            <div className="chat-box mt-4">
                <h5>💬 Чат</h5>
                <div className="chat-messages">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className="chat-message">
                            <strong>{msg.sender}: </strong>{msg.text}
                        </div>
                    ))}
                </div>
                <div className="chat-input mt-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Введите сообщение..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button className="btn btn-primary mt-2" onClick={sendMessage}>Отправить</button>
                </div>
            </div>
        </div>
    );
};

export default GameLobby;
