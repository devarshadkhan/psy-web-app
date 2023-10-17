import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  formData: {
    first_name: "",
    last_name: "",
    dob: "",
    email: "",
    gender: "",
    pincode: "",
    password: "",
    issues: "",
    other_issues: "",
  },
  loading: false,
  isSuccess: false,
};

export const userClientSignup = createAsyncThunk(
  "users/professionalregister",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance
        .post(API.clientRegister, params)
        .then((data) => data);
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

export const ClientSignUpSlice = createSlice({
  name: "ClientSignup",
  initialState,
  reducers: {
    addClientSignupData: (state, { payload, type }) => {
      state.formData = { ...state.formData, ...payload };
    },
  },
  extraReducers: {
    [userClientSignup.pending]: (state) => {
      state.loading = true;
    },
    [userClientSignup.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload;
    },
    [userClientSignup.rejected]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    },
  },
});

export const { addClientSignupData } = ClientSignUpSlice.actions;

export default ClientSignUpSlice.reducer;
