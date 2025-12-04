import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice';
import themeReducer from './themeSlice';
import kanbanReducer from '../features/kanban/kanbanSlice';

const themePersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['isDark'],
};

const kanbanPersistConfig = {
  key: 'kanban',
  storage,
  whitelist: ['tasks'],
};

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  theme: persistReducer(themePersistConfig, themeReducer),
  kanban: persistReducer(kanbanPersistConfig, kanbanReducer),
});

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);
