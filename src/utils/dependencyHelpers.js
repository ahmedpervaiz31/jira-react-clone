import api from './api';

export async function fetchBoardTasks(boardId) {
  const { data } = await api.get('/tasks', { params: { boardId, limit: 1000 } });
  return data.items || [];
}

export async function validateDependenciesOnAdd(taskTitle, dependencies, allTasks) {
  if (dependencies.some(depId => 
    allTasks.find(t => (t.id === depId || t._id === depId) && t.title === taskTitle)
  )) {
    return { valid: false, error: 'Cannot depend on itself.' };
  }

  for (const depId of dependencies) {
    const exists = allTasks.find(t => t.id === depId || t._id === depId);
    
    if (!exists) {
      return { valid: false, error: 'Dependency does not exist.' };
    }
  }
  return { valid: true };
}

export async function areDependenciesReady(taskId, newStatus) {
  try {
    const { data: task } = await api.get(`/tasks/${taskId}`);
    if (!task || !Array.isArray(task.dependencies) || task.dependencies.length === 0) {
      return { ready: true };
    }
    const { data: parentTasks } = await api.post('/tasks/batch', { ids: task.dependencies });
    if (newStatus === 'done') {
      const notDone = parentTasks.filter(pt => pt.status !== 'done');
      if (notDone.length > 0) {
        return {
          ready: false,
          blocking: notDone.map((t) => ({ id: t._id || t.id, title: t.title, status: t.status })),
        };
      }
      return { ready: true };
    }
    const notReady = parentTasks.filter(
      (pt) => pt.status !== 'in_progress' && pt.status !== 'done'
    );
    if (notReady.length > 0) {
      return {
        ready: false,
        blocking: notReady.map((t) => ({ id: t._id || t.id, title: t.title, status: t.status })),
      };
    }
    return { ready: true };
  } catch (err) {
    return { ready: false, error: err.message };
  }
}

export default { fetchBoardTasks, validateDependenciesOnAdd, areDependenciesReady };