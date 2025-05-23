import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const body = {
                email,
                username,
                theme: "light",
                password,
            };
            await api.post("/register", body);
            navigate("/login", { state: { registered: true } });
        } catch (err) {
            console.error("Ошибка регистрации:", err);
            setError(
                err.response?.data?.detail ||
                "Не удалось зарегистрироваться. Проверьте данные."
            );
        }
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="card p-4 w-50">
                <h2 className="text-center mb-4">Регистрация</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Имя пользователя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Зарегистрироваться
                    </button>
                </form>
                <p className="mt-3 text-center">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
