import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  data: [],
  loading: false,
  isSuccess: false,
};

export const walletDetailsFetch = createAsyncThunk(
  "user/walletdetails",
  async (params, { rejectWithValue }) => {
    let filterByParam = `/wallet/details`;
    if (params) {
      filterByParam += `?sort=${params}`;
    }
    try {
      const response = await axiosInstance.get(filterByParam).then((data) => {
        return data;
      });
      return response;
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 1000,
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

export const walletDetailsSlice = createSlice({
  name: "users/walletdetails",
  initialState,
  extraReducers: {
    [walletDetailsFetch.pending]: (state) => {
      state.loading = true;
    },
    [walletDetailsFetch.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload;
    },
    [walletDetailsFetch.rejected]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    },
  },
});

export default walletDetailsSlice.reducer;
