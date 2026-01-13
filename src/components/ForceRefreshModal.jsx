import React from 'react';
import styles from './ForceRefreshModal.module.css';

export default function ForceRefreshModal({ visible, reason }) {
	if (!visible) return null;
	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<h2>Page Updated</h2>
				<p>{reason || 'Please refresh to see the latest updates.'}</p>
				<button className={styles.refreshBtn} onClick={() => window.location.reload()}>
					Refresh Now
				</button>
			</div>
		</div>
	);
}
