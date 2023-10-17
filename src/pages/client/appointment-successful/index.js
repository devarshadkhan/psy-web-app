import UserNavbar from "@/components/navbars/UserNavbar";
import Head from "next/head";
import styles from "@/styles/client/future-appointment-successful/FutureAppSuccessful.module.css";
import CompleteAppointment from "@/components/appointmentCompleted/AppointmentCompleted";
import { useRouter } from "next/router";
import React from "react";
import Swal from "sweetalert2";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import {
  fetchToken,
  firebaseRealtimeDatabaseListener,
  firebseInit,
  getDbdata,
  onMessageListener,
  realtimeDbListner,
} from "@/utils/firebase";

var swalInteractor;

const Index = () => {
  const router = useRouter();
  const { schedule_type, token } = router.query;
  const [notification, setNotification] = React.useState(null);

  React.useEffect(() => {
    // listenToRealtimeDatabase();
    const isAppointmentSuccess =  localStorage.getItem('isAppointmentSuccess')
    console.log(isAppointmentSuccess);
    if(schedule_type === 'now' && token && (isAppointmentSuccess == undefined ||  !isAppointmentSuccess)) {
      setTimeout(() => {
        localStorage.setItem('isAppointmentSuccess', true)
        window.location.reload();
      }, 3000);
      
    }
  }, [schedule_type, token])



  // if (schedule_type === "now") {
  //   const isClient = window.location.pathname.split("/")[1] === "client";
  //   const message = isClient
  //     ? "Waiting for psychics to join..."
  //     : "You have been requested for a meeting right now!";
  //   const swalOptions = {
  //     title: message,
  //     allowOutsideClick: false,
  //     imageUrl: 'https://psychica-bucket.nyc3.cdn.digitaloceanspaces.com/avatar.png',
  //     imageWidth: "120px",
  //     imageHeight: "120px",
  //     showDenyButton: isClient ? false : true,
  //     showConfirmButton: isClient ? false : true,
  //     denyButtonText: isClient ? null : "Reject",
  //     confirmButtonText: isClient ? null : "Accept",
  //   };
  //   if (!isClient) {
  //     swalOptions.customClass = {
  //       title: "popup-text",
  //       image: "imageClass-popup",
  //       confirmButton: "popup-confirm-button",
  //       denyButton: "popup-confirm-button",
  //     };
  //   }
  //   if (isClient) {
  //     swalOptions.customClass = {
  //       title: "popup-text",
  //       image: "imageClass-popup",
  //     };
  //   }
  //   Swal.fire(swalOptions);
  // }

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
  
  React.useEffect(() => {
    if (notification) {
      triggerMeetingInteraction();
    }
  }, [notification]);

  return (
    <>
      <Head>
        <title>Appointment-successful | Psychix</title>
        <meta name="description" content="Appointment-successful | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={"container-fluid p-0 "}>
          <div>
            <UserNavbar image="/images/avatar.png" />
          </div>

          <div>
            <div className={"d-flex " + styles.wrapper}>
              <div className={"col-lg-6 col-md-12 col-sm-12 "}>
                <CompleteAppointment btnText="Go to Dashboard" />
              </div>

              <div className={"col-lg-6 col-md-12 col-sm-12 "}>
                <div className={styles.imgWrapper}>
                  <img
                    src="/images/appointment.png"
                    className={styles.BGImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;
