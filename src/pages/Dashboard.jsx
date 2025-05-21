import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
    const [stats, setStats] = useState({
        gamesPlayed: 50,
        wins: 30,
        losses: 20,
        winrate: 60,
        rating: 1450,
        ratingHistory: [1200, 1250, 1300, 1350, 1400, 1450],
    });

    const [replays, setReplays] = useState([
        { id: 1, opponent: "AI_Bot_1", date: "2024-03-01", result: "win", replayUrl: "/replays/match1.json" },
        { id: 2, opponent: "AI_Bot_2", date: "2024-03-02", result: "loss", replayUrl: "/replays/match2.json" },
        { id: 3, opponent: "AI_Bot_3", date: "2024-03-05", result: "win", replayUrl: "/replays/match3.json" },
    ]);

    const [filter, setFilter] = useState("all");

    useEffect(() => {
    }, []);

    // Фильтрация матчей
    const filteredReplays = replays.filter(match => filter === "all" || match.result === filter);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">📊 Личная статистика</h2>

            {/* Карточки статистики */}
            <div className="row">
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow">
                        <h5>🎮 Сыграно игр</h5>
                        <h3>{stats.gamesPlayed}</h3>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow">
                        <h5>🏆 Побед</h5>
                        <h3 className="text-success">{stats.wins}</h3>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow">
                        <h5>❌ Поражений</h5>
                        <h3 className="text-danger">{stats.losses}</h3>
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
                        labels: ["1 неделя", "2 неделя", "3 неделя", "4 неделя", "5 неделя", "Сейчас"],
                        datasets: [
                            {
                                label: "Рейтинг Elo",
                                data: stats.ratingHistory,
                                fill: false,
                                borderColor: "#4caf50",
                                tension: 0.4,
                            },
                        ],
                    }}
                />
            </div>

            {/* Реплеи матчей */}
            <div className="card p-4 mt-4 shadow">
                <h5 className="text-center">🎥 Реплеи матчей</h5>

                {/* Фильтр матчей */}
                <div className="text-center mb-3">
                    <button className="btn btn-outline-primary me-2" onClick={() => setFilter("all")}>
                        Все матчи
                    </button>
                    <button className="btn btn-outline-success me-2" onClick={() => setFilter("win")}>
                        Победы
                    </button>
                    <button className="btn btn-outline-danger" onClick={() => setFilter("loss")}>
                        Поражения
                    </button>
                </div>

                {/* Таблица матчей */}
                <table className="table table-striped">
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
                            <td>{match.id}</td>
                            <td>{match.opponent}</td>
                            <td>{match.date}</td>
                            <td className={match.result === "win" ? "text-success" : "text-danger"}>
                                {match.result === "win" ? "Победа" : "Поражение"}
                            </td>
                            <td>
                                <button className="btn btn-sm btn-primary">
                                    🔍 Просмотр
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
