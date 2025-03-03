import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import Router from "./router.jsx";
import useThemeStore from "./store/themeStore";
import "./index.css";

const App = () => {
    const { theme } = useThemeStore();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return <Router />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
