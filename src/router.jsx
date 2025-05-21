import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import LobbySearch from "./pages/LobbySearch";
import GameLobby from "./pages/GameLobby";
import BombermanGame from "./pages/BombermanGame";
import useAuthStore from "./store/authStore";

const AppRoutes = () => {
    const { token } = useAuthStore();
    const location = useLocation();

    const hideNavbar = location.pathname === "/login";

    // Защищаем всё кроме логина
    if (!token && location.pathname !== "/login") {
        return <Navigate to="/login" replace />;
    }
    // Залогинен — не даём снова на логин
    if (token && location.pathname === "/login") {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/lobby-search" element={<LobbySearch />} />
                <Route path="/game-lobby" element={<GameLobby />} />
                <Route path="/game" element={<BombermanGame />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

const Router = () => (
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter>
);

export default Router;
