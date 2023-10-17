import React, { useState, useEffect } from "react";
import styles from "@/styles/components/verifyEmail/VerifyEmail.module.css";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import { API } from "@/utils/apiendpoints";

const VerifyEmail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLinkDisabled, setIsLinkDisabled] = useState(false);
  const [timer, setTimer] = useState(59);

  useEffect(() => {
    let intervalId;

    if (isLinkDisabled) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isLinkDisabled]);

  const sendVerificationEmail = async () => {
    if (!isLinkDisabled) {
      setIsLinkDisabled(true);
      setTimer(59);
      axiosInstance
        .post(API.resendVerificationMail)
        .then((res) => {
          toast.success(res?.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (timer === 0) {
      setIsLinkDisabled(false);
    }
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className={styles.verifyEmail}>
        <p>
          To continue, please verify your email address. If you have not
          received a verification email{" "}
          <button onClick={sendVerificationEmail} disabled={isLinkDisabled}>
            click here
          </button>{" "}
          to resend. &nbsp; &nbsp; &nbsp; &nbsp;
          {isLinkDisabled && `${formatTime(timer)}`}
        </p>
      </div>
    </>
  );
};

export default VerifyEmail;
