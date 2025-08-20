import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/model/user';
import Cookies from 'js-cookie';
import { RootState } from '@/types/redux';
import { s } from 'node_modules/react-router/dist/development/components-DzqPLVI1.mjs';

interface UserState extends RootState {
    userInfo: User | null;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    userInfo: null,
    isLoggedIn: false,
    error: null,
    status: 'loading'
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUserInfo: (state, action: PayloadAction<User>) => {
            Cookies.set('userInfo', JSON.stringify(action.payload), {
                expires: 7,
            });
            state.userInfo = action.payload;
            state.isLoggedIn = true;
            state.status = 'idle';
        },
        removeUserInfo: (state) => {
            state.userInfo = null;
            state.isLoggedIn = false;
            Cookies.remove('userInfo');
            state.status = 'idle';
        },
        loadUserInfo: (state) => {
            const userInfo = Cookies.get('userInfo');
            if (userInfo) {
                state.userInfo = JSON.parse(userInfo);
                state.isLoggedIn = true;
                state.status = 'succeeded';
            } else {
                state.status = 'failed';
                state.error = 'Failed to load user information';
                state.userInfo = null;
                state.isLoggedIn = false;
            }
        }
    },
});


export const {
    addUserInfo,
    removeUserInfo,
    loadUserInfo
} = userSlice.actions;

export default userSlice.reducer;