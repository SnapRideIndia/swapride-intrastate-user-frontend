import { createSlice } from '@reduxjs/toolkit';
import { IProfileData } from '../types/profileData.Types';


export interface IProfile {
   profileData: IProfileData | null
}

const initialState: IProfile = {
   profileData: null
};
const profileSlice = createSlice({
    name: 'profile',
    initialState: initialState,
    reducers: {
       setProfileData: (state, action)=>{
        state.profileData = action.payload
       }
    },
});

export const { setProfileData } =
    profileSlice.actions;
export default profileSlice.reducer;
