import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const location = useLocation();
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        const result = await login(email, password);
        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="card p-4 w-50">
                <h2 className="text-center mb-4">Вход</h2>
                               {location.state?.registered && (
                                 <div className="alert alert-success">
                                       Регистрация прошла успешно! Войдите в аккаунт.
                                     </div>
                               )}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
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
                            type="password"
                            className="form-control"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Войти
                    </button>
                </form>
                               <p className="mt-3 text-center">
                                 Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                          </p>
            </div>
        </div>
    );
};

export default Login;
