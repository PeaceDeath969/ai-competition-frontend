import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import LobbySearch from "./pages/LobbySearch";
import GameLobby from "./pages/GameLobby";
import BombermanGame from "./pages/BombermanGame";
import useAuthStore from "./store/authStore";

const Router = () => {
    const { token } = useAuthStore(); // ✅ Проверяем токен

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/lobby-search" element={<LobbySearch />} />
                <Route path="/game-lobby" element={<GameLobby />} />
                <Route path="/game" element={<BombermanGame />} />

                {/* ✅ Защищённые маршруты */}
                <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
                <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
