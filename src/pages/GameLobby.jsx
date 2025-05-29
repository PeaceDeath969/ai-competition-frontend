import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GameLobby.css";

const POLL_INTERVAL = 3000;

const GameLobby = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { lobby } = location.state || {};

    useEffect(() => {
        if (!lobby) navigate("/");
    }, [lobby, navigate]);

    const [players, setPlayers] = useState(lobby?.players || []);
    const gameId = lobby?.game_id;

    useEffect(() => {
        if (!gameId) return;

        const fetchLobby = async () => {
            try {
                const { data } = await api.post(`/join_lobby/${gameId}`);
                setPlayers(data.players);
                console.log("Players:", data.players);
            } catch {
                // handle errors silently
            }
        };

        fetchLobby();
        const intervalId = setInterval(fetchLobby, POLL_INTERVAL);
        return () => clearInterval(intervalId);
    }, [gameId]);

    return (
        <div className="lobby-container">
            <h2 className="text-center mb-4">🏆 Лобби перед матчем</h2>
            <div className="alert alert-info text-center">
                Пригласительный код:
                <div className="mt-2">
                    <code>{gameId}</code>
                </div>
            </div>
            <div className="players-list">
                {players.length > 0 ? (
                    players.map((id) => (
                        <div key={id} className="player-card">
                            <div className="player-avatar-placeholder">{id}</div>
                            <h5>Игрок ID: {id}</h5>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">Ожидаем игроков...</p>
                )}
            </div>
            <div className="mt-4 text-center">
                <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>
                    Назад
                </button>
                <button
                    className="btn btn-primary"
                    disabled={players.length < 2}
                    onClick={() =>
                        navigate("/game", { state: { lobby: { ...lobby, players } } })
                    }
                >
                    Начать игру
                </button>
            </div>
        </div>
    );
};

export default GameLobby;
