import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Index = () => {
  const router = useRouter();
  const { query } = router;

  // useEffect(()=)

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (router.pathname === "/") {
      if (role) {
        role === "client"
          ? router.push("/client/signup")
          : router.push("/professional/signup");
      } else {
        router.push("/client/signup");
      }
    } else if (
      !(
        router.pathname.includes("/client/signup") ||
        router.pathname.includes("/professional/signup")
      )
    ) {
      if (role) {
        role === "client"
          ? router.push("/client/signup")
          : router.push("/professional/signup");
      } else {
        router.push("/client/signup");
      }
    } else if (router.pathname === "client/") {
      router.push("/client/login");
    } else if (router.pathname === "professional/") {
      router.push("/professional/login");
    }
  }, []);
  return <></>;
};

export default Index;
