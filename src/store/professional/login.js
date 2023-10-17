import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { store } from "../store";
import { setProfileImage } from "../common/userinfo";

const initialState = {
  formData: {
    email: "",
    password: "",
  },
  loading: false,
  isSuccess: false,
};


export const professionalLogin = createAsyncThunk(
  "user/professionalLogin",
  async (params, { rejectWithValue }) => {
    try {
      const data = await axiosInstance
        .post(API.professionallogin, params)
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
            localStorage.setItem("userToken", data?.tokens?.access?.token);
            localStorage.setItem(
              "userTokenRefresh",
              data?.tokens?.refresh?.token
            );
            localStorage.setItem("userInfo", JSON.stringify(data?.user));
            localStorage.setItem("role", data?.user?.role);
          }

          return data;
        });
      return data;
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
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

export const professionalLoginSlice = createSlice({
  name: "ProfessionalLogin",
  initialState,
  reducers: {
    professionalData: (state, { payload, type }) => {
      state.formData = { ...state.formData, ...payload };
    },
  },
  extraReducers: {
    [professionalLogin.pending]: (state) => {
      state.loading = true;
    },
    [professionalLogin.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload;
    },
    [professionalLogin.rejected]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    },
  },
});

export const { professionalData } = professionalLoginSlice.actions;
export default professionalLoginSlice.reducer;
