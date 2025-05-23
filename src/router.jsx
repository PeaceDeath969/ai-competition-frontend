import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import LobbySearch from "./pages/LobbySearch";
import GameLobby from "./pages/GameLobby";
import BombermanGame from "./pages/BombermanGame";
import Instructions from "./pages/Instructions";
import ReplayViewer from "./pages/ReplayViewer";
import useAuthStore from "./store/authStore";

const AppRoutes = () => {
    const { token } = useAuthStore();
    const location = useLocation();

    const hideNavbar = ["/login", "/register"].includes(location.pathname);

    if (!token && location.pathname !== "/login" && location.pathname !== "/register") {
        return <Navigate to="/login" replace />;
    }
    if (token && location.pathname === "/login") {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/instructions" element={<Instructions />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/lobby-search" element={<LobbySearch />} />
                <Route path="/game-lobby" element={<GameLobby />} />
                <Route path="/game" element={<BombermanGame />} />
                <Route path="/replay/:matchId" element={<ReplayViewer />} />
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