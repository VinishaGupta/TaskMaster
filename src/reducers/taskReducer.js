export const initialState = {
  todos: [],
  loading: false,
  error: null,
  adding: false,
  lastDeleted: null,
};

export function taskReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, todos: action.payload, error: null };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "ADD_START":
      return { ...state, adding: true };

    case "ADD_END":
      return { ...state, adding: false };

    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] };

    case "DELETE_TODO":
      return {
        ...state,
        lastDeleted: action.payload.deleted,
        todos: state.todos.filter((t) => t.id !== action.payload.id),
      };

    case "RESTORE_DELETED":
      return {
        ...state,
        todos: state.lastDeleted
          ? [...state.todos, state.lastDeleted]
          : state.todos,
        lastDeleted: null,
      };

    case "TOGGLE_INSTANT":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload
            ? { ...t, completed: !t.completed }
            : t
        ),
      };

    case "EDIT_TODO":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case "REORDER_TODOS": {
      const updated = [...state.todos];
      const [moved] = updated.splice(action.payload.from, 1);
      updated.splice(action.payload.to, 0, moved);
      return { ...state, todos: updated };
    }

    default:
      return state;
  }
}
