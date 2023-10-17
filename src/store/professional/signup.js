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
    state: "",
    rate: "",
    find_us: "",
    city: "",
    gender: "",
    topics: [],
    specialities: [],
    styles: [],
    abilities: [],
    password: "",
  },
  loading: false,
  isSuccess: false,
};
 
export const userSignup = createAsyncThunk(
  "users/professionalregister",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance
        .post(API.professionalregister, params)
        .then((data) => data);
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

export const ProfessionalSignUpSlice = createSlice({
  name: "ProfessionalSignup",
  initialState,
  reducers: {
    addSignupData: (state, { payload, type }) => {
      state.formData = { ...state.formData, ...payload };
    },
  },
  extraReducers: {
    [userSignup.pending]: (state) => {
      state.loading = true;
    },
    [userSignup.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload;
    },
    [userSignup.rejected]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    },
  },
});

export const { addSignupData } = ProfessionalSignUpSlice.actions;

export default ProfessionalSignUpSlice.reducer;