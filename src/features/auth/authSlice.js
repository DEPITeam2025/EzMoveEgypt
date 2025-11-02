// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "@/api/axios"; // axios instance
import { apiLogin } from "../../api/usersApi";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await apiLogin(email, password);
      return res; // بيحتوي على user + token
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Login failed");
    }
  }
);

const initialState = {
  user: null,
  token: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("ezMove_auth");
      localStorage.removeItem("username");
      sessionStorage.removeItem("ezMove_auth");
    },
    loadUserFromStorage(state) {
      const stored =
        JSON.parse(localStorage.getItem("ezMove_auth")) ||
        JSON.parse(sessionStorage.getItem("ezMove_auth"));
      if (stored) {
        state.user = stored.user;
        state.token = stored.token;
        state.status = "succeeded";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;

        // 🧠 خزّن بيانات الدخول في localStorage أو sessionStorage حسب remember
        const payload = {
          user: action.payload.user,
          token: action.payload.token,
        };

        const remember = JSON.parse(localStorage.getItem("rememberMe")) ?? true;
        if (remember) {
          localStorage.setItem("ezMove_auth", JSON.stringify(payload));
        } else {
          sessionStorage.setItem("ezMove_auth", JSON.stringify(payload));
        }

        // ✅ خزن الاسم لو موجود
        if (action.payload.user?.name) {
          localStorage.setItem("username", action.payload.user.name);
        }
        // ✅ لو فيه savedItems من السيرفر → نخزنها في localStorage منفصلة
        if (action.payload.user?.savedItems) {
          const saved = JSON.parse(localStorage.getItem("savedItems")) || {};
          saved[action.payload.user.email] = action.payload.user.savedItems;
          localStorage.setItem("savedItems", JSON.stringify(saved));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
