import { create } from "zustand";
import api from "../api"; // Подключаем API
import qs from "qs"; // Кодирование для form-urlencoded

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,

    login: async (email, password) => {
        try {
            console.log("📤 Логин в API: /token", { email, password });

            const data = qs.stringify({
                grant_type: "password",
                username: email,
                password: password,
                scope: "",
                client_id: "",
                client_secret: "",
            });

            const response = await api.post("/token", data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            });

            console.log("✅ Ответ API:", response.data);

            const { access_token } = response.data;
            localStorage.setItem("token", access_token);
            set({ token: access_token });

            return { success: true };
        } catch (error) {
            console.error("❌ Ошибка входа:", error.response?.data || error.message);
            return { success: false, error: error.response?.data?.detail || "Ошибка входа" };
        }
    },

    logout: () => {
        console.log("🔴 Выход пользователя");
        localStorage.removeItem("token");
        set({ token: null });
    },

    changePassword: async (oldPassword, newPassword) => {
        try {
            console.log("📤 Запрос на смену пароля...");

            const response = await api.put(
                `/change_password?old_password=${oldPassword}&new_password=${newPassword}`
            );

            console.log("✅ Пароль успешно изменён:", response.data);
            return { success: true, message: "Пароль успешно изменён!" };
        } catch (error) {
            console.error("❌ Ошибка смены пароля:", error.response?.data || error.message);
            return { success: false, error: error.response?.data?.detail || "Ошибка смены пароля" };
        }
    },
}));

export default useAuthStore;
