import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { API } from "../../utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { store } from "../store";
import { setProfileImage } from "../common/userinfo";

export const userLogin = createAsyncThunk(
  "auth/login",
  async (param, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "content-Type": "application/json",
        },
      };

      const data = await axiosInstance
        .post(API.clientLogin, param, config)
        .then((data) => {
          if (!data.status) {
            toast.error(data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else {
            store.dispatch(setProfileImage(data?.user?.picture));
            localStorage.setItem("userToken", data?.tokens?.access.token);
            localStorage.setItem(
              "userTokenRefresh",
              data?.tokens.refresh.token
            );
            localStorage.setItem("userInfo", JSON.stringify(data.user));
            localStorage.setItem("role", data.user.role);
          }
          return data;
        });

      return data;
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      return rejectWithValue(error.message);
    }
  }
);

// initialize  from local storage
const getUserToken = () => {
  if (typeof window !== "undefined") {
    return localStorage?.getItem("user");
  }
  return "";
};
const getUserTokenRefresh = () => {
  if (typeof window !== "undefined") {
    return localStorage?.getItem("userrefresh");
  }
  return "";
};
const getUserInfo = () => {
  if (typeof window !== "undefined") {
    return localStorage?.getItem("userInfo");
  }
  return "";
};
const getCleintrole = () => {
  if (typeof window !== "undefined") {
    return localStorage?.getItem("userRole");
  }
  return "";
};

const initialState = {
  loading: false,
  userInfo: getUserInfo(),
  userToken: getUserToken(),
  userTokenRefresh: getUserTokenRefresh(),
  role: getCleintrole(),
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "authLogin",
  initialState,
  reducers: {},
  extraReducers: {
    [userLogin.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [userLogin.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true; // registration successful
      state.userInfo = payload.userInfo;
      state.userToken = payload.userToken;
      state.userToken = payload.userTokenRefresh;
      state.role = payload.role;
    },
    [userLogin.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export default authSlice.reducer;
