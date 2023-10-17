import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
const Protected = ({ children }) => {
  const router = useRouter();
  const { token } = router.query;
  const routeCheck = useCallback(() => {
    const tokenValue = localStorage.getItem("userToken");
    const role = localStorage.getItem("role");
    if (router.asPath.includes("professional")) {
      if (tokenValue) {
        if (role === "client") {
          router.push("/client/dashboard");
        }
        if (
          router.asPath.includes("login") ||
          router.asPath.includes("signup") ||
          router.asPath.includes("resetpassword") ||
          router.asPath.includes("forgotpassword") ||
          router.asPath.includes("thankyou") ||
          (router.asPath.includes("/clients") && role === "professional") ||
          router.asPath === "/professional"
        ) {
          router.push("/professional/dashboard");
        }
      } else {
        if (
          !(
            router.asPath.includes("login") ||
            router.asPath.includes("signup") ||
            router.asPath.includes("resetpassword") ||
            router.asPath.includes("forgotpassword") ||
            router.asPath.includes("thankyou")
          )
        ) {
          router.push("/professional/login");
        }
      }
    } else if (router.asPath.includes("client")) {
      if (tokenValue) {
        if (role === "professional") {
          router.push("/professional/dashboard");
        }
        if (
          router.asPath.includes("login") ||
          router.asPath.includes("signup") ||
          router.asPath.includes("resetpassword") ||
          router.asPath.includes("forgotpassword") ||
          router.asPath.includes("thankyou") ||
          router.asPath === "/client"
        ) {
          router.push("/client/dashboard");
        }
      } else {
        if (
          !(
            router.asPath.includes("login") ||
            router.asPath.includes("signup") ||
            router.asPath.includes("resetpassword") ||
            router.asPath.includes("forgotpassword") ||
            router.asPath.includes("thankyou") ||
            router.asPath.includes("appointment-successful") ||
            router.asPath.includes("/dashboard?token=") ||
            router.asPath.includes("/dashboard")
          )
        ) {
          router.push("/client/login");
        }
      }
    }
  }, [router.asPath]);
  useEffect(() => {
    routeCheck();
  }, [routeCheck, token]);

  return children;
};

export default Protected;
