// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../firebase";

// 🔹 خريطة رسائل الأخطاء بصيغة واضحة لليوزر
const firebaseErrorMap = {
  "auth/user-not-found": "This email is not registered.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-email": "Invalid email format.",
  "auth/network-request-failed": "Network error. Please check your connection.",
  "auth/invalid-credential": "Incorrect email or password.",
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      const user = userCredential.user;

      return {
        user: {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || email.split("@")[0],
        },
        token: await user.getIdToken(),
      };
    } catch (err) {
      let message = "Login failed. Please try again.";

      if (err.code && firebaseErrorMap[err.code]) {
        message = firebaseErrorMap[err.code];
      } else if (err.code) {
        message = err.code.replace("auth/", "").replaceAll("-", " ");
      } else if (err.message) {
        message = err.message;
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 🔹 Fetch extra user data من LocalStorage (savedItems فقط)
export const fetchUserExtraData = createAsyncThunk(
  "auth/fetchUserExtraData",
  async (uid) => {
    const savedItemsKey = `savedItems-${uid}`;
    const savedItems = JSON.parse(localStorage.getItem(savedItemsKey)) || [];
    return { savedItems };
  }
);

const initialState = {
  user: null,
  token: null,
  status: "idle",
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
    updateSavedItems(state, action) {
      if (!state.user.savedItems) state.user.savedItems = [];
      state.user.savedItems.push(action.payload);

      const savedItemsKey = `savedItems-${state.user.uid}`;
      localStorage.setItem(
        savedItemsKey,
        JSON.stringify(state.user.savedItems)
      );
    },
    removeSavedItem(state, action) {
      if (!state.user.savedItems) return;

      state.user.savedItems = state.user.savedItems.filter(
        (item) => item.id !== action.payload
      );

      const savedItemsKey = `savedItems-${state.user.uid}`;
      localStorage.setItem(
        savedItemsKey,
        JSON.stringify(state.user.savedItems)
      );
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

        const payload = {
          user: action.payload.user,
          token: action.payload.token,
        };

        const remember = JSON.parse(localStorage.getItem("rememberMe")) ?? true;

        if (remember)
          localStorage.setItem("ezMove_auth", JSON.stringify(payload));
        else sessionStorage.setItem("ezMove_auth", JSON.stringify(payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed. Please try again.";
      })
      .addCase(fetchUserExtraData.fulfilled, (state, action) => {
        state.user = { ...state.user, savedItems: action.payload.savedItems };
      });
  },
});

export const {
  logout,
  loadUserFromStorage,
  updateSavedItems,
  removeSavedItem,
} = authSlice.actions;

export default authSlice.reducer;
