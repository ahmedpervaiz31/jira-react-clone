import React from 'react';
import styles from './BoardPresence.module.css';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function BoardPresence({ users = [], currentUserId }) {
	if (!users || users.length === 0) return null;
	const safeUsers = users.filter(u => u && typeof u === 'object');
	const sorted = [...safeUsers].sort((a) => (a.id === currentUserId ? -1 : 1));
	const displayUsers = sorted.slice(0, 2);
	const isOverflow = safeUsers.length > 3;
	const overflowCount = safeUsers.length - 2;
	const currentUser = sorted.find(u => u && u.id === currentUserId);
	const avatars = [currentUser, ...displayUsers.filter(u => u && u.id !== currentUserId)].filter(Boolean).slice(0, 3);

	return (
		<div className={styles.presenceContainer}>
			{avatars.map((user, idx) => (
				<div key={user.id || idx} className={styles.avatarWrapper} style={{ zIndex: 10 - idx }}>
					{user.avatar ? (
						<img
							src={user.avatar}
							alt={user.username}
							className={styles.avatar}
							title={user.username}
						/>
					) : (
						<Avatar icon={<UserOutlined />} className={styles.avatar} title={user.username} />
					)}
				</div>
			))}
			{isOverflow && (
				<div className={styles.avatarWrapper} style={{ zIndex: 7 }}>
					<div className={styles.overflowCircle} title={safeUsers.slice(3).map(u => u.username).join(', ')}>
						+{overflowCount}
					</div>
				</div>
			)}
		</div>
	);
}
