import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { store } from "@/store/store";
import { useEffect } from "react";
import { setLoader } from "@/store/common/loader";

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!(
        config.url.includes("users/get-my-profile") ||
        config.url.includes("wallet/addMoney/details")) &&
      config.method === "get"
    ) {
      store.dispatch(setLoader(true));
    }

    return config;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      store.dispatch(setLoader(true));
      // Handle specific status codes
      if (status === 403 || status === 429 || status === 500) {
        // Handle 403 Forbidden
        // Example: Redirect to a login page or show an access denied message
        toast.error("Something went wrong, Please try again later", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    store.dispatch(setLoader(false));
    return response.data;
  },
  (error) => {
    store.dispatch(setLoader(false));
    console.log(error?.response?.data);
    if (error?.response?.data?.status === false) {
      // Log out the user or perform any other logout logic
      logoutUser();
    } else if (
      error?.response?.data?.code === 401 &&
      error?.response?.data?.message === "Please authenticate"
    ) {
      console.log(error?.res);
      logoutUser();
    }

    // loader.dispatch(loader(true));
    return Promise.reject(error?.response?.data);
  }
);

const logoutUser = () => {
  localStorage.clear();
  if (window.location.pathname.includes("client")) {
    window.location.href = "/client/login";
  } else {
    window.location.href = "/professional/login";
  }
};

export default axiosInstance;
