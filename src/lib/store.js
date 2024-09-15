const { configureStore } = require("@reduxjs/toolkit");
import invitedUsersReducer from "./features/slice";

export const store = configureStore({
  reducer: {
    invitedUsers: invitedUsersReducer,
  },
});
