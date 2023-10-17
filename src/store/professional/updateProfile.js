import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  formData: {
    real_name: "",
    display_name: "",
    phone: "",
    email: "",
    bio: "",
    lives_in: "",
    language: "",
    website: "",
    twitter: "",
  },
  loading: false,
  isSuccess: false,
};

export const updateProfessionalProfile = createAsyncThunk(
  "users/professionalregister",
  async (params, { getState, rejectWithValue }) => {

    try {
      const response = await axiosInstance
        .put(API.professionalUpdateProfile, params)
        .then((data) => {
          toast.success("Your Profile is Updated", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
          localStorage.setItem("userInfo",JSON.stringify(data))
          return data
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

export const updateProfessionalProfileSlice = createSlice({
  name: "updateProfile",
  initialState,
  reducers: {
    profileData: (state, { payload, type }) => {
      state.formData = { ...state.formData, ...payload };
    },
  },
  extraReducers: {
    [updateProfessionalProfile.pending]: (state) => {
      state.loading = true;
    },
    [updateProfessionalProfile.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload;
    },
    [updateProfessionalProfile.rejected]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    },
  },
});

export const { profileData } = updateProfessionalProfileSlice.actions;

export default updateProfessionalProfileSlice.reducer;
