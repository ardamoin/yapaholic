import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  membership: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.membership = action.payload.membership;
    },
    logout(state) {
      state.id = initialState.id;
      state.name = initialState.name;
      state.membership = initialState.membership;
    },
    updateMembership(state) {
      state.membership = "member";
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
