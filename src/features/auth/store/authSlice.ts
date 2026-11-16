import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthPayload, AuthUser } from '@/shared/api/types';

export type AuthStatus = 'loading' | 'authenticated' | 'guest';

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(
      state,
      action: PayloadAction<Pick<AuthPayload, 'user' | 'accessToken'>>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = 'authenticated';
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    clearSession(state) {
      state.user = null;
      state.accessToken = null;
      state.status = 'guest';
    },
  },
});

export const { setSession, setUser, clearSession } = authSlice.actions;
export default authSlice.reducer;
