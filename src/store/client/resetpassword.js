import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  password: "",
  loading: false,
  isSuccess: false,
};

export const resetpasswordCall = createAsyncThunk(
  "user/clientResetPassword",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance
        .post(`${API.resetPassword}?token=${params.id}`, params.body) 
        .then((data) => {
          return data
        });
      toast.success("Password reset is done", {
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

export const resetpasswordSlice = createSlice({
  name: "users/resetpassword",
  initialState,
  reducers: {
    resetpasswordData: (state, { payload, type }) => {
      state.password = payload.password;
    }, 
  },
  extraReducers: {
    [resetpasswordCall.pending]: (state) => {
      state.loading = true;
    },
    [resetpasswordCall.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload; 
    },
    [resetpasswordCall.rejected]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    },
  },
});

export const { forgotpasswordData } = resetpasswordSlice.actions;
export default resetpasswordSlice.reducer;
