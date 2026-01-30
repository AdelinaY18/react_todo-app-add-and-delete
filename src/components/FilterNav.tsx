import React from 'react';
import cn from 'classnames';
import { Filter } from '../App';

export const FilterNav: React.FC<{
  filter: Filter;
  setFilter: (filter: Filter) => void;
}> = ({ filter, setFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', { selected: filter === Filter.All })}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(Filter.All)}
      >
        All
      </a>
      <a
        href="#/active"
        className={cn('filter__link', { selected: filter === Filter.Active })}
        data-cy="FilterLinkActive"
        onClick={() => setFilter(Filter.Active)}
      >
        Active
      </a>
      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === Filter.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter(Filter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
