import React, { useState, useMemo } from 'react';
import { Select } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useMatch } from 'react-router-dom';
import { selectBoards, selectAllTasksFlattened } from '../../store/kanbanSlice';
import styles from './TaskSearch.module.css';

const { Option, OptGroup } = Select;

const TaskSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const boards = useSelector(selectBoards);
  const tasks = useSelector(selectAllTasksFlattened);

  const [searchValue, setSearchValue] = useState(undefined);

  // Update search value based on route
  React.useEffect(() => {
    const boardMatch = location.pathname.match(/kanban\/(.+)$/);
    const taskMatch = location.pathname.match(/tasks\/(.+)$/);
    if (taskMatch) {
      setSearchValue(taskMatch[1]);
    } else if (boardMatch) {
      setSearchValue(boardMatch[1]);
    } else {
      setSearchValue(undefined);
    }
  }, [location.pathname]);

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
  };

  const filterOption = (input, option) => {
    return (option?.searchStr ?? '').toLowerCase().includes(input.toLowerCase());
  };

  return (
    <Select
      className={styles.searchInput}
      showSearch
      filterOption={filterOption}
      placeholder="Search Boards or Tasks..."
      value={searchValue}
      onChange={handleSelect}
      style={{ width: 400 }}
      allowClear
      optionLabelProp="label"
    >
      <OptGroup label="Boards">
        {boards.map(board => (
          <Option
            key={board.id}
            value={board.id}
            data-type="board"
            searchStr={`${board.name} ${board.key}`}
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
            key={task.id}
            value={task.id}
            data-type="task"
            searchStr={`${task.displayId || task.id} ${task.title}`}
            label={task.title}
          >
            <div className={styles.optionLabel}>
              <span>{task.title}</span>
              <span className={styles.taskId}>#{task.displayId ? task.displayId : String(task.id).slice(0,6)}</span>
            </div>
          </Option>
        ))}
      </OptGroup>
    </Select>
  );
};

export default TaskSearch;
