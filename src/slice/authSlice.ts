import { createSlice } from '@reduxjs/toolkit';

export enum AuthStep {
  Step0 = 0,
  Step1 = 1,
  Step2 = 2,
  step3 = 3,
}

export interface IAuth {
  step: AuthStep;
  acc_token: string;
  ref_token: string;
  phNo: string;
  verificationId: string;
  isNewUser: boolean;
}

const initialState: IAuth = {
  step: AuthStep.Step0,
  acc_token: '',
  ref_token: '',
  phNo: '',
  verificationId: '',
  isNewUser: false
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
    },
    setLogout: (state)=>{
      state.acc_token = "";
      state.phNo = "";
      state.ref_token = "";
      state.step = AuthStep.Step0;
      state.verificationId="";
    },
    setIsNewUser: (state, action)=>{
      state.isNewUser = action.payload
    }
  },
});

export const { setAccessToken, setRefreshToken, setAuthStep, setPhno, setVerificationId, setLogout, setIsNewUser } =
  authSlice.actions;
export default authSlice.reducer;
