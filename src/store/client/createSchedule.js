import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  data: [],
  loading: false,
  isSuccess: false,
};

export const createSchedule = createAsyncThunk(
  "user/clientForgotPassword",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance
        .post(API.createSchedules, params)
        .then((data) => {
          return data;
        });
      toast.success("Appointment Sceduled SuccessFully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return response;
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

export const createscheduleSlice = createSlice({
  name: "users/schedule",
  initialState,
  reducers: {
    createScheduleData: (state, { payload, type }) => {
      state = { ...state.data, payload };
    },
  },
  extraReducers: {
    [createSchedule.pending]: (state) => {
      state.loading = true;
    },
    [createSchedule.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload;
    },
    [createSchedule.rejected]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    },
  },
});

export const { forgotpasswordData } = createscheduleSlice.actions;
export default createscheduleSlice.reducer;
