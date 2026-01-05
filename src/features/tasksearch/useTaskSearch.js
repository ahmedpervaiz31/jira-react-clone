import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';

export function useTaskSearch({ initialQuery = '', includeBoards = true, includeTasks = true, autoLoad = false, boardId = null } = {}) {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchValue, setSearchValue] = useState(undefined);
  const [inputValue, setInputValue] = useState(initialQuery);
  const navigate = useNavigate();
  const location = useLocation();
  
  const urlBoardId = location.pathname.match(/\/kanban\/([^/]+)/)?.[1];
  const effectiveBoardId = boardId || urlBoardId;

  const fetchBoards = useCallback(async (query) => {
    if (!includeBoards || effectiveBoardId) return [];
    try {
      const res = await api.get(`/boards/search?q=${encodeURIComponent(query || '')}`);
      return res.data;
    } catch (err) {
      return [];
    }
  }, [includeBoards, effectiveBoardId]);

  const fetchTasks = useCallback(async (query) => {
    if (!includeTasks) return [];
    try {
      const params = new URLSearchParams({ q: query || '' });
      
      if (effectiveBoardId) {
        params.append('boardId', effectiveBoardId);
      }

      const res = await api.get(`/tasks/search?${params.toString()}`);
      return res.data;
    } catch (err) {
      return [];
    }
  }, [includeTasks, effectiveBoardId]);

  const handleSearch = useCallback(async (query) => {
    setInputValue(query);
    
    try {
      const [boardsRes, tasksRes] = await Promise.all([
        fetchBoards(query),
        fetchTasks(query)
      ]);
      setBoards(boardsRes || []);
      setTasks(tasksRes || []);
    } catch (err) {
      setBoards([]);
      setTasks([]);
    }
  }, [fetchBoards, fetchTasks]); 

  useEffect(() => {
    if (!autoLoad) return;

    if (effectiveBoardId) {
      handleSearch(''); 
      return;
    }

    const taskMatch = location.pathname.match(/\/tasks\/([^/]+)/);
    const boardMatch = location.pathname.match(/\/kanban\/([^/]+)/);

    const loadInitialSelection = async () => {
      try {
        if (taskMatch) {
          const id = taskMatch[1];
          setSearchValue(id);
          setInputValue('');
          const res = await api.get(`/tasks/${id}`);
          setTasks([res.data]);
          setBoards([]);
        } else if (boardMatch) {
           setSearchValue(undefined);
           setInputValue('');
        } else {
          setSearchValue(undefined);
          setInputValue('');
        }
      } catch (err) {
        setSearchValue(undefined);
        setInputValue('');
      }
    };

    loadInitialSelection();
  }, [location.pathname, autoLoad, effectiveBoardId, handleSearch]);

  return {
    boards,
    tasks,
    searchValue,
    inputValue,
    setSearchValue,
    setInputValue,
    handleSearch,
    setBoards,
    setTasks,
    navigate,
    location,
    effectiveBoardId 
  };
}