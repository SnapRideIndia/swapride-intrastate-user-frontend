import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from '../slice/authSlice';
import profileSlice from '../slice/profileSlice';
import commuteSlice from '../slice/commuteSlice';

const appReducer = combineReducers({
  auth: authSlice,
  profile: profileSlice,
  commute: commuteSlice,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action.type === 'auth/setLogout') {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
