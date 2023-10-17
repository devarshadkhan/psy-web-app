import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  email: "",
  loading: false,
  isSuccess: false,
};

export const forgotpasswordCall = createAsyncThunk(
  "user/clientForgotPassword",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance 
        .post(API.clientForgotPassword, params)
        .then((data) => data);
      toast.success("Check your mail", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return response.data;
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

export const forgotpasswordSlice = createSlice({
  name: "users/forgotpassword",
  initialState,
  reducers: {
    forgotpasswordData: (state, { payload, type }) => {
      state.email = payload.email;
    },
  },
  extraReducers: {
    [forgotpasswordCall.pending]: (state) => {
      state.loading = true;
    },
    [forgotpasswordCall.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload;
    },
    [forgotpasswordCall.rejected]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    },
  },
});

export const { forgotpasswordData } = forgotpasswordSlice.actions;
export default forgotpasswordSlice.reducer;
