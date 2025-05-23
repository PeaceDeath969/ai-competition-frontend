import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Home.css";

const Home = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [joinId, setJoinId] = useState("");
    const [error, setError] = useState("");

    const handleCreate = async () => {
        setError("");
        setLoading(true);
        try {
            const response = await api.post("/create_lobby");
            const lobby = response.data;
            navigate("/game-lobby", { state: { lobby } });
        } catch (e) {
            setError("Не удалось создать лобби");
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!joinId.trim()) {
            setError("Введите корректный ID игры");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const response = await api.post(`/join_lobby/${joinId}`);
            const lobby = response.data;
            navigate("/game-lobby", { state: { lobby } });
        } catch (e) {
            setError("Не удалось присоединиться к лобби");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hero-container">
            <div className="hero-overlay"></div>
            <div className="container text-center hero-content">
                <h1 className="hero-title">🔥 AI Competition</h1>
                <p className="hero-subtitle">Соревнуйтесь в программировании искусственного интеллекта!</p>

                {error && <div className="alert alert-danger mt-3">{error}</div>}

                <div className="mt-4">
                    <button
                        className="btn btn-primary btn-lg me-3"
                        onClick={handleCreate}
                        disabled={loading}
                    >
                        {loading ? "Пожалуйста, ждите…" : "🚀 Создать игру"}
                    </button>
                </div>

                <div className="mt-4">
                    <input
                        type="text"
                        className="form-control d-inline-block w-auto me-2"
                        placeholder="Введите ID игры"
                        value={joinId}
                        onChange={(e) => setJoinId(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        className="btn btn-success btn-lg"
                        onClick={handleJoin}
                        disabled={loading}
                    >
                        {loading ? "Пожалуйста, ждите…" : "🔗 Присоединиться"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
