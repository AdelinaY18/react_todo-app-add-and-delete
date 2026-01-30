import React from 'react';
import { FilterNav } from './FilterNav';
import { Todo } from '../types/Todo';
import { Filter } from '../App';

export const Footer: React.FC<{
  activeCount: number;
  todos: Todo[];
  onClearCompleted: () => void;
  filter: Filter;
  setFilter: (filter: Filter) => void;
}> = ({ activeCount, todos, onClearCompleted, filter, setFilter }) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>
      <FilterNav filter={filter} setFilter={setFilter} />
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
