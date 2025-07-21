import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiBell } from "react-icons/fi";
import { Notification } from "../../utils/types/EpiaTypes";

interface NotificationBellProps {
    open?: boolean;
    onToggle?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
    open,
    onToggle,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const modalOpen = !!open;
    const handleToggle = onToggle ? onToggle : () => {};

    // Substitua pela sua rota real

    // WebSocket URL - ajuste conforme necessário
    const WS_URL = "ws://localhost:3000/logs/notifications";
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        setLoading(true);
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            setLoading(false);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const logs = Array.isArray(data) ? data : [data];
            if (!logs || logs.length === 0) return;
            // Filtra apenas notificações válidas
            const validLogs = logs.filter(
                (n: any) =>
                    n &&
                    n.data &&
                    n.data.log &&
                    typeof n.data.message === "string"
            );
            if (validLogs.length === 0) return;
            setNotifications((prev) => {
                const merged = [...validLogs, ...prev];
                return merged.slice(0, 50);
            });

            // Exibe toast apenas se o modal estiver fechado (controle externo)
            console.log("open", open);

            validLogs.forEach((n: Notification) => {
                if (
                    n.data &&
                    n.data.log &&
                    n.data.log.allEpiCorrects === false
                ) {
                    toast.error(n.data.message, { position: "top-right" });
                }
            });
        };

        ws.onerror = () => {
            setLoading(false);
        };
        return () => {
            ws.close();
        };
    }, []);

    return (
        <div style={{ position: "fixed", top: 20, right: 30, zIndex: 1000 }}>
            <button
                onClick={handleToggle}
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                }}
                aria-label="Notificações"
            >
                <FiBell size={28} color="#333" />
                {notifications.some((n) => !n.data.log.notify) && (
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
                            onClick={handleToggle}
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
                                    key={n.data.log._id}
                                    style={{
                                        marginBottom: 12,
                                        padding: 10,
                                        background: n.data.log.notify
                                            ? "#f7f7f7"
                                            : "#e6f7ff",
                                        borderRadius: 6,
                                        border: n.data.log.notify
                                            ? "1px solid #eee"
                                            : "1px solid #91d5ff",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: n.data.log.notify
                                                ? 400
                                                : 600,
                                        }}
                                    >
                                        {n.data.message}
                                    </div>
                                    {n.data.log.createdAt && (
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "#888",
                                            }}
                                        >
                                            {new Date(
                                                n.data.log.createdAt
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
