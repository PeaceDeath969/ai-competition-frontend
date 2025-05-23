import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
    const { token, logout, user: storedUser, setUser, changePassword } = useAuthStore();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        avatar: "",
    });
    const [avatarPreview, setAvatarPreview] = useState("");
    const [message, setMessage] = useState("");

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordColor, setPasswordColor] = useState("bg-danger");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordClass, setPasswordClass] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/users/me");
                const profile = res.data;
                setFormData({
                    email: profile.email,
                    username: profile.username,
                    avatar: profile.avatar,
                });
                setAvatarPreview(profile.avatar);
                setUser(profile);
            } catch (err) {
                console.error("Ошибка загрузки профиля:", err);
            }
        };
        fetchProfile();
    }, [setUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setMessage("");
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await api.post("/uploadfile", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const path = res.data.original_file;
            const fullUrl = path.startsWith("http")
                ? path
                : `${api.defaults.baseURL.replace(/\/$/, "")}${path}`;
            setAvatarPreview(fullUrl);
            setFormData((p) => ({ ...p, avatar: fullUrl }));
        } catch (err) {
            console.error("Ошибка загрузки аватара:", err);
            setMessage("Не удалось загрузить аватарку");
        }
    };

    const handleSaveProfile = async () => {
        setMessage("");
        try {
            const payload = {
                email: formData.email,
                username: formData.username,
                avatar: formData.avatar,
            };
            const res = await api.put("/update_profile", payload);
            setUser(res.data);
            setMessage("Профиль успешно обновлён!");
        } catch (err) {
            console.error("Ошибка обновления профиля:", err);
            setMessage("Не удалось сохранить изменения");
        }
    };

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
                                style={{ width: 150, height: 150, objectFit: "cover" }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Аватарка</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={handleAvatarSelect}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Имя пользователя</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            className="btn btn-primary w-100 mb-4"
                            onClick={handleSaveProfile}
                        >
                            Сохранить профиль
                        </button>

                        <h4 className="text-center mb-3">🔐 Смена пароля</h4>
                        {passwordMessage && (
                            <div className={`alert alert-info ${passwordClass}`}>{passwordMessage}</div>
                        )}
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control mb-2"
                                placeholder="Текущий пароль"
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))
                                }
                            />
                            <input
                                type="password"
                                className="form-control mb-2"
                                placeholder="Новый пароль"
                                value={passwordData.newPassword}
                                onChange={(e) => {
                                    setPasswordData((p) => ({ ...p, newPassword: e.target.value }));
                                    checkPasswordStrength(e.target.value);
                                }}
                            />
                            {passwordData.newPassword && (
                                <div className="progress mt-2">
                                    <div
                                        className={`progress-bar ${passwordColor}`}
                                        role="progressbar"
                                        style={{ width: `${passwordStrength}%` }}
                                    />
                                </div>
                            )}
                            <input
                                type="password"
                                className="form-control mt-2"
                                placeholder="Подтвердите новый пароль"
                                value={passwordData.confirmNewPassword}
                                onChange={(e) =>
                                    setPasswordData((p) => ({ ...p, confirmNewPassword: e.target.value }))
                                }
                            />
                        </div>
                        <button
                            className="btn btn-warning w-100"
                            onClick={handlePasswordChange}
                        >
                            Изменить пароль
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;