import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  password: "",
  loading: false,
  isSuccess: false,
};

export const passwordUpdated = createAsyncThunk(
  "user/updatePassword",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance
        .post(`${API.updatePassowrd}/${params.id}?`, params.body)
        .then((data) => data);
      toast.success("Password Updated", {
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

export const updatePasswordSlice = createSlice({
  name: "users/updatePassword",
  initialState,
  reducers: {
    resetpasswordData: (state, { payload, type }) => {
      state.password = payload.password;
    }, 
  },
  extraReducers: {
    [passwordUpdated.pending]: (state) => {
      state.loading = true;
    },
    [passwordUpdated.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload; 
    },
    [passwordUpdated.rejected]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    },
  },
});

export const { updatedPassword } = updatePasswordSlice.actions;
export default updatePasswordSlice.reducer;
