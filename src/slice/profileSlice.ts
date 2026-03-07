import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { IProfileData } from '../types/profileData.Types';
import { ICoords } from '../types/coords.types';


export interface IProfile {
   profileData: IProfileData | null;
   currentCoords: ICoords  | null;
}

const initialState: IProfile = {
   profileData: null,
   currentCoords: null,
};
const profileSlice = createSlice({
    name: 'profile',
    initialState: initialState,
    reducers: {
       setProfileData: (state, action: PayloadAction<IProfileData | null>)=>{
        state.profileData = action.payload;
       },
       setCurrentCoords: (state, action: PayloadAction<ICoords | null>)=>{
        state.currentCoords = action.payload;
       },
    },
});

export const { setProfileData, setCurrentCoords } =
    profileSlice.actions;
export default profileSlice.reducer;
