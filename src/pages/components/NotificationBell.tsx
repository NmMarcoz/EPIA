import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiBell } from "react-icons/fi";
import * as epiaProvider from "../../infra/providers/EpiaServerProvider";

interface Notification {
    id: number;
    message: string;
    consumed: boolean;
    createdAt?: string;
}

const NotificationBell: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Substitua pela sua rota real

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await epiaProvider.getNotifications();
            setNotifications(res);
            // Exibe toast para notificações não consumidas
            res.forEach((n: Notification) => {
                if (!n.consumed) {
                    toast.info(n.message, { position: "top-right" });
                }
            });
        } catch (e) {
            // erro silencioso
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: "fixed", top: 20, right: 30, zIndex: 1000 }}>
            <ToastContainer />
            <button
                onClick={() => setModalOpen(!modalOpen)}
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                }}
                aria-label="Notificações"
            >
                <FiBell size={28} color="#333" />
                {notifications.some((n) => !n.consumed) && (
                    <span
                        style={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            background: "red",
                            borderRadius: "50%",
                            width: 12,
                            height: 12,
                            display: "inline-block",
                        }}
                    ></span>
                )}
            </button>
            {modalOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 60,
                        right: 30,
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        width: 320,
                        maxHeight: 400,
                        overflowY: "auto",
                        zIndex: 1100,
                    }}
                >
                    <div
                        style={{
                            padding: 16,
                            borderBottom: "1px solid #eee",
                            fontWeight: 600,
                        }}
                    >
                        Notificações
                        <button
                            onClick={() => setModalOpen(false)}
                            style={{
                                float: "right",
                                background: "none",
                                border: "none",
                                fontSize: 18,
                                cursor: "pointer",
                            }}
                            aria-label="Fechar"
                        >
                            ×
                        </button>
                    </div>
                    <div style={{ padding: 16 }}>
                        {loading ? (
                            <div>Carregando...</div>
                        ) : notifications.length === 0 ? (
                            <div>Nenhuma notificação.</div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    style={{
                                        marginBottom: 12,
                                        padding: 10,
                                        background: n.consumed
                                            ? "#f7f7f7"
                                            : "#e6f7ff",
                                        borderRadius: 6,
                                        border: n.consumed
                                            ? "1px solid #eee"
                                            : "1px solid #91d5ff",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: n.consumed ? 400 : 600,
                                        }}
                                    >
                                        {n.message}
                                    </div>
                                    {n.createdAt && (
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "#888",
                                            }}
                                        >
                                            {new Date(
                                                n.createdAt
                                            ).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
