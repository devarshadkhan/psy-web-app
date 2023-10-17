import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const devHandler = () => {
  const router = useRouter();
  const { token, route, refreshToken } = router.query;

  async function getProfileData() {
    await axiosInstance
      .get(API.getUserProfile)
      .then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res));
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if ((token && refreshToken, route)) {
      setTimeout(() => {
        
        localStorage.setItem("userToken", token);
        localStorage.setItem("userTokenRefresh", refreshToken);
        localStorage.setItem("role", "client");
        getProfileData();
        const searchParams = new URLSearchParams(router?.query);
        //router.push(`/client/${route}?${searchParams}`);
        window.location.href = `/client/${route}?${searchParams}`
      }, 2000);
    }
  }, [route]);

  return (
    <div className="spinner-container gap-3">
      <span
        className={`spinner-border me-2 spinner-border-sm`}
        role="status"
        aria-hidden="true"
      ></span>
      Please Wait ...
    </div>
  );
};

export default devHandler;
