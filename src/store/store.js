import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
import boardReducer from './boardSlice';
import taskReducer from './taskSlice';
import userReducer from './userSlice';
import chatReducer from './chatSlice';

const themePersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['isDark'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  theme: persistReducer(themePersistConfig, themeReducer),
  board: boardReducer,
  tasks: taskReducer,
  users: userReducer,
  chat: chatReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);
