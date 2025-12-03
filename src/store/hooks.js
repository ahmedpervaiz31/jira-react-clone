import { useSelector, useDispatch } from 'react-redux';
import { setCred, logOut } from '../features/auth/authSlice';

// Custom hook for authentication state and actions
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
