import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AppState, GitHubUser, GitHubRepo } from '../types/github';
import { ActionType } from './action-types';

type AppAction =
  | { type: typeof ActionType.SET_LOADING; payload: boolean }
  | { type: typeof ActionType.SET_ERROR; payload: string | null }
  | { type: typeof ActionType.SET_USER_DATA; payload: GitHubUser | null }
  | { type: typeof ActionType.SET_REPOS; payload: GitHubRepo[] }
  | { type: typeof ActionType.APPEND_REPOS; payload: GitHubRepo[] }
  | { type: typeof ActionType.TOGGLE_DARK_MODE }
  | { type: typeof ActionType.SET_DARK_MODE; payload: boolean }
  | { type: typeof ActionType.SET_CURRENT_PAGE; payload: number }
  | { type: typeof ActionType.SET_HAS_MORE; payload: boolean }
  | { type: typeof ActionType.RESET_STATE };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const initialState: AppState = {
  userData: null,
  repos: [],
  loading: false,
  error: null,
  darkMode: localStorage.getItem('darkMode') === 'true',
  currentPage: 1,
  hasMore: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case ActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionType.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ActionType.SET_USER_DATA:
      return { ...state, userData: action.payload, error: null };
    case ActionType.SET_REPOS:
      return { ...state, repos: action.payload, error: null };
    case ActionType.APPEND_REPOS:
      return { ...state, repos: [...state.repos, ...action.payload] };
    case ActionType.TOGGLE_DARK_MODE:
      const newDarkMode = !state.darkMode;
      localStorage.setItem('darkMode', String(newDarkMode));
      return { ...state, darkMode: newDarkMode };
    case ActionType.SET_DARK_MODE:
      localStorage.setItem('darkMode', String(action.payload));
      return { ...state, darkMode: action.payload };
    case ActionType.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    case ActionType.SET_HAS_MORE:
      return { ...state, hasMore: action.payload };
    case ActionType.RESET_STATE:
      return {
        ...state,
        userData: null,
        repos: [],
        error: null,
        currentPage: 1,
        hasMore: true,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
