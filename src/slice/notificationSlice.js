import { createSlice } from '@reduxjs/toolkit'

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    amount: 0,
  },
  reducers: {
    notification: (state, action) => {
      state.amount = action.payload;
    },
  },
})

export const { notification } = notificationSlice.actions

export default notificationSlice.reducer