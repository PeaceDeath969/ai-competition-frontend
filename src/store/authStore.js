import { create } from "zustand";
import api from "../api";
import qs from "qs";
import useThemeStore from "./themeStore";

const useAuthStore = create((set, get) => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },
    fetchMe: async () => {
        try {
            const { data } = await api.get("/users/me");
            set({ user: data });
            localStorage.setItem("user", JSON.stringify(data));
            const { setTheme } = useThemeStore.getState();
            if (data.theme) setTheme(data.theme);
            return data;
        } catch (err) {
            console.error("❌ Не удалось получить профиль:", err);
            return null;
        }
    },
    login: async (email, password) => {
        try {
            const form = qs.stringify({
                grant_type: "password",
                username: email,
                password: password,
            });
            const response = await api.post("/token", form, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            const { access_token } = response.data;
            localStorage.setItem("token", access_token);
            set({ token: access_token });
            await get().fetchMe();

            return { success: true };
        } catch (error) {
            console.error("❌ Ошибка входа:", error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.detail || "Ошибка входа",
            };
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
            const response = await api.put(
                `/change_password?old_password=${oldPassword}&new_password=${newPassword}`
            );
            console.log("✅ Пароль успешно изменён:", response.data);
            return { success: true, message: "Пароль успешно изменён!" };
        } catch (error) {
            console.error("❌ Ошибка смены пароля:", error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.detail || "Ошибка смены пароля",
            };
        }
    },
}));

export default useAuthStore;