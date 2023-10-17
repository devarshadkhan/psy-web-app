import { configureStore } from "@reduxjs/toolkit";
import signUpReducer from "./professional/signup";
import clientSignupReducer from "./client/signup";
import loaderReducer from "./common/loader";
import authSlice from "./client/login";
import forgotpasswordReducer from "./client/forgotpassword";
import resetpasswordReducer from "./client/resetpassword";
import professionalLoginReducer from "./professional/login";
import updateProfileReducer from "./client/updateProfile";
import updateProfessionalProfileReducer from "./professional/updateProfile";
import explorepsychicReducer from "./client/explorepsychic";
import psychicCategoryReducer from "./client/psychiccategory";
import createScheduleReducer from "./client/createSchedule";
import updatePassword from "./client/updatePassword";
import profileImageReducer from "./common/userinfo";

export const store = configureStore({
  reducer: {
    signup: signUpReducer,
    clientSignup: clientSignupReducer,
    forgotpassword: forgotpasswordReducer,
    profileImage: profileImageReducer,
    loader: loaderReducer,
    login: authSlice,
    resetpassword: resetpasswordReducer,
    professionalLogin: professionalLoginReducer,
    clientUpdateProfile: updateProfileReducer,
    professionalProfile: updateProfessionalProfileReducer,
    explorePsychic: explorepsychicReducer,
    psychicCategory: psychicCategoryReducer,
    createSchedule: createScheduleReducer,
    updatePassword: updatePassword,
  },
});
