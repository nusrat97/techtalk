import { configureStore } from '@reduxjs/toolkit'
import activeChatSlice from './slice/activeChatSlice'
import notificationSlice from './slice/notificationSlice'

export default configureStore({
  reducer: {
    activeChat : activeChatSlice,
    notification : notificationSlice,
  },
})