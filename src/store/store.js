import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
import kanbanReducer from './kanbanSlice';

const themePersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['isDark'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  theme: persistReducer(themePersistConfig, themeReducer),
  kanban: kanbanReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);
