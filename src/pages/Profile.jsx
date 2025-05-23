// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
    const { token, logout, user: storedUser, setUser, changePassword } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        avatar: "",
        theme: "",
    });
    const [avatarPreview, setAvatarPreview] = useState("");
    const [message, setMessage] = useState("");

    // Состояние для смены пароля
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordColor, setPasswordColor] = useState("bg-danger");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordClass, setPasswordClass] = useState("");

    // Загрузка данных профиля
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/users/me");
                const profile = response.data;
                setFormData({
                    email: profile.email,
                    username: profile.username,
                    avatar: profile.avatar,
                    theme: profile.theme || theme,
                });
                setAvatarPreview(profile.avatar);
                setUser(profile);
            } catch (error) {
                console.error("Ошибка загрузки профиля:", error);
            }
        };
        fetchProfile();
    }, [theme, setUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "theme") toggleTheme();
    };

    const handleAvatarSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                setFormData((prev) => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Сохранение профиля: обновлённый URL
    const handleSaveProfile = async () => {
        setMessage("");
        try {
            const payload = {
                email: formData.email,
                username: formData.username,
                avatar: formData.avatar,
                theme: formData.theme,
            };
            const response = await api.put("/update_profile", payload);
            setMessage("Профиль успешно обновлён!");
            setUser(response.data);
        } catch (error) {
            console.error("Ошибка обновления профиля:", error);
            setMessage("Не удалось сохранить изменения");
        }
    };

    // Проверка сложности пароля
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length > 5) strength += 25;
        if (password.length > 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password) || /[@$!%*?&]/.test(password)) strength += 25;
        setPasswordStrength(strength);
        if (strength <= 25) setPasswordColor("bg-danger");
        else if (strength <= 50) setPasswordColor("bg-warning");
        else if (strength <= 75) setPasswordColor("bg-info");
        else setPasswordColor("bg-success");
    };

    const handlePasswordChange = async () => {
        setPasswordMessage("");
        setPasswordClass("");
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
            setPasswordMessage("Введите все поля");
            setPasswordClass("error-animation");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordMessage("Пароли не совпадают");
            setPasswordClass("error-animation");
            return;
        }
        const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
        if (result.success) {
            setPasswordMessage("Пароль успешно изменён!");
            setPasswordClass("success-animation");
            setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
            setPasswordStrength(0);
        } else {
            setPasswordMessage(result.error || "Ошибка смены пароля");
            setPasswordClass("error-animation");
        }
    };

    if (!token) return null;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Мой профиль</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4 shadow">
                        <div className="text-center mb-3">
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="rounded-circle avatar"
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />
                        </div>

                        {/* Поля профиля */}
                        <div className="mb-3">
                            <label className="form-label">Аватарка</label>
                            <input type="file" accept="image/*" className="form-control" onChange={handleAvatarSelect} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Имя пользователя</label>
                            <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Тема</label>
                            <select name="theme" className="form-select" value={formData.theme} onChange={handleChange}>
                                <option value="light">Светлая</option>
                                <option value="dark">Тёмная</option>
                            </select>
                        </div>
                        <button className="btn btn-primary w-100 mb-4" onClick={handleSaveProfile}>
                            Сохранить профиль
                        </button>

                        {/* Смена пароля */}
                        <h4 className="text-center mb-3">🔐 Смена пароля</h4>
                        {passwordMessage && <div className={`alert alert-info ${passwordClass}`}>{passwordMessage}</div>}
                        <div className="mb-3">
                            <input type="password" className="form-control" placeholder="Текущий пароль" value={passwordData.currentPassword} onChange={e => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" placeholder="Новый пароль" value={passwordData.newPassword} onChange={e => { setPasswordData(prev => ({ ...prev, newPassword: e.target.value })); checkPasswordStrength(e.target.value); }} />
                            {passwordData.newPassword && (
                                <div className="progress mt-2">
                                    <div className={`progress-bar ${passwordColor}`} role="progressbar" style={{ width: `${passwordStrength}%` }} />
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" placeholder="Подтвердите новый пароль" value={passwordData.confirmNewPassword} onChange={e => setPasswordData(prev => ({ ...prev, confirmNewPassword: e.target.value }))} />
                        </div>
                        <button className="btn btn-warning w-100" onClick={handlePasswordChange}>
                            Изменить пароль
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;