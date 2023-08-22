import { createContext } from 'react';

interface State {
  loading: boolean;
  user?: User;
  list: ITodo[];
  tags: TodoTag[];
}

interface Action {
  type: string;
  payload?: Partial<State>;
}

interface ContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const initialState: State = {
  loading: false,
  list: [],
  tags: [],
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, ...(action.payload || {}) };

    default:
      return state;
  }
};

export const ReduxContext = createContext<ContextProps>({ state: initialState, dispatch: () => {} });
