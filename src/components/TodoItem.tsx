import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

export const TodoItem: React.FC<{
  todo: Todo;
  onDelete?: () => void;
  isProcessing?: boolean;
}> = ({ todo, onDelete, isProcessing }) => {
  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
          disabled={isProcessing}
        />
        <span className="is-sr-only">Mark todo as completed</span>
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onDelete}
        disabled={isProcessing}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isProcessing })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
