import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import LobbySearch from "./pages/LobbySearch";
import GameLobby from "./pages/GameLobby";
import BombermanGame from "./pages/BombermanGame";
import ProtectedRoute from "./components/ProtectedRoute";

const Router = () => (
    <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/lobby-search" element={<LobbySearch />} />
            <Route path="/game-lobby" element={<GameLobby />} />
            <Route path="/game" element={<BombermanGame />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
        </Routes>
    </BrowserRouter>
);

export default Router;
