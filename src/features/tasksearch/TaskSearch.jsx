import React from 'react';
import { Select } from 'antd';
import styles from './TaskSearch.module.css';
import { useTaskSearch } from './useTaskSearch';

const { Option, OptGroup } = Select;

const TaskSearch = ({ onItemSelect, autoFocus, boardId = null }) => {
  const {
    boards,
    tasks,
    searchValue,
    inputValue,
    handleSearch,
    navigate,
    setInputValue,
    effectiveBoardId 
  } = useTaskSearch({ 
    autoLoad: true,
    boardId 
  });

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
      placeholder={effectiveBoardId ? "Search tasks in this board..." : "Search Boards or Tasks..."}
      value={searchValue}
      searchValue={inputValue}
      onSearch={handleSearch}
      onChange={handleSelect}
      onFocus={() => handleSearch(inputValue || '')}
      onBlur={() => setInputValue('')}
      style={{ width: '100%' }}
      allowClear
      optionLabelProp="label"
      autoFocus={autoFocus}
      notFoundContent="No results"
      defaultActiveFirstOption={false}
      suffixIcon={null}
    >
      {!effectiveBoardId && boards.length > 0 && (
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
      )}

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