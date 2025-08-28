import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { loadUserInfo } from '@/redux/slices/user'
import { getAccessToken } from '@/utils/token'
import { fetchBrands } from '@/redux/thunks/brand.thunk'
import { fetchCategories } from '@/redux/thunks/category.thunk'

/**
 * Component to handle initial user data loading
 * This should be used within the Redux Provider
 */
export const UserLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch()
  const [hasLoadedUser, setHasLoadedUser] = useState(false)

  useEffect(() => {
    const accessToken = getAccessToken()
    if(!accessToken) {
      dispatch(loadUserInfo())
      setHasLoadedUser(true)
    } else if (accessToken && !hasLoadedUser) {
      dispatch(loadUserInfo())
      dispatch(fetchBrands())
      dispatch(fetchCategories())
      setHasLoadedUser(true)
    } else {
      dispatch(loadUserInfo())
      setHasLoadedUser(true)
    }

  }, [dispatch, hasLoadedUser])

  return <>{children}</>
};
