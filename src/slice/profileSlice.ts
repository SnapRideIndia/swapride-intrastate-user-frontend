import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { IProfileData } from '../types/profileData.Types';

export interface ICurrentLocation {
  latitude: number;
  longitude: number;
}

export interface IProfile {
  profileData: IProfileData | null;
  currentLocation: ICurrentLocation | null;
}

const initialState: IProfile = {
  profileData: null,
  currentLocation: null,
};
const profileSlice = createSlice({
  name: 'profile',
  initialState: initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<IProfileData | null>) => {
      state.profileData = action.payload;
    },
    setCurrentLocation: (state, action: PayloadAction<ICurrentLocation | null>) => {
      state.currentLocation = action.payload;
    },
  },
});

export const { setProfileData, setCurrentLocation } = profileSlice.actions;
export default profileSlice.reducer;
