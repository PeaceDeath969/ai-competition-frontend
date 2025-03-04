import { useLocation } from "react-router-dom";
import { useState } from "react";
import "./BombermanGame.css";

const GRID_SIZE = 15;
const TILE_SIZE = 50;

const createGrid = () => {
    return Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) => {
            if (row % 2 === 1 && col % 2 === 1) return "wall"; // Непробиваемые стены
            return "empty";
        })
    );
};

const BombermanGame = () => {
    const location = useLocation();
    let players = location.state?.players || [];

    if (players.length > 0 && !players[0].x) {
        players = players.map((player, index) => ({
            ...player,
            x: index === 0 ? 0 : GRID_SIZE - 1, // Первый игрок - верхний левый угол, второй - нижний правый
            y: index === 0 ? 0 : GRID_SIZE - 1,
            color: index === 0 ? "red" : "blue" // Цвета для игроков
        }));
    }

    const [grid] = useState(createGrid());

    return (
        <div className="bomberman-container">
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, colIndex) => {
                        const player = players.find((p) => p.x === colIndex && p.y === rowIndex);
                        return (
                            <div key={colIndex} className={`cell ${cell}`} style={{ width: TILE_SIZE, height: TILE_SIZE }}>
                                {player && <div className="player" style={{ backgroundColor: player.color }} />}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default BombermanGame;
