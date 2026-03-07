import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ICommute } from '../types/commute.types';
import type { CommuteDateTab } from '../types/commuteDates.types';
import type { SearchTripsBaseParams } from '../types/trips.types';


export interface ICommuteState {
  commuteData: ICommute[] | null;
  dateTabs: CommuteDateTab[];
  activeDateIndex: number;
  searchBaseParams: SearchTripsBaseParams | null;
}

const initialState: ICommuteState = {
   commuteData: null,
   dateTabs: [],
   activeDateIndex: 0,
   searchBaseParams: null,
};
const commuteSlice = createSlice({
    name: 'commute',
    initialState: initialState,
    reducers: {
        setCommuteData: (state, action: PayloadAction<ICommute[] | null>)=>{
          state.commuteData = action.payload;
        },
        setCommuteSearchContext: (
          state,
          action: PayloadAction<{
            dateTabs: CommuteDateTab[];
            activeDateIndex: number;
            searchBaseParams: SearchTripsBaseParams;
          }>,
        ) => {
          state.dateTabs = action.payload.dateTabs;
          state.activeDateIndex = action.payload.activeDateIndex;
          state.searchBaseParams = action.payload.searchBaseParams;
        },
        setActiveDateIndex: (state, action: PayloadAction<number>) => {
          state.activeDateIndex = action.payload;
        }
    },
});

export const { setCommuteData, setCommuteSearchContext, setActiveDateIndex } = commuteSlice.actions;
export default commuteSlice.reducer;
