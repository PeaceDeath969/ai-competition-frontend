import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
    const { token, logout } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const navigate = useNavigate();
    if (!token) return null;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">AI Competition</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle nav"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/">Главная</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Статистика</Link>
                        </li>

                        <li className="nav-item dropdown">
                            <button
                                className="nav-link dropdown-toggle btn btn-link"
                                type="button"
                                id="profileDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Профиль
                            </button>
                            <ul
                                className="dropdown-menu dropdown-menu-end"
                                aria-labelledby="profileDropdown"
                            >
                                <li>
                                    <Link className="dropdown-item" to="/profile">
                                        Редактировать профиль
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={handleLogout}
                                    >
                                        Выйти
                                    </button>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item ms-3">
                            <button className="btn btn-secondary" onClick={toggleTheme}>
                                {theme === "light" ? "🌙 Темная тема" : "☀️ Светлая тема"}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
