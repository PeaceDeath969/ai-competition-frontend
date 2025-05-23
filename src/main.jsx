
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";


import "./index.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Router from "./router.jsx";
import useThemeStore from "./store/themeStore";
import useAuthStore from "./store/authStore";

const App = () => {
    const { theme } = useThemeStore();
    const { token, fetchMe } = useAuthStore();
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    useEffect(() => {
        if (token) {
            fetchMe();
        }
    }, [token, fetchMe]);

    return <Router />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
