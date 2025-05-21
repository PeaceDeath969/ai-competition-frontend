import axios from "axios";

const API_URL = "https://course.af.shvarev.com:443"; // Базовый URL вашего бэкенда

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Автоматически добавляем токен в заголовки запросов
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
