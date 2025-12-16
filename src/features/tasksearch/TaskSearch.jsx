import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api'; 
import styles from './TaskSearch.module.css';

const { Option, OptGroup } = Select;

const TaskSearch = ({ onItemSelect, autoFocus }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchValue, setSearchValue] = useState(undefined);
  const [inputValue, setInputValue] = useState('');

  const fetchBoards = async (q) => {
    try {
      const res = await api.get(`/boards/search?q=${encodeURIComponent(q || '')}`);
      return res.data;
    } catch (err) {
      console.error("Board search failed", err);
      return [];
    }
  };
  
  const fetchTasks = async (q) => {
    try {
      const res = await api.get(`/tasks/search?q=${encodeURIComponent(q || '')}`);
      return res.data;
    } catch (err) {
      console.error("Task search failed", err);
      return [];
    }
  };

  useEffect(() => {
    const boardMatch = location.pathname.match(/kanban\/(.+)$/);
    const taskMatch = location.pathname.match(/tasks\/(.+)$/);

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
          const id = boardMatch[1];
          setSearchValue(id);
          setInputValue('');
          const res = await api.get(`/boards/${id}`); 
          setBoards([res.data]);
          setTasks([]);
        } else {
          setSearchValue(undefined);
          setInputValue('');
        }
      } catch (err) {
        console.error("Failed to load initial selection", err);
      }
    };

    loadInitialSelection();
  }, [location.pathname]);

  const handleSearch = async (q) => {
    setInputValue(q);
    
    try {
      const [boardsRes, tasksRes] = await Promise.all([
        fetchBoards(q),
        fetchTasks(q)
      ]);
      setBoards(boardsRes || []);
      setTasks(tasksRes || []);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleSelect = (value, option) => {
    if (!value) {
      navigate('/');
      return;
    }
    if (option['data-type'] === 'board') {
      navigate(`/kanban/${value}`);
    } else {
      navigate(`/tasks/${value}`);
    }
    
    setInputValue(''); 
    
    if (onItemSelect) onItemSelect();
  };

  return (
    <Select
      className={styles.searchInput}
      showSearch
      filterOption={false}
      placeholder="Search Boards or Tasks..."
      value={searchValue}
      searchValue={inputValue}
      onSearch={handleSearch}
      onChange={handleSelect}
      onFocus={() => handleSearch('')}
      onBlur={() => setInputValue('')}
      style={{ width: '100%' }}
      allowClear
      optionLabelProp="label"
      autoFocus={autoFocus}
      notFoundContent="No results"
      defaultActiveFirstOption={false}
      suffixIcon={null}
    >
      <OptGroup label="Boards">
        {boards.map(board => (
          <Option
            key={board.id || board._id}
            value={board.id || board._id}
            data-type="board"
            label={board.name}
          >
            <div className={styles.optionLabel}>
              <span>{board.name}</span>
              <span className={styles.typeLabel}>{board.key}</span>
            </div>
          </Option>
        ))}
      </OptGroup>
      <OptGroup label="Tasks">
        {tasks.map(task => (
          <Option
            key={task.id || task._id}
            value={task.id || task._id}
            data-type="task"
            label={task.displayId || task.title}
          >
            <div className={styles.optionLabel}>
              <span>{task.title}</span>
              <span className={styles.taskId}>
                #{task.displayId ? task.displayId : String(task.id || task._id).slice(0,6)}
              </span>
            </div>
          </Option>
        ))}
      </OptGroup>
    </Select>
  );
};

export default TaskSearch;