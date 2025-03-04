import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import LobbySearch from "./pages/LobbySearch";
import GameLobby from "./pages/GameLobby";

const RouteLogger = () => {
    const location = useLocation();
    useEffect(() => {
        console.log("Current Route:", location.pathname);
    }, [location]);
    return null;
};

const App = () => {
    return (
        <Router>
            <RouteLogger /> {/* ✅ Логируем маршруты */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lobby-search" element={<LobbySearch />} />
                <Route path="/game-lobby" element={<GameLobby />} /> {/* ✅ Должен быть точно так же */}
            </Routes>
        </Router>
    );
};

export default App;
