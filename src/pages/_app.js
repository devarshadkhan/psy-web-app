import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import "animate.css";
import "@/styles/popup.module.css";
import { store } from "@/store/store";
import { Provider, useSelector } from "react-redux";
import Protected from "./protected";
import "react-toastify/dist/ReactToastify.css";
import "react-tabs/style/react-tabs.css";
import Loader from "@/components/loader/Loader";
import React, { useEffect } from "react";
import {
  fetchToken,
  firebaseRealtimeDatabaseListener,
  firebseInit,
  getDbdata,
  onMessageListener,
  realtimeDbListner,
} from "@/utils/firebase";
import Swal from "sweetalert2";
import loader from "@/store/common/loader";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
// import PopUp from "@/components/popUp/PopUp";

var swalInteractor;

export default function App({ Component, pageProps }) {
  // const isLoading = useSelector((state) => state.loader);
  const router = useRouter();
  const [notification, setNotification] = React.useState(null);

  useEffect(() => {
    setTimeout(() => {
      if ("serviceWorker" in navigator) {
        const firebaseConfig = encodeURIComponent(
          JSON.stringify({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
            messagingSenderId:
              process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
            measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT,
          })
        );

        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register(
              `/firebase-messaging-sw.js?firebaseConfig=${firebaseConfig}`
            )
            .then((registration) => {
              console.log("Service Worker registered:", registration);
            })
            .catch((error) => {
              console.log("Service Worker registration failed:", error);
            });
        });
      }
    }, 2000);
  }, []);

  const fbListener = async () => {
    firebseInit()
      .then((res) => {
        if (res) {
          fetchToken().then(() => {
            onMessageListener()
              .then((payload) => {
                new Notification(payload.notification.title, {
                  body: payload.notification.body,
                  icon: payload.notification.image,
                });
                fbListener();
              })
              .catch((err) => {
                console.log("failed: ", err);
                fbListener();
              });
          });
        }
      })
      .catch((err) => {
        console.log("ERROR", err);
        console.log("Something is wrong ");
        fbListener();
      });
  };

  useEffect(() => {
    setTimeout(() => {
      fbListener();
    }, 500);

    listenToRealtimeDatabase();
  }, []);

  const listenToRealtimeDatabase = async () => {
    const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    firebseInit().then((response) => {
      firebaseRealtimeDatabaseListener(
        userInfo?.id,
        "/nowMeetData",
        (nowMeetData) => {
          setNotification(nowMeetData);
          console.log(nowMeetData, userInfo?.id);
        }
      );
    });
  };

  const triggerMeetingInteraction = async () => {
    try {
      const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      const isClient = window.location.pathname.split("/")[1] === "client";
      console.log("NOTIFICATION DATA :::::::::::::::::::::::::::::::", {
        notification: userInfo.id,
      });

      //when meeting does not have any response yet. It keeps showing the modal.
      if (notification?.status == -1) {
        Swal.update({
          customClass: undefined,
        });
        Swal.close();
        swalInteractor = null;
      }
      if (notification?.status == 0) {
        setNotification(notification);
        const message = isClient
          ? "Waiting for psychics to join..."
          : "You have been requested for a meeting right now!";
        const swalOptions = {
          title: message,
          allowOutsideClick: false,
          imageUrl: notification.callerPicture,
          imageWidth: "120px",
          imageHeight: "120px",
          showDenyButton: isClient ? false : true,
          showConfirmButton: isClient ? false : true,
          denyButtonText: isClient ? null : "Reject",
          confirmButtonText: isClient ? null : "Accept",
        };
        if (!isClient) {
          swalOptions.customClass = {
            title: "popup-text",
            image: "imageClass-popup",
            confirmButton: "popup-confirm-button",
            denyButton: "popup-confirm-button",
          };
        }
        if (isClient) {
          swalOptions.customClass = {
            title: "popup-text",
            image: "imageClass-popup",
          };
        }
        swalInteractor = await Swal.fire(swalOptions);

        $(".swal2-modal").css("overflow", "");
        console.log(swalInteractor);
        if (swalInteractor) {
          if (swalInteractor.isConfirmed) {
            const startMeet = await axiosInstance.post(
              `/schedules/now/start-appointment/${notification.scheduleId}`
            );
            console.log(startMeet.data);
            axiosInstance
              .post(
                `${API.usersUpdateConferenceId}/${userInfo.id}/${notification.meetingId}`
              )
              .then(() => {
                router.push(
                  `/professional/meeting/${notification.meetingType}appointment/${notification.meetingId}?duration=${notification.duration}&first_name=${userInfo.first_name}&scedule_id=${notification.scheduleId}`
                );
              });
            Swal.update({
              customClass: undefined,
            });
          } else if (swalInteractor.isDenied) {
            const cancelMeet = await axiosInstance.put(
              `/schedules/cancel/${notification.scheduleId}`
            );
            console.log(cancelMeet.data);
            Swal.update({
              customClass: undefined,
            });
          }
        }

        // .then(async (result) => {
        //   console.log(result);
        //   if (result.isConfirmed) {

        //     if (isClient) {
        //       loader(true);
        //     }
        //   } else if (result.isDenied) {
        //     if (!isClient) {
        //     }
        //   }
        // });
      }
      //when meeting is accepted.
      else if (notification?.status == 1) {
        // console.log("------------------------------------- start log-------------")
        console.log("swaaaaaaaaaaaaaaaaaarlllllll interator;::::::::::", Swal);
        Swal.update({
          customClass: undefined,
        });
        Swal.close();
        // console.log("swaaaaaaaaaaaaaaaaaarlllllll interator;::::::::::", swalInteractor);
        // console.log("------------------------------------- end log-------------")

        if (isClient) {
          axiosInstance
            .post(
              `${API.usersUpdateConferenceId}/${userInfo.id}/${notification.meetingId}`
            )
            .then(() => {
              router.push(
                `/client/meeting/${notification.meetingType}appointment/${notification.meetingId}?duration=${notification.duration}&first_name=${userInfo.first_name}&scedule_id=${notification.scheduleId}`
              );
            });
        } else {
          axiosInstance
            .post(
              `${API.usersUpdateConferenceId}/${userInfo.id}/${notification.meetingId}`
            )
            .then(() => {
              router.push(
                `/professional/meeting/${notification.meetingType}appointment/${notification.meetingId}?duration=${notification.duration}&first_name=${userInfo.first_name}&scedule_id=${notification.scheduleId}`
              );
            });
        }
        swalInteractor = null;
      }
    } catch (error) {
      Swal.update({
        customClass: undefined,
      });
      swalInteractor = null;
      console.log(error);
    }
  };
  console.log("NOTIFICATION DATA :::::::::::::::::::::::::::::::", {
    notification,
  });
  useEffect(() => {
    if (notification) {
      triggerMeetingInteraction();
    }
  }, [notification]);

  return (
    <Provider store={store}>
      <Loader />
      <Protected>
        <Component {...pageProps} />
      </Protected>
    </Provider>
  );
  // }
}
