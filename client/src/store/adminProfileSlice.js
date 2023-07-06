import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const adminProfileSlice = createSlice({
  name: "adminProfile",
  initialState: null,
  reducers: {
    setAdminProfile: (state, action) => action.payload,
  },
});

export const { setAdminProfile } = adminProfileSlice.actions;
export default adminProfileSlice.reducer;
