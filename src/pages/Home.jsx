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
        const url = "/create_lobby";
        console.log(`[${new Date().toISOString()}] Request: POST ${api.defaults.baseURL}${url} body: { is_private: true }`);
        try {
            const response = await api.post(url, { is_private: true });
            console.log(
                `[${new Date().toISOString()}] Response ${response.status} POST ${api.defaults.baseURL}${url}:`,
                response.data
            );
            const lobby = response.data;
            navigate("/game-lobby", { state: { lobby } });
        } catch (e) {
            if (e.response) console.error(
                `[${new Date().toISOString()}] Error response ${e.response.status} POST ${api.defaults.baseURL}${url}:`,
                e.response.data
            );
            else console.error(
                `[${new Date().toISOString()}] Network or CORS error POST ${api.defaults.baseURL}${url}:`,
                e.message
            );
            setError("Не удалось создать лобби");
        } finally {
            setLoading(false);
        }
    };

    const handleQuickGame = async () => {
        setError("");
        setLoading(true);
        const url = "/quickgame";
        console.log(`[${new Date().toISOString()}] Request: POST ${api.defaults.baseURL}${url}`);
        try {
            const response = await api.post(url);
            console.log(
                `[${new Date().toISOString()}] Response ${response.status} POST ${api.defaults.baseURL}${url}:`,
                response.data
            );
            const lobby = response.data;
            navigate("/game-lobby", { state: { lobby } });
        } catch (e) {
            if (e.response) console.error(
                `[${new Date().toISOString()}] Error response ${e.response.status} POST ${api.defaults.baseURL}${url}:`,
                e.response.data
            );
            else console.error(
                `[${new Date().toISOString()}] Network or CORS error POST ${api.defaults.baseURL}${url}:`,
                e.message
            );
            setError("Не удалось выполнить быстрый подбор игры");
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
        const url = `/join_lobby/${joinId}`;
        console.log(`[${new Date().toISOString()}] Request: POST ${api.defaults.baseURL}${url}`);
        try {
            const response = await api.post(url);
            console.log(
                `[${new Date().toISOString()}] Response ${response.status} POST ${api.defaults.baseURL}${url}:`,
                response.data
            );
            const lobby = response.data;
            navigate("/game-lobby", { state: { lobby } });
        } catch (e) {
            if (e.response) console.error(
                `[${new Date().toISOString()}] Error response ${e.response.status} POST ${api.defaults.baseURL}${url}:`,
                e.response.data
            );
            else console.error(
                `[${new Date().toISOString()}] Network or CORS error POST ${api.defaults.baseURL}${url}:`,
                e.message
            );
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

                <div className="mt-4 d-flex justify-content-center gap-3">
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleCreate}
                        disabled={loading}
                    >
                        {loading ? "Пожалуйста, ждите…" : "🚀 Создать игру"}
                    </button>
                    <button
                        className="btn btn-warning btn-lg"
                        onClick={handleQuickGame}
                        disabled={loading}
                    >
                        {loading ? "Пожалуйста, ждите…" : "⚡ Быстрая игра"}
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
