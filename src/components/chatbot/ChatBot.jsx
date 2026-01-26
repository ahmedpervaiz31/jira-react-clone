import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatBot.module.css';
import { MessageOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { sendChatMessage, clearChat, setBoardId, resetBoardId } from '../../store/chatSlice';
import { useLocation } from 'react-router-dom';

const BOT_NAME = 'Jira-Bot';

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);
    
    const messages = useSelector((state) => state.chat?.messages || []);
    const loading = useSelector((state) => state.chat?.loading);
    const error = useSelector((state) => state.chat?.error);
    const boards = useSelector((state) => state.board?.boards || []);
    const dispatch = useDispatch();
    const location = useLocation();

    const boardId = location.pathname.match(/\/kanban\/([^/]+)/)?.[1] || null;
    
    const boardName = boardId
        ? (boards.find(b => b.id === boardId || b._id === boardId)?.name || "Current Board")
        : null;

    useEffect(() => {
        if (boardId) {
            dispatch(setBoardId(boardId));
        } else {
            dispatch(resetBoardId());
        }
    }, [boardId, dispatch]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const prevBoardIdRef = useRef(boardId);
    useEffect(() => {
        if (open && prevBoardIdRef.current !== boardId) {
            dispatch(clearChat());
            prevBoardIdRef.current = boardId;
        }
    }, [boardId, open, dispatch]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        
        dispatch(sendChatMessage({ message: input, boardId }));
        setInput('');
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <button
                className={styles.chatbotButton}
                onClick={handleOpen}
                style={{ display: open ? 'none' : 'flex' }}
            >
                <MessageOutlined style={{ fontSize: 28 }} />
            </button>

            {open && (
                <>
                    <div className={styles.chatbotOverlay} onClick={handleClose} />
                    <div className={styles.chatbotModal}>
                        <div className={styles.chatbotHeader}>
                            <span>
                                {BOT_NAME}
                                {boardName ? ` — ${boardName}` : ''}
                            </span>
                            <button className={styles.closeButton} onClick={handleClose}>
                                <CloseOutlined style={{ fontSize: 20 }} />
                            </button>
                        </div>

                        <div className={styles.chatbotMessages} ref={scrollRef}>
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={msg.from === 'bot' ? styles.botMessage : styles.userMessage}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            {loading && (
                                <div className={styles.botMessage} style={{ opacity: 0.7 }}>
                                    <em>Bot is typing...</em>
                                </div>
                            )}
                            {error && (
                                <div className={styles.botMessage} style={{ color: 'red' }}>
                                    <em>{error}</em>
                                </div>
                            )}
                        </div>

                        <form className={styles.chatbotInputBar} onSubmit={handleSend}>
                            <input
                                type="text"
                                className={styles.chatbotInput}
                                placeholder={loading ? "Bot is typing..." : "Type message..."}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                autoFocus
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className={styles.sendButton}
                                disabled={loading || !input.trim()}
                            >
                                <SendOutlined style={{ fontSize: 20 }} />
                            </button>
                        </form>
                    </div>
                </>
            )}
        </>
    );
};

export default ChatBot;