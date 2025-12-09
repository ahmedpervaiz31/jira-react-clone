import { useSelector, useDispatch } from 'react-redux';
import { setCred, logOut } from './authSlice';
import { toggleTheme, setTheme } from './themeSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  const login = (userData) => {
    dispatch(setCred(userData));
  };
  
  const logout = () => {
    dispatch(logOut());
  };
  
  return { 
    user, 
    isAuthenticated,
    login,
    logout
  };
};

export const useTheme = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  
  const toggle = () => {
    dispatch(toggleTheme());
  };
  
  const setDark = (dark) => {
    dispatch(setTheme(dark));
  };
  
  return {
    isDark,
    toggle,
    setDark,
  };
};
