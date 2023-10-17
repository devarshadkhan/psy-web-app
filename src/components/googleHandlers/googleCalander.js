import axiosInstance from "@/utils/axios";
import { disconnect } from "echarts";
import React, { useState } from "react";

const GoogleCalander = ({ onSuccessHandler, isGoogleCalander }) => {
  const [loader, setLoader] = useState(false);
  const googleAuthHandler = async () => {
    var SCOPES = "https://www.googleapis.com/auth/calendar.events";

    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: process.env.GOOGLE_CLIENT_ID,
      scope: SCOPES,
      ux_mode: "popup",
      callback: async (response) => {
        try {
          if (!response.code) {
            return;
          }
          setLoader(true);
          axiosInstance
            .post("/users/firebase-refresh-token", {
              token: response.code,
              save: true,
            })
            .then((res) => {
              if (res) {
                setLoader(false);
                onSuccessHandler();
              }
            })
            .catch((err) => {
              setLoader(false);
            });
        } catch (error) {
          setLoader(false);
          console.log(error);
        }
      },
    });
    client.requestCode();
  };

  const disconnectGoogleSyncup = () => {
    setLoader(true);
    axiosInstance
      .post("/users/firebase-refresh-token", {
        save: false,
      })
      .then((res) => {
        setLoader(false);
        if (res) {
          onSuccessHandler();
        }
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  return (
    <button
      onClick={() =>
        isGoogleCalander ? disconnectGoogleSyncup() : googleAuthHandler()
      }
      className={"google-button w-100"}
    >
      <img
        className={"google-icon"}
        src="/images/google-calendar.svg"
        alt="google calendar connect"
      />
      <span className="google-button-text">
        {loader ? (
          <span
            className={`spinner-border me-2 spinner-border-sm`}
            role="status"
            aria-hidden="true"
          ></span>
        ) : isGoogleCalander ? (
          "Disconnect google calander"
        ) : (
          "Connect google calander"
        )}
      </span>
    </button>
  );
};

export default GoogleCalander;
