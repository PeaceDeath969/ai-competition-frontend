import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LobbySearch.css";

const LobbySearch = () => {
    const [status, setStatus] = useState("searching");
    const [timer, setTimer] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("🔍 Начался поиск лобби...");

        const interval = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);

        // Через 5 секунд находим соперника и переходим в лобби
        const findOpponent = setTimeout(() => {
            console.log("🎉 Соперник найден!");
            setStatus("found");

            setTimeout(() => {
                console.log("➡ Переход в лобби...");
                navigate("/game-lobby");
            }, 2000);
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(findOpponent);
        };
    }, [navigate]);

    return (
        <div className="lobby-modal">
            <div className="lobby-content">
                {status === "searching" ? (
                    <>
                        <div className="loader"></div>
                        <h4 className="mt-3">🔍 Поиск лобби...</h4>
                        <p className="timer-text">⏳ Время ожидания: <strong>{timer} сек</strong></p>

                        <div className="progress mt-2">
                            <div
                                className="progress-bar bg-info"
                                role="progressbar"
                                style={{ width: `${(timer / 5) * 100}%` }}
                            ></div>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="text-success">🎉 Соперник найден!</h3>
                        <p>Переход в лобби...</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default LobbySearch;
