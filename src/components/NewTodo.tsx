import React from 'react';

export const NewTodo: React.FC<{
  title: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}> = ({ title, onChange, onSubmit, disabled, inputRef }) => {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
    </form>
  );
};
