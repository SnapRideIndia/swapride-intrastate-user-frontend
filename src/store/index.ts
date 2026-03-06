import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../slice/authSlice'
import profileSlice from '../slice/profileSlice'
import commuteSlice from '../slice/commuteSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
    commute: commuteSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
