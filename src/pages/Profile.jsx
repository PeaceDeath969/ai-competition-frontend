import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import { useTranslation } from "react-i18next";
import "../i18n";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
    const { t, i18n } = useTranslation();
    const { user, login } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const defaultAvatar = "https://avatars.mds.yandex.net/i?id=2bbfe5cb7ce6fba0a6be87eb6f26d8d2_l-5113868-images-thumbs&n=13";

    const [formData, setFormData] = useState({
        name: user?.name || t("profile.name"),
        email: user?.email || "",
        avatar: user?.avatar || defaultAvatar,
    });

    const [imagePreview, setImagePreview] = useState(formData.avatar);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [passwordClass, setPasswordClass] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordColor, setPasswordColor] = useState("bg-danger");

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const compressImage = async (file) => {
        setLoading(true);
        try {
            const options = {
                maxSizeMB: 0.2,
                maxWidthOrHeight: 300,
                useWebWorker: true,
            };
            return await imageCompression(file, options);
        } catch (error) {
            console.error("Ошибка сжатия:", error);
            return file;
        } finally {
            setLoading(false);
        }
    };

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const compressedFile = await compressImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({ ...formData, avatar: reader.result });
            };
            reader.readAsDataURL(compressedFile);
        }
    };

    const handleRemoveAvatar = () => {
        setImagePreview(defaultAvatar);
        setFormData({ ...formData, avatar: defaultAvatar });
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
        multiple: false,
    });

    const handleSave = () => {
        login(formData);
        alert(t("profile.save_success"));
    };

    // Проверка сложности пароля
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length > 5) strength += 25;
        if (password.length > 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password) || /[@$!%*?&]/.test(password)) strength += 25;

        setPasswordStrength(strength);

        if (strength <= 25) {
            setPasswordColor("bg-danger");
        } else if (strength <= 50) {
            setPasswordColor("bg-warning");
        } else if (strength <= 75) {
            setPasswordColor("bg-info");
        } else {
            setPasswordColor("bg-success");
        }
    };

    const handleChangePassword = () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
            setMessage(t("profile.password_error"));
            setPasswordClass("error-animation");
            setTimeout(() => setPasswordClass(""), 1500);
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setMessage(t("profile.password_mismatch"));
            setPasswordClass("error-animation");
            setTimeout(() => setPasswordClass(""), 1500);
            return;
        }

        // Здесь можно добавить проверку текущего пароля через API

        setMessage(t("profile.password_success"));
        setPasswordClass("success-animation");
        setTimeout(() => setPasswordClass(""), 1500);

        setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        setPasswordStrength(0);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("language", lng);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="text-end mb-3">
                        <button className="btn btn-outline-primary me-2" onClick={() => changeLanguage("en")}>
                            🇬🇧 English
                        </button>
                        <button className="btn btn-outline-primary" onClick={() => changeLanguage("ru")}>
                            🇷🇺 Русский
                        </button>
                    </div>

                    <div className="card p-4 shadow">
                        <h2 className="text-center mb-3">{t("profile.title")}</h2>
                        <div className="text-center">
                            <div {...getRootProps()} className="dropzone">
                                <input {...getInputProps()} />
                                {loading ? (
                                    <div className="spinner-border text-primary mb-2" role="status"></div>
                                ) : (
                                    <img src={imagePreview} alt="Avatar" className="rounded-circle mb-2 avatar" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                                )}
                                <p className="text-muted">{t("profile.drag_drop")}</p>
                            </div>
                            <button className="btn btn-danger w-100" onClick={handleRemoveAvatar}>
                                {t("profile.delete_avatar")}
                            </button>
                        </div>
                        <button className="btn btn-primary w-100 mt-3" onClick={handleSave}>
                            {t("profile.save")}
                        </button>
                    </div>

                    <div className={`card p-4 shadow mt-4 ${passwordClass}`}>
                        <h4 className="text-center mb-3">{t("profile.password_change")}</h4>
                        {message && <div className="alert alert-info">{message}</div>}
                        <div className="mb-3">
                            <label className="form-label">{t("profile.current_password")}</label>
                            <input type="password" className="form-control"
                                   value={passwordData.currentPassword}
                                   onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">{t("profile.new_password")}</label>
                            <input type="password" className="form-control"
                                   value={passwordData.newPassword}
                                   onChange={(e) => {
                                       setPasswordData({ ...passwordData, newPassword: e.target.value });
                                       checkPasswordStrength(e.target.value);
                                   }}
                            />
                            {passwordData.newPassword && (
                                <div className="progress mt-2">
                                    <div className={`progress-bar ${passwordColor}`} role="progressbar" style={{ width: `${passwordStrength}%` }} />
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">{t("profile.confirm_password")}</label>
                            <input type="password" className="form-control"
                                   value={passwordData.confirmNewPassword}
                                   onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                            />
                        </div>
                        <button className="btn btn-warning w-100" onClick={handleChangePassword}>
                            {t("profile.change_password")}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <button className="btn btn-secondary" onClick={toggleTheme}>
                            {t("profile.theme_toggle")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
