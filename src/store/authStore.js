// src/store/authStore.js
import { create } from "zustand";
import api from "../api";
import qs from "qs";

const useAuthStore = create((set) => ({
    // Инициализация из localStorage
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,

    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },

    login: async (email, password) => {
        try {
            // Запрос токена
            const data = qs.stringify({
                grant_type: "password",
                username: email,
                password: password,
                scope: "",
                client_id: "",
                client_secret: "",
            });
            const response = await api.post("/token", data, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            const { access_token } = response.data;
            // Сохраняем токен
            localStorage.setItem("token", access_token);
            set({ token: access_token });

            // Получаем профиль пользователя
            const userResp = await api.get("/users/me");
            const profile = userResp.data;
            localStorage.setItem("user", JSON.stringify(profile));
            set({ user: profile });

            return { success: true };
        } catch (error) {
            console.error("❌ Ошибка входа:", error.response?.data || error.message);
            return { success: false, error: error.response?.data?.detail || "Ошибка входа" };
        }
    },

    logout: () => {
        console.log("🔴 Выход пользователя");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null });
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