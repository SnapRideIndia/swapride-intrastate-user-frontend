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
  phNo: string;
  verificationId: string;
}

const initialState: IAuth = {
  step: AuthStep.Step0,
  acc_token: '',
  ref_token: '',
  phNo: '',
  verificationId: '',
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
    setAuthStep: (state, action) => {
      state.step = action.payload;
    },
    setPhno: (state, action) => {
      state.phNo = action.payload;
    },
    setVerificationId: (state, action)=>{
      state.verificationId = action.payload
    }
  },
});

export const { setAccessToken, setRefreshToken, setAuthStep, setPhno, setVerificationId } =
  authSlice.actions;
export default authSlice.reducer;
