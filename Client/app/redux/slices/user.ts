import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/model/user';
import Cookies from 'js-cookie';

interface UserState {
    userInfo: User | null;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    userInfo: null,
    isLoggedIn: false,
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
        },
        removeUserInfo: (state) => {
            state.userInfo = null;
            state.isLoggedIn = false;
            Cookies.remove('userInfo');
        },
        loadUserInfo: (state) => {
            const userInfo = Cookies.get('userInfo');
            if (userInfo) {
                state.userInfo = JSON.parse(userInfo);
                state.isLoggedIn = true;
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