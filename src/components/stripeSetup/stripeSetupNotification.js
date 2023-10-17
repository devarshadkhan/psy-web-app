import React, { useEffect } from "react";
import styles from "@/styles/components/verifyEmail/VerifyEmail.module.css";
import { ToastContainer, toast } from "react-toastify";

const StripeSetupNotification = () => {
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
          Your payout account is not setup yet. Please
          <button onClick={requestForStripeConnectAccount}>
            click here
          </button>{" "}
          to setup your payout account.
        </p>
      </div>
    </>
  );
};

export default StripeSetupNotification;
