import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatBot.module.css';
import { MessageOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { sendChatMessage, clearChat } from '../../store/chatSlice';

const BOT_NAME = 'Jira-Bot';

const ChatBot = () => {
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState('');
	const messages = useSelector((state) => state.chat?.messages || [
		{ from: 'bot', text: 'How can I help you?' }
	]);
	const loading = useSelector((state) => state.chat?.loading);
	const error = useSelector((state) => state.chat?.error);
	const dispatch = useDispatch();

	const handleSend = (e) => {
		e.preventDefault();
		if (!input.trim() || loading) return;
		dispatch(sendChatMessage(input));
		setInput('');
	};
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
        dispatch(clearChat());
	};
	return (
		<>
			<button
				className={styles.chatbotButton}
				onClick={handleOpen}
				aria-label="Open chat"
				style={{ display: open ? 'none' : 'flex' }}
			>
				<MessageOutlined style={{ fontSize: 28 }} />
			</button>

			{open && (
				<>
					<div className={styles.chatbotOverlay} onClick={handleClose} />
					<div className={styles.chatbotModal}>
						<div className={styles.chatbotHeader}>
							<span>{BOT_NAME}</span>
							<button
								className={styles.closeButton}
								onClick={handleClose}
								aria-label="Close chat"
							>
								<CloseOutlined style={{ fontSize: 20 }} />
							</button>
						</div>
						<div className={styles.chatbotMessages}>
							{messages.map((msg, idx) => (
								<div
									key={idx}
									className={
										msg.from === 'bot'
											? styles.botMessage
											: styles.userMessage
									}
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
								aria-label="Send message"
								disabled={loading}
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
