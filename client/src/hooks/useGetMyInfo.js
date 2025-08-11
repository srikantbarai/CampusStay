import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../lib/api';

const useGetMyInfo = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    myInfo: data?.data,
    isLoading,
    error
  };
};

export default useGetMyInfo;