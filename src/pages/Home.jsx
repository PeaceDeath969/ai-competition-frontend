import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

const Home = () => {
    const [searching, setSearching] = useState(false);

    return (
        <div className="hero-container">
            <div className="hero-overlay"></div>

            <div className="container text-center hero-content">
                <h1 className="hero-title">🔥 AI Competition</h1>
                <p className="hero-subtitle">Соревнуйтесь в программировании искусственного интеллекта!</p>

                <div className="mt-4">
                    <Link to="/lobby-search" className="btn btn-primary btn-lg me-3">
                        🚀 Начать игру
                    </Link>
                    <Link to="/profile" className="btn btn-outline-light btn-lg">
                        🔍 Узнать больше
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
