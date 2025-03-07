import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AttendanceState, CheckInOutData, LocationData } from './types';

const initialState: AttendanceState = {
  checkInOutData: null,
  currentLocation: null,
};

export const attendanceSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setCheckInOutData: (
      state,
      action: PayloadAction<CheckInOutData>, // Corrected payload action type
    ) => {
      state.checkInOutData = action.payload;
    },
    setCurrentLocation: (state,
      action: PayloadAction<LocationData>) => {
      state.currentLocation = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const { setCheckInOutData,setCurrentLocation} = attendanceSlice.actions;
export default attendanceSlice.reducer;
