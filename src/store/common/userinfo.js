import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileImage: "",
};

export const profileImageSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setProfileImage: (state, actions) => {
      state.profileImage = actions.payload;
    },
  },
});

export const { setProfileImage } = profileImageSlice.actions;
export default profileImageSlice.reducer;
