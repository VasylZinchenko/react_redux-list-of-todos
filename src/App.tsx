/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos } from './api';
import { SortType, Todo } from './types/Todo';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { actions } from './features/todos';

export function checkQuery(query:string, content:string) {
  return (content.toLowerCase())
    .includes(query.toLowerCase());
}

export const App: React.FC = () => {
  // const [todos, setTodos] = useState<Todo[]>([]);
  const [todoId, setTodoId] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filterBy, setFilterBy] = useState(SortType.ALL);
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();
  const todos:Todo[] = useAppSelector(state => state.todos);

  const loadTodos = async () => {
    const todosFromServer = await getTodos();

    setIsLoaded(true);
    dispatch(actions.load(todosFromServer));
    // setTodos(todosFromServer);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const filteredTodos = todos
    .filter(({ completed, title }) => {
      switch (filterBy) {
        case SortType.ACTIVE:
          return !completed && checkQuery(query, title);

        case SortType.COMPLETED:
          return completed && checkQuery(query, title);

        default:
          return checkQuery(query, title);
      }
    });

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                query={query}
                setQuery={setQuery}
              />
            </div>
            <div className="block">
              {
                !isLoaded
                  ? <Loader />
                  : (
                    <TodoList
                      todos={filteredTodos}
                      selectedTodoId={todoId}
                      selectTodo={setTodoId}
                    />
                  )
              }
            </div>
          </div>
        </div>
      </div>

      {!!todoId && (
        <TodoModal
          todoId={todoId}
          todos={filteredTodos}
          setTodoId={setTodoId}
        />
      )}

    </>
  );
};
