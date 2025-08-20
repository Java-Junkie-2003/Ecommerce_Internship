import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { loadUserInfo } from '@/redux/slices/user';
import { getAccessToken } from '@/utils/token';
import { d } from 'node_modules/@react-router/dev/dist/routes-DHIOx0R9';

/**
 * Component to handle initial user data loading
 * This should be used within the Redux Provider
 */
export const UserLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [hasLoadedUser, setHasLoadedUser] = useState(false);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken && !hasLoadedUser) {
      dispatch(loadUserInfo());
      setHasLoadedUser(true);
    } else if (!accessToken) {
      setHasLoadedUser(true);
      dispatch(loadUserInfo());
    }
  }, [dispatch, hasLoadedUser]);

  return <>{children}</>;
};
