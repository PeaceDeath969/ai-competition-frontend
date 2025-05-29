import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import api from "../api";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";

const Dashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { theme } = useThemeStore();

    const [stats, setStats] = useState({
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winrate: 0,
        rating: 0,
        ratingHistory: [],
    });

    const [replays, setReplays] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        if (!user?.id) return;

        setStats((prev) => ({
            ...prev,
            gamesPlayed: user.games_played,
            rating: user.rating,
        }));

        api
            .get("/users/me/matches", { params: { skip: 0, limit: 100000 } })
            .then(({ data: matches }) => {
                const wins = matches.filter((m) => m.winner_id === user.id).length;
                const losses = matches.filter((m) => m.loser_id === user.id).length;
                const draws = matches.filter((m) => m.result === "draw").length;
                const total = matches.length;
                const winrate = total ? Math.round((wins * 100) / total) : 0;

                const sortedAsc = [...matches].sort((a, b) => a.id - b.id);
                const eloChanges = sortedAsc.map((m) =>
                    m.winner_id === user.id ? m.winner_elo_change : m.loser_elo_change
                );
                const totalDelta = eloChanges.reduce((sum, d) => sum + d, 0);
                const initialRating = user.rating - totalDelta;
                const ratingHistory = eloChanges.reduce(
                    (hist, delta) => [...hist, hist[hist.length - 1] + delta],
                    [initialRating]
                );

                setStats({
                    gamesPlayed: user.games_played,
                    rating: user.rating,
                    wins,
                    losses,
                    draws,
                    winrate,
                    ratingHistory,
                });

                const sortedDesc = [...sortedAsc].reverse();
                Promise.all(
                    sortedDesc.map((m) =>
                        api
                            .get(`/replays/match/${m.id}`)
                            .then((res) => res.data.created_at)
                            .catch(() => "")
                    )
                ).then((dates) => {
                    setReplays(
                        sortedDesc.map((m, idx) => ({
                            id: m.id,
                            opponent:
                                m.winner_id === user.id ? m.loser_id : m.winner_id,
                            date: dates[idx]
                                ? new Date(dates[idx]).toLocaleString()
                                : "",
                            result:
                                m.result === "draw"
                                    ? "draw"
                                    : m.winner_id === user.id
                                        ? "win"
                                        : "loss",
                        }))
                    );
                });
            })
            .catch((err) => {
                console.error("❌ Не удалось загрузить матчи:", err);
            });
    }, [user]);

    const filteredReplays = replays.filter(
        (match) => filter === "all" || match.result === filter
    );

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">📊 Личная статистика</h2>

            <div className="row">
                <div className="col-md-3">
                    <div className="card text-center p-3 shadow">
                        <h5>🎮 Сыграно игр</h5>
                        <h3>{stats.gamesPlayed}</h3>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-3 shadow">
                        <h5>🏆 Побед</h5>
                        <h3 className="text-success">{stats.wins}</h3>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-3 shadow">
                        <h5>❌ Поражений</h5>
                        <h3 className="text-danger">{stats.losses}</h3>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-3 shadow">
                        <h5>🤝 Ничьих</h5>
                        <h3 className="text-secondary">{stats.draws}</h3>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card text-center p-3 shadow">
                        <h5>📈 Рейтинг</h5>
                        <h3>{stats.rating} Elo</h3>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card text-center p-3 shadow">
                        <h5>⚡ Winrate</h5>
                        <h3>{stats.winrate}%</h3>
                        <div className="progress">
                            <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${stats.winrate}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card p-4 mt-4 shadow">
                <h5 className="text-center">📊 Динамика рейтинга</h5>
                <Line
                    data={{
                        labels: stats.ratingHistory.map((_, i) => `Матч ${i}`),
                        datasets: [
                            {
                                label: "Рейтинг Elo",
                                data: stats.ratingHistory,
                                fill: false,
                                tension: 0.4,
                            },
                        ],
                    }}
                />
            </div>

            <div className="card p-4 mt-4 shadow">
                <h5 className="text-center">🎥 Реплеи матчей</h5>

                <div className="text-center mb-3">
                    <button className="btn btn-outline-primary me-2" onClick={() => setFilter("all") }>
                        Все
                    </button>
                    <button className="btn btn-outline-success me-2" onClick={() => setFilter("win") }>
                        Победы
                    </button>
                    <button className="btn btn-outline-danger me-2" onClick={() => setFilter("loss") }>
                        Поражения
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => setFilter("draw") }>
                        Ничьи
                    </button>
                </div>

                <table className={`table table-striped ${theme === "dark" ? "table-dark" : "table-light"} replays-table`}>
                    <thead>
                    <tr>
                        <th>🆔</th>
                        <th>👾 Соперник</th>
                        <th>📅 Дата</th>
                        <th>🏆 Результат</th>
                        <th>🎥 Реплей</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredReplays.map((match) => (
                        <tr key={match.id}>
                            <td className={theme === "dark" ? "text-white" : "text-dark"}>{match.id}</td>
                            <td className={theme === "dark" ? "text-white" : "text-dark"}>{match.opponent}</td>
                            <td className={theme === "dark" ? "text-white" : "text-dark"}>{match.date}</td>
                            <td
                                className={
                                    match.result === "win"
                                        ? "text-success"
                                        : match.result === "loss"
                                            ? "text-danger"
                                            : "text-secondary"
                                }
                            >
                                {match.result === "win"
                                    ? "Победа"
                                    : match.result === "loss"
                                        ? "Поражение"
                                        : "Ничья"}
                            </td>
                            <td>
                                <button className="btn btn-sm btn-primary" onClick={() => navigate(`/replay/${match.id}`)}>
                                    🔍
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;