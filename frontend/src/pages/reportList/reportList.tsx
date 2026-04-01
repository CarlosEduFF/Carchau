import React, { useCallback, useEffect, useRef, useState } from "react";
import './reportList.css';
import reportService, { ChatRoom, Message } from "../../services/reportService";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
const ADMIN_ID = "OdxeqUU7SDNbBDzhN4ETeP2h1jI3";

const ReportList: React.FC = () => {
    const [userId] = useState<string>(ADMIN_ID);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [sending, setSending] = useState<boolean>(false);
    
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Carregar salas de chat ao iniciar
    const loadRooms = useCallback(async (autoSelect = false) => {
        setLoading(true);
        try {
            const rooms = await reportService.getRooms(userId);
            setChatRooms(rooms);
            
            if (autoSelect && rooms.length > 0) {
                handleSelectChatRoom(rooms[0]);
            }
        } catch (err) {
            console.error("Erro ao carregar salas:", err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadRooms(true);
    }, [loadRooms]);

    // Carregar mensagens quando a sala mudar
    useEffect(() => {
        if (!selectedChat) return;

        const loadMessages = async () => {
            try {
                const msgs = await reportService.getMessages(selectedChat.chatId);
                setMessages(msgs);
            } catch (err) {
                console.error("Erro ao carregar mensagens:", err);
            }
        };
        loadMessages();
        
        // Polling simples a cada 5 segundos para simular real-time
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, [selectedChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSelectChatRoom = (room: ChatRoom) => {
        setSelectedChat(room);
        setMessages([]);
    };

    const handleSend = async () => {
        if (!selectedChat || !messageText.trim() || sending) return;

        setSending(true);
        try {
            const newMessage: Partial<Message> = {
                text: messageText.trim(),
                user: { _id: userId, name: "Admin Carchau" }
            };
            await reportService.sendMessage(selectedChat.chatId, newMessage);
            setMessageText("");
            
            // Recarregar imediatamente após enviar
            const msgs = await reportService.getMessages(selectedChat.chatId);
            setMessages(msgs);
        } catch (err) {
            console.error("Erro ao enviar mensagem:", err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="report-page">
            {loading && <LoadingOverlay message="Carregando denúncias..." />}
            
            <div className="report-container">
                {/* Sidebar com Lista de Conversas */}
                <aside className="report-sidebar">
                    <header className="sidebar-header">
                        <h2>Denúncias</h2>
                        <button className="icon-btn" onClick={() => loadRooms(false)}>
                            <span className="material-symbols-outlined">refresh</span>
                        </button>
                    </header>
                    
                    <div className="conversation-list">
                        {chatRooms.length === 0 && !loading ? (
                            <div className="empty-state">
                                <span className="material-symbols-outlined">chat_bubble_outline</span>
                                <p>Nenhuma denúncia encontrada</p>
                            </div>
                        ) : (
                            chatRooms.map((r) => (
                                <div
                                    key={r.chatId}
                                    className={`conversation-item ${selectedChat?.chatId === r.chatId ? "active" : ""}`}
                                    onClick={() => handleSelectChatRoom(r)}
                                >
                                    <div 
                                        className="avatar-chat" 
                                        style={{ backgroundImage: `url("${r.avatar || DEFAULT_AVATAR}")` }} 
                                    />
                                    <div className="conversation-info">
                                        <div className="conv-header">
                                            <span className="conv-name">{r.displayName || "Usuário"}</span>
                                            <span className="conv-time">
                                                {r.lastUpdated ? new Date(r.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                            </span>
                                        </div>
                                        <p className="last-msg">{r.lastMessage || "Sem mensagens ainda"}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                {/* Área de Chat */}
                <main className="chat-area">
                    {selectedChat ? (
                        <>
                            <header className="chat-top-bar">
                                <div className="user-info">
                                    <div 
                                        className="avatar-chat small" 
                                        style={{ backgroundImage: `url("${selectedChat.avatar || DEFAULT_AVATAR}")` }} 
                                    />
                                    <div>
                                        <h3 className="chat-name">{selectedChat.displayName}</h3>
                                        <span className="chat-status">Online</span>
                                    </div>
                                </div>
                                <div className="chat-actions">
                                    <button className="icon-btn"><span className="material-symbols-outlined">more_vert</span></button>
                                </div>
                            </header>

                            <section className="chat-messages">
                                <div className="msg-scroll">
                                    {messages.length === 0 ? (
                                        <div className="chat-empty">Inicie a conversa com este locatário.</div>
                                    ) : (
                                        messages.map((m) => {
                                            const isMe = m.user?._id === userId;
                                            return (
                                                <div key={m._id} className={`message-wrapper ${isMe ? "me" : "other"}`}>
                                                    <div className="message-bubble">
                                                        <p>{m.text}</p>
                                                        <span className="msg-time">
                                                            {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </section>

                            <footer className="chat-input-bar">
                                <input
                                    type="text"
                                    placeholder="Escreva sua resposta..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                                />
                                <button className="send-btn" onClick={handleSend} disabled={!messageText.trim() || sending}>
                                    <span className="material-symbols-outlined">send</span>
                                </button>
                            </footer>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <span className="material-symbols-outlined">forum</span>
                            <p>Selecione uma denúncia para visualizar a conversa</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default ReportList;
