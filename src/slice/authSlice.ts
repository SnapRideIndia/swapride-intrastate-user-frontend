import { createSlice } from '@reduxjs/toolkit';

export enum AuthStep {
  Step0 = 0,
  Step1 = 1,
  Step2 = 2,
}

export interface IAuth {
  step: AuthStep;
  acc_token: string;
  ref_token: string;
}

const initialState: IAuth = {
  step: AuthStep.Step0,
  acc_token: '',
  ref_token: '',
};
const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.acc_token = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.ref_token = action.payload;
    },
    setAuthStep: (state, action)=>{
        state.step = action.payload
    }
  },
});

export const {
    setAccessToken,
    setRefreshToken,
    setAuthStep
} = authSlice.actions;
export default authSlice.reducer;
