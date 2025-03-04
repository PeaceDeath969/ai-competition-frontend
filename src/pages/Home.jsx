import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import LobbySearch from "./LobbySearch";

const Home = () => {
    const [searching, setSearching] = useState(false);

    return (
        <div className="hero-container">
            <div className="hero-overlay"></div>

            <div className="container text-center hero-content">
                <h1 className="hero-title">🔥 AI Competition</h1>
                <p className="hero-subtitle">Соревнуйтесь в программировании искусственного интеллекта!</p>

                <div className="mt-4">
                    <button className="btn btn-primary btn-lg me-3" onClick={() => setSearching(true)}>
                        🚀 Начать игру
                    </button>
                    <Link to="/profile" className="btn btn-outline-light btn-lg">
                        🔍 Узнать больше
                    </Link>
                </div>
            </div>

            {/* Модальное окно поиска */}
            {searching && <LobbySearch onCancel={() => setSearching(false)} />}
        </div>
    );
};

export default Home;
