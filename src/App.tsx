/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  createTodo,
  deleteTodo as deleteTodoRequest,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

enum ErrorMessage {
  None = '',
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Empty = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.None);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setError(ErrorMessage.None);
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(ErrorMessage.None), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!tempTodo && processingIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [tempTodo, processingIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeCount = todos.filter(todo => !todo.completed).length;

  const handleAddTodo = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.Empty);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    createTodo(newTodo)
      .then(todoFromServer => {
        setTodos(current => [...current, todoFromServer]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setError(ErrorMessage.Add);
        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    setProcessingIds(ids => [...ids, todoId]);
    deleteTodoRequest(todoId)
      .then(() =>
        setTodos(current => current.filter(todo => todo.id !== todoId)),
      )
      .catch(() => setError(ErrorMessage.Delete))
      .finally(() => setProcessingIds(ids => ids.filter(id => id !== todoId)));
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => handleDelete(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />
          <NewTodo
            title={title}
            onChange={setTitle}
            onSubmit={handleAddTodo}
            disabled={!!tempTodo}
            inputRef={inputRef}
          />
        </header>

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onDelete={handleDelete}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            todos={todos}
            onClearCompleted={handleClearCompleted}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(ErrorMessage.None)}
        />
        {error}
      </div>
    </div>
  );
};
