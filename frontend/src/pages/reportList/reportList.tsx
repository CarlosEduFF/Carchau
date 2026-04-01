import React, { useCallback, useEffect, useRef, useState } from "react";
import './reportList.css';
import reportService, { ChatRoom, Message } from "../../services/reportService";
import authService from "../../services/authService";

const DEFAULT_AVATAR = '/default-profile.png';
const FIXED_ID = "OdxeqUU7SDNbBDzhN4ETeP2h1jI3";

const ReportList: React.FC = () => {
    const [userId] = useState<string>(FIXED_ID);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [perfilImage, setPerfilImage] = useState<string | null>(null);
    const [nome, setNome] = useState<string | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Carregar salas de chat ao iniciar
    useEffect(() => {
        const loadRooms = async () => {
            setLoading(true);
            try {
                const rooms = await reportService.getRooms(userId);
                setChatRooms(rooms);
                if (rooms.length > 0 && !selectedChatId) {
                    handleSelectChatRoom(rooms[0]);
                }
            } catch (err) {
                console.error("Erro ao carregar salas:", err);
            } finally {
                setLoading(false);
            }
        };
        loadRooms();
    }, [userId]);

    // Carregar mensagens quando a sala mudar (Simulando "real-time" com fetch simples ao trocar)
    useEffect(() => {
        if (!selectedChatId) return;

        const loadMessages = async () => {
            try {
                const msgs = await reportService.getMessages(selectedChatId);
                setMessages(msgs);
            } catch (err) {
                console.error("Erro ao carregar mensagens:", err);
            }
        };
        loadMessages();
    }, [selectedChatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages]);

    const handleSelectChatRoom = async (room: ChatRoom) => {
        setSelectedChatId(room.chatId);
        setMessages([]);
        // Em um app real, buscaríamos os dados do 'otherId' via backend também
        setNome(room.displayName || "Usuário");
        setPerfilImage(room.avatar || DEFAULT_AVATAR);
    };

    const handleSend = useCallback(async () => {
        if (!selectedChatId || messageText.trim() === "") return;

        try {
            const newMessage: Partial<Message> = {
                text: messageText.trim(),
                user: { _id: userId, name: "Admin" }
            };
            await reportService.sendMessage(selectedChatId, newMessage);
            setMessageText("");
            
            // Recarregar mensagens após enviar
            const msgs = await reportService.getMessages(selectedChatId);
            setMessages(msgs);
        } catch (err) {
            console.error("Erro ao enviar mensagem:", err);
        }
    }, [selectedChatId, messageText, userId]);

    return (
        <div className="app">
            <div className="layout">
                <aside className="sidebar-report">
                    <div className="conversation-list">
                        {chatRooms.length === 0 ? (
                            <div className="empty">Nenhum chat encontrado</div>
                        ) : (
                            chatRooms.map((r) => (
                                <div
                                    key={r.chatId}
                                    className={`conversation-item ${selectedChatId === r.chatId ? "active" : ""}`}
                                    onClick={() => handleSelectChatRoom(r)}
                                >
                                    <div className="avatar size-10" style={{ backgroundImage: `url("${r.avatar || DEFAULT_AVATAR}")` }} />
                                    <h3>{r.displayName || r.chatId}</h3>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                <main className="chat-column">
                    <div className="chat-wrap" style={{ height: '600px' }}>
                        <header className="chat-header">
                            <div className="left">
                                <div className="avatar size-10" style={{ backgroundImage: `url("${perfilImage || DEFAULT_AVATAR}")` }} />
                                <h3 className="nome">{nome ?? "Selecione um chat"}</h3>
                            </div>
                        </header>

                        <section className="messages-area">
                            <div className="messages-grid">
                                {messages.map((m) => {
                                    const outgoing = m.user?._id === userId;
                                    return (
                                        <div key={m._id} className={outgoing ? "msg-out" : "msg-in"}>
                                            <div className={`msg-bubble ${outgoing ? "outgoing" : ""}`}>
                                                <div>{m.text}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </section>

                        <footer className="composer">
                            <input
                                type="text"
                                placeholder="Digite sua mensagem..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                            />
                            <button onClick={handleSend}>Enviar</button>
                        </footer>
                    </div>
                </main>
            </div>
            {loading && <div className="loading-overlay">Carregando...</div>}
        </div>
    );
}

export default ReportList;
