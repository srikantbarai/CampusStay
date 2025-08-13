import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: (data) => {
      console.log('Login successful:', data);
      queryClient.invalidateQueries(['myInfo']);
      
      const userRole = data.data?.role;
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'student') {
        navigate('/student');
      } else {
        navigate('/');
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });
};

export default useLogin;