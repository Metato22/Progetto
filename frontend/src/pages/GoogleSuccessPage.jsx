import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useAuth } from "../auth/useAuth";

export default function GoogleSuccessPage() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const refreshRes = await axios.post("/auth/refresh", null, {
                    withCredentials: true,
                });

                const accessToken = refreshRes?.data?.accessToken;
                if (!accessToken) throw new Error("Nessun accessToken");

                const userRes = await axios.get("/user/me", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                const userData = userRes.data;

                if (userData) {
                    login(userData, accessToken);
                    nav("/");
                } else {
                    nav("/login");
                }
            } catch (err) {
                console.error("Errore Google login success:", err);
                nav("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [login, nav]);

    if (loading) return <p>Accesso in corso con Google...</p>;

    return null;
}