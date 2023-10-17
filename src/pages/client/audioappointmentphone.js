import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "@/styles/professional/meeting/Audioappointmentphone.module.css";
import {
  convertUnixToHumanReadableDate,
  convertUnixToHumanReadableTime,
} from "@/utils/common";

const videoappointment = () => {
  const [width, setWidth] = useState(0);

  const router = useRouter();
  const { meetingId, pin, date, picture } = router.query;

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const [startDate, setStartDate] = useState(new Date());
  const route = useRouter();

  const [show, setShow] = useState(false);

  return (
    <main className={styles.main}>
      <div className={"container-fluid p-0 professionalNav"}>
        <ProfessionalNavbar image="/images/avatar.png" />
      </div>

      <div className={"d-flex " + styles.bodycontainer}>
        <div className={styles.leftContainer}>
          <div>
            <h3>Appointment By Telephone</h3>
            <hr className={styles.line} />
          </div>

          <div>
            <div className={styles.startMeet}>
              <h1>Start the meeting!</h1>
              <p className={styles.para1}>
                Are you ready? If so, please follow the instructions below to
                begin your appointment.
              </p>
              <p className={styles.para2}>
                Simply dial the following phone number, with the meeting code
                and passcode to get started.
              </p>

              <div className={styles.details}>
                <div>
                  <span> Meeting ID:</span>&nbsp;<span>{meetingId} </span>
                </div>
                <div>
                  <span>Passcode:</span>&nbsp;<span>{pin}</span>
                </div>
                <div>
                  <span>Date :</span>&nbsp;
                  <span>{convertUnixToHumanReadableDate(date)}</span>
                </div>
                <div>
                  <span>Time :</span>&nbsp;
                  <span>{convertUnixToHumanReadableTime(date)}</span>
                </div>
              </div>
              <hr className={styles.line} />
              <button>Back To Dashboard</button>
            </div>
          </div>
        </div>

        <div
          style={{
            background: `url(https://${picture})`,
            backgroundRepeat: "no-repeat",
            
          }}
          className={styles.rightContainer}
        ></div>
      </div>
    </main>
  );
};

export default videoappointment;
