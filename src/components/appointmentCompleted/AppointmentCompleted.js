import styles from "@/styles/components/appointmentCompleted/AppointmentCompleted.module.css";
import Clock from "../icons/Clock";
import Contact from "../icons/Contact";
import Calender from "../icons/Calender";
import AppointmentCode from "../icons/AppointmentCode";
import Total from "../icons/Total";
import Wallet from "../icons/Wallet";
import { useRouter } from "next/router";
import {
  convertUnixToHumanReadableDate,
  convertUnixToHumanReadableTime,
} from "@/utils/common";
import { useEffect } from "react";
import axiosInstance from "@/utils/axios";

const AppointmentCompleted = ({ btnText }) => {
  const router = useRouter();

  const dateFormat = (date) => {
    const dateValue = new Date(date);
    const formattedDate = dateValue.toLocaleString("en-US", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    return formattedDate;
  };
  const {
    id,
    type,
    price,
    picture,
    appointment_type,
    name,
    date,
    duration,
    total_amount,
    timezone,
    token,
    refreshToken,
    start_time,
    schedule_type,
    end_time,
  } = router.query;

  const mockData = [
    {
      id: 1,
      leftContent: "Appointment Code:",
      rightcontent: id,
      icon: <AppointmentCode />,
    },
    {
      id: 2,
      leftContent: "Date:",
      rightcontent: convertUnixToHumanReadableDate(date),
      icon: <Calender color="#777E90" />,
    },
    {
      id: 3,
      leftContent: "Total:",
      rightcontent: `$${total_amount}`,
      icon: <Total />,
    },
  ];

  async function getProfileData() {
    await axiosInstance
      .get(API.getUserProfile)
      .then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res));
      })
      .catch((err) => console.log(err));
  }

  const meetingNavigation = () => {
    if (btnText == "Join Meeting") {
      // router('/client/')
    } else if (btnText === "Go to Dashboard") {
      if (token) {
        localStorage.setItem("userToken", token);
        localStorage.setItem("userTokenRefresh", refreshToken);
        localStorage.setItem("role", "client");
        getProfileData();
        router.push(
          `/client/dashboard?token=${token}&refreshToken=${refreshToken}`
        );
      } else {
        router.push(`/client/dashboard`);
      }
    }
  };

  return (
    <div className={"d-flex flex-column "}>
      <div className={styles.header}>
        <h1>You Did It!</h1>
        <p>Your appointment has been booked! 🎉</p>

        <div className={"d-flex " + styles.appointmentWith}>
          <p>
            Appointment with &nbsp;
            <img src={"https://" + picture} /> &nbsp;
            <span>{name}</span>
          </p>
        </div>
      </div>

      <div className={"d-flex justify-content-between " + styles.section}>
        <div className="d-flex gap-3">
          <span className="d-flex align-items-center justify-content-center">
            <Clock />
          </span>
          <div>
            <span>When?</span>
            <h6>{convertUnixToHumanReadableDate(date, timezone)}</h6>
            <h6>{convertUnixToHumanReadableTime(date, timezone)}</h6>
          </div>
        </div>

        <div className="d-flex gap-3">
          <span className="d-flex align-items-center justify-content-center">
            <Contact color="#000" />
          </span>
          <div>
            <span>How Long?</span>
            <h6>{duration} mins</h6>
          </div>
        </div>
      </div>

      <div className={styles.bookingDetails}>
        <h2>Booking details</h2>

        <div>
          {mockData?.map((ele) => {
            return (
              <div
                className={"d-flex justify-content-between " + styles.details}
              >
                <div className={"d-flex gap-2 " + styles.contentContainer}>
                  <span>{ele.icon}</span>
                  <p>{ele.leftContent}</p>
                </div>
                <div className={styles.contentContainer}>
                  <h6>{ele.rightcontent}</h6>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button className={styles.btn} onClick={meetingNavigation}>
        {btnText}
      </button>
    </div>
  );
};

export default AppointmentCompleted;
