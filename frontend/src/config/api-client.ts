import axios from "axios";

const api = axios.create({
    baseURL: "",
});

api.interceptors.request.use((config) => {
    const publicPaths = ["/api/accounts/register", "/api/auth/login"];
    const isPublicPath = publicPaths.includes(config.url || "");

    if (!isPublicPath) {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
    }

    return config;
});

export default api;