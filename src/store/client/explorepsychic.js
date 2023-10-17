import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    data: [],
    loading: false,
    isSuccess: false,
};

export const explorePsychicData = createAsyncThunk(
    "user/clientForgotPassword",
    async (params, { rejectWithValue }) => {
        try {
            const response = await axiosInstance
                .get(API.explorePsychic)
                .then((data) => {
                    return data
                })
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


export const explorepsychicSlice = createSlice({
    name: "users/forgotpassword",
    initialState,
    reducers: {
        explorepsychic: (state, { payload, type }) => {
            state = {...state.data, payload} 
        },
    },
    extraReducers: {
        [explorePsychicData.pending]: (state) => {
            state.loading = true;
        },
        [explorePsychicData.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.isSuccess = true;
            state.data = payload;
        },
        [explorePsychicData.rejected]: (state, { payload }) => {
            state.loading = false;
            state.isSuccess = false;
            state.errorMessage = payload;
        },
    },
})

export const { forgotpasswordData } = explorepsychicSlice.actions;
export default explorepsychicSlice.reducer;