import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invitedUsers: [],
};

export const invitedUsersSlice = createSlice({
  name: "invitedUsers",
  initialState,  // Fixed typo here
  reducers: {
    addInvitedUser: (state, action) => {
      const user = action.payload;
      state.invitedUsers.push(user);
    },
    removeInvitedUser: (state, action) => {
      if (state.invitedUsers.length > 0) {
        state.invitedUsers = state.invitedUsers.filter(
          (user) => user.username !== action.payload
        );
      }
    },
  },
});

export const { addInvitedUser, removeInvitedUser } = invitedUsersSlice.actions;
export default invitedUsersSlice.reducer;
