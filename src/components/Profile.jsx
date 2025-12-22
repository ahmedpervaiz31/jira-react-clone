import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getTasksByAssigneeAsync } from '../store/taskSlice';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile = () => { 
    const dispatch = useDispatch();
    const [userTasks, setUserTasks] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (!user) return;
        const fetchTasks = async () => {
            const result = await dispatch(getTasksByAssigneeAsync({ assignee: user.username })).unwrap();
            
            setUserTasks(result.items || []);
        };
        fetchTasks();
    }, [dispatch, user]);


        if (!user) {
            return <div className={styles.profileContainer}>Loading...</div>;
        }

    return (
        <div className={styles.profileContainer}>
            <h1 className={styles.heading}>{user.username}'s Tasks</h1>
            <div className={styles.tasksGrid}>
                {userTasks.length === 0 ? 
                (
                    <div className={styles.noTasks}>No tasks assigned.</div>
                ) : 
                (
                    userTasks.map((task) => {
                        return (
                            <div
                                key={task.id}
                                className={styles.taskCard}
                                onClick={() => navigate(`/tasks/${task.id}`)}
                                style={{ cursor: 'pointer' }}
                                title="View task details"
                            >
                                <div className={styles.taskCardHeader}>
                                    <span className={styles.taskTitle}>{task.title}</span>
                                    <span className={styles.taskStatus}>{task.status}</span>
                                </div>
                                <div className={styles.taskCardFooter}>
                                    <span className={styles.taskId}>{task.displayId}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Profile;