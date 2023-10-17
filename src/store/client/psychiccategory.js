import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  data: [],
  loading: false,
  isSuccess: false,
};

export const psychicCategoryData = createAsyncThunk(
  "user/clientForgotPassword",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance
        .get(
          `${API.psychicCategory}type?type=${params.type}&value=${params.value}`
        )
        .then((data) => {
          return data;
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

export const explorePsychicSlice = createSlice({
  name: "users/forgotpassword",
  initialState,
  reducers: {
    category: (state, { payload, type }) => {
      state = { ...state.data, payload };
    },
  },
  extraReducers: {
    [psychicCategoryData.pending]: (state) => {
      state.loading = true;
    },
    [psychicCategoryData.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload;
    },
    [psychicCategoryData.rejected]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    },
  },
});

export const { category } = explorePsychicSlice.actions;
export default explorePsychicSlice.reducer;
