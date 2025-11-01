// src/components/reportList/ReportList.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import './reportList.css';
import { ChatRoom, Message } from "../../types/Message";
import { GetMessage } from "../../services/chat/GetMessage";
import { sendMessageToChat } from "../../services/chat/SendMessage";
import { loadChatUserData } from "../../services/chat/LoadChatUserData";
import { ChatRoomSummary, subscribeChatRoomsForFixedUser } from "../../services/reportChat";

const DEFAULT_AVATAR = '/default-profile.png'; // ajuste conforme seu projeto
const FIXED_ID = "OdxeqUU7SDNbBDzhN4ETeP2h1jI3";

const ReportList: React.FC = () => {
    const [locadorId] = useState<string>(FIXED_ID);
    const [locatarioId, setLocatarioId] = useState<string>("");
    const [perfilImage, setPerfilImage] = useState<string | null>(null);
    const [nome, setNome] = useState<string | null>(null);

    const [UserImage, setUserImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const params = new URLSearchParams(window.location.search);
    const ContatoIdParam = params.get("id");
    const ContatoId = ContatoIdParam ? (ContatoIdParam.split(",")[0] ?? ContatoIdParam) : null;

    // Observação: definimos userId inicial como locadorId (usuário logado)
    const [userId, setUserId] = useState<string | undefined>(locadorId);
    const [recipientId, setRecipientId] = useState<string | undefined>(undefined);
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [messageText, setMessageText] = useState<string>("");
    const previousContactId = useRef<string | null>(null);

    // Mensagens em tempo real (quando userId ou recipientId mudam)
    useEffect(() => {
        // limpa mensagens imediatamente ao trocar de contato (evita mostrar mensagens do chat anterior)
        setMessages([]);

        if (!userId || !recipientId) {
            // nada para ouvir agora
            return;
        }

        let unsubscribeFn: (() => void) | null = null;
        let didCancel = false;

        try {
            const maybeUnsub = GetMessage({
                userId,
                recipientId,
                onMessagesUpdate: (msgs: Message[]) => {
                    if (!didCancel) setMessages(msgs);
                },
                flatListRef: undefined,
            });

            // se GetMessage retornou direto a função de unsubscribe:
            if (typeof maybeUnsub === "function") {
                unsubscribeFn = maybeUnsub as () => void;
            } else if (maybeUnsub && typeof (maybeUnsub as any).then === "function") {
                // se retornou uma Promise que resolve para a função de unsubscribe
                (maybeUnsub as Promise<any>).then((res) => {
                    if (typeof res === "function") unsubscribeFn = res;
                }).catch((err) => {
                    console.error("GetMessage promise rejeitada:", err);
                });
            } else {
                // se não retornou unsubscribe claramente, log para debug
                console.warn("GetMessage não retornou função de unsubscribe diretamente.", maybeUnsub);
            }
        } catch (err) {
            console.error("Erro ao inicializar GetMessage:", err);
        }

        return () => {
            didCancel = true;
            if (typeof unsubscribeFn === "function") {
                try { unsubscribeFn(); } catch (e) { console.warn("Erro ao chamar unsubscribe:", e); }
            }
        };
    }, [userId, recipientId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages]);

    const handleSend = useCallback(async () => {
        if (!userId || !recipientId || messageText.trim() === "") return;

        await sendMessageToChat({
            userId,
            recipientId,
            text: messageText.trim(),
            nome: nome ?? "Usuário",
        });

        setMessageText("");
    }, [userId, recipientId, messageText, nome]);

    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const selectedChat = chatRooms.find(r => r.chatId === selectedChatId);

    // Função que carrega preview (nome/avatar) para uma room e atualiza o state
    const loadPreviewForRoom = useCallback((room: ChatRoomSummary) => {
        loadChatUserData({
            locadorId,
            locatarioId,
            ContatoId: null,
            userId: undefined,
            setUserId: () => { /* noop */ },
            recipientId: room.otherId,
            setRecipientId: () => { /* noop */ },
            setNome: (name: string) => {
                setChatRooms(prev => prev.map(r => r.chatId === room.chatId ? { ...r, displayName: name } : r));
            },
            setPerfilImage: (avatar: string | null) => {
                setChatRooms(prev => prev.map(r => r.chatId === room.chatId ? { ...r, avatar } : r));
            },
            setUserImage: () => { /* noop */ },
            setLoading: () => { /* noop */ },
            previousContactId,
        });
    }, [locadorId, locatarioId, previousContactId]);

    // Subscreve as chat rooms do usuário fixo e auto-carrega previews
    useEffect(() => {
        const unsub = subscribeChatRoomsForFixedUser(FIXED_ID, (rooms) => {
            setChatRooms(rooms);

            // auto-seleciona a primeira sala se não houver seleção
            if (!selectedChatId && rooms.length > 0) {
                const firstRoom = rooms[0];
                setSelectedChatId(firstRoom.chatId);

                if (firstRoom.otherId) {
                    setRecipientId(firstRoom.otherId);
                }

                // carrega dados do usuário selecionado para a área de chat
                loadChatUserData({
                    locadorId,
                    locatarioId,
                    ContatoId: null,
                    userId,
                    setUserId,
                    recipientId: firstRoom.otherId,
                    setRecipientId,
                    setNome: (name) => setNome(name),
                    setPerfilImage: (avatar) => setPerfilImage(avatar),
                    setUserImage,
                    setLoading,
                    previousContactId,
                });
            }

            // para cada sala, faz um preload do nome/avatar (atualiza chatRooms quando chega)
            rooms.forEach(room => {
                if (!room.displayName || !room.avatar) {
                    loadPreviewForRoom(room);
                }
            });
        });

        return () => {
            if (typeof unsub === "function") unsub();
        };
    }, [
        loadPreviewForRoom,
        selectedChatId,
        userId,
        setUserId,
        setUserImage,
        locadorId,
        locatarioId,
        setPerfilImage,
        setNome,
        setLoading,
        previousContactId,
    ]);

    const handleSelectChatRoom = useCallback(
        (room: ChatRoomSummary) => {
            // limpa e seleciona imediatamente para forçar atualização do listener
            setSelectedChatId(room.chatId);
            setMessages([]); // evita mostrar mensagens antigas
            if (room.otherId) {
                setRecipientId(room.otherId); // define recipientId antes do loadChatUserData
            }

            // carrega dados da sala selecionada (nome, foto, userId etc)
            loadChatUserData({
                locadorId,
                locatarioId,
                ContatoId: null,
                userId,
                setUserId,
                recipientId: room.otherId,
                setRecipientId,
                setNome: (name) => {
                    setChatRooms((prev) =>
                        prev.map((r) =>
                            r.chatId === room.chatId ? { ...r, displayName: name } : r
                        )
                    );
                    setNome(name);
                },
                setPerfilImage: (avatar) => {
                    setChatRooms((prev) =>
                        prev.map((r) =>
                            r.chatId === room.chatId ? { ...r, avatar } : r
                        )
                    );
                    setPerfilImage(avatar);
                },
                setUserImage,
                setLoading,
                previousContactId,
            });
        },
        [
            locadorId,
            locatarioId,
            userId,
            setUserId,
            setRecipientId,
            setUserImage,
            setLoading,
            previousContactId,
        ]
    );

    return (
        <div className="app">
            <div className="layout">
                {/* Sidebar (chatRooms) */}
                <aside className="sidebar">
                    <div className="conversation-list">
                        {chatRooms.length === 0 ? (
                            <div className="empty">Nenhum chat encontrado</div>
                        ) : (
                            chatRooms.map((r) => {
                                const isActive = selectedChatId === r.chatId;
                                const avatarUrl = r.avatar || DEFAULT_AVATAR;
                                const displayName = r.displayName || "Carregando...";
                                return (
                                    <div
                                        key={r.chatId}
                                        className={`conversation-item ${isActive ? "active" : ""}`}
                                        onClick={() => handleSelectChatRoom(r)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleSelectChatRoom(r); }}
                                    >
                                        <div
                                            className="avatar size-10"
                                            style={{ backgroundImage: `url("${avatarUrl}")` }}
                                            aria-hidden
                                        />
                                        <h2>{displayName}</h2>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </aside>

                {/* Chat area */}
                <main className="chat-column">
                    <div className="chat-wrap">
                        <header className="chat-header">
                            <div className="left">
                                <div className="avatar-wrapper">
                                    <div
                                        className="avatar size-10"
                                        style={{ backgroundImage: `url("${perfilImage || DEFAULT_AVATAR}")` }}
                                    />
                                    <span className="status-dot" style={{ width: 10, height: 10 }} />
                                </div>
                                <div>
                                    <h2 style={{ margin: 0 }}>{nome ?? "Carregando..."}</h2>
                                </div>
                            </div>
                        </header>

                        {/* adicionamos key para forçar remount quando trocar de chat */}
                        <section className="messages-area" key={selectedChatId ?? "no-chat"}>
                            <div className="messages-grid">
                                {messages.map((m) => {
                                    const outgoing = (m.user && (m.user as any)._id) === userId;
                                    const createdAtStr = (() => {
                                        if (!m.createdAt) return "";
                                        try {
                                            const d = m.createdAt instanceof Date ? m.createdAt : new Date(m.createdAt as any);
                                            if (isNaN(d.getTime())) return "";
                                            return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                                        } catch {
                                            return "";
                                        }
                                    })();

                                    return (
                                        <div key={m._id} className={outgoing ? "msg-out" : "msg-in"}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    justifyContent: outgoing ? "flex-end" : "flex-start",
                                                }}
                                            >
                                                <div
                                                    className="avatar size-10"
                                                    style={{
                                                        backgroundImage: `url("${(m.user as any)?.avatar || (m as any).userImage || DEFAULT_AVATAR}")`,
                                                    }}
                                                    title={(m.user as any)?.name || ""}
                                                />
                                                <div
                                                    className={`msg-bubble ${outgoing ? "outgoing" : ""}`}
                                                    style={{
                                                        marginLeft: outgoing ? 0 : 12,
                                                        marginRight: outgoing ? 12 : 0,
                                                        position: "relative",
                                                    }}
                                                >
                                                    <div>{m.text}</div>
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            right: 8,
                                                            bottom: 4,
                                                            fontSize: 12,
                                                            color: outgoing ? "rgba(255,255,255,0.8)" : "var(--muted)",
                                                        }}
                                                    >
                                                        {createdAtStr}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div ref={messagesEndRef} />
                            </div>
                        </section>

                        <footer className="composer">
                            <div className="inputWrap">
                                <div style={{ position: "relative" }}>
                                    <input
                                        type="text"
                                        placeholder="Digite sua mensagem..."
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        className="chat-input"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSend();
                                        }}
                                        aria-label="Mensagem"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={handleSend}
                                    style={{ background: "var(--primary)", borderRadius: 12, padding: 12, color: "#fff", border: 0 }}
                                    aria-label="Enviar mensagem"
                                >
                                    <span className="material-symbols-outlined" style={{ color: "#fff" }}>
                                        send
                                    </span>
                                </button>
                            </div>
                        </footer>

                        {loading && (
                            <div className="loading-overlay">
                                <div className="loading-box">Loading...</div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ReportList;
