import styles from "@/styles/components/appointmentReason/AppointmentReason.module.css";
import Dot from "@/components/icons/Dot";
import Focus from "@/components/icons/Focus";
import Options from "@/components/icons/Options";
import Email from "../icons/Email";
import Profile from "../icons/Profile";
import { useState, useEffect } from "react";
import {
  convertUnixToHumanReadableDate,
  convertUnixToHumanReadableTime,
  getTimeDifferenceInMinutes,
  isCurrentTimeInRange,
  isTimeGapMoreThan10Minutes,
} from "@/utils/common";
import { useRouter } from "next/router";
import { AiFillStar } from "react-icons/ai";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import { BsFillCameraVideoFill, BsHeadphones } from "react-icons/bs";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function AppointmentReason({
  first_name,
  last_name,
  appointment_type,
  time,
  id,
  hideHourRate,
  hourlyRate,
  paid,
  timming,
  appointmentHistory,
  image,
  endTime,
  type,
  amount_paid,
  meetingId,
  meeting_type,
  clientId,
  isPsychic = false,
  meetStatus,
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [meetingTime, setMeetingtime] = useState(new Date());

  useEffect(() => {
    setMeetingtime(
      `${convertUnixToHumanReadableDate(
        timming
      )},  ${convertUnixToHumanReadableTime(timming)}`
    );
  }, []);

  const handleDialogBox = () => {
    setOpen(!open);
  };

  const handleClickOutSide = (e) => {
    const concernedElement = document.getElementById("box");
    if (!concernedElement?.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleReview = () => {
    if (router.asPath.includes("professional")) {
      router.push(
        `/professional/meeting/callreview?user=${clientId}&name=${first_name}&scedule_id=${id}`
      );
    } else {
      router.push(
        `/client/meeting/callreview?user=${clientId}&name=${first_name}&scedule_id=${id}`
      );
    }
  };

  const handleClick = (id) => {
    if (router.asPath.includes("professional")) {
      router.push(`/professional/profile/${id}?resource_role=client`);
    } else {
      router.push(
        `/client/dashboard/explorepsychicdetails/${id}?type=${appointment_type}&&last_route=${"appointment history"}`
      );
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutSide);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [open]);

  const handleClicked = (
    meetingId,
    first_name,
    meeting_type,
    schedule_id,
    duration
  ) => {
    if (meeting_type === "video") {
      router.push(
        `/professional/meeting/videoappointment/${meetingId}?duration=${duration}&first_name=${first_name}&scedule_id=${schedule_id}`
      );
    } else {
      router.push(
        `/professional/meeting/audioappointment/${meetingId}?scedule_id=${schedule_id}&first_name=${first_name}&duration=${duration}`
      );
    }
  };

  return (
    <div
      className={"d-flex justify-content-between " + styles.appointmentWrapper}
    >
      <div>
        <div className={styles.appointmentBox}>
          <div
            onClick={() => handleClick(clientId)}
            className="d-flex cursor-pointer gap-3 align-items-center"
          >
            <div className=" mr-3">
              <img src={image} className={styles.image} />
            </div>
            <div className={"col-sm-10 " + styles.appointmentHeader}>
              <div className="row">
                <h5 className={styles.appName}>
                  {first_name} {last_name}
                </h5>
              </div>
              <div className={"d-flex gap-3 mt-2 "}>
                <div className="d-flex gap-1 align-items-center">
                  <span>
                    <Focus />
                  </span>
                  <span className={styles.greyText + " " + "text-normal"}>
                    {appointment_type}
                  </span>
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <span>
                    <Dot />
                  </span>
                  <span
                    className={styles.greyText}
                  >{`${" "}${meetingTime}`}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.MWContainer}>
            <div className="row mt-3">
              {/* <h5 className={styles.appReason}>Reason for appointment</h5> */}
              {/* <p className={styles.appointmentReason}>{appointment_type}</p> */}
            </div>
            <div className={"d-flex gap-4 " + styles.appInfoContainer}>
              <div className={styles.appBox}>
                <h6>{`${parseFloat(time).toFixed(0)} min`}</h6>
                <p className={styles.appointmentInfo}>Total time</p>
              </div>
              {!hideHourRate && (
                <div className={styles.appBox}>
                  <h6>{`$${
                    hourlyRate ? parseFloat(hourlyRate).toFixed() : 0
                  }/min.`}</h6>
                  <p className={styles.appointmentInfo}>Minutes rate</p>
                </div>
              )}
              <div className={styles.appBox}>
                <h6>{`$${
                  paid ? parseFloat(paid).toFixed(1) : amount_paid
                }`}</h6>
                <p className={styles.appointmentInfo}>
                  {hideHourRate
                    ? "Rate of this meeting"
                    : "Total you have paid this psychic."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* status 0-pending 1-completed 2- canceled */}

      {router.asPath.includes("appointmentcompleted") && (
        <>
          {meetStatus === 1 && (
            <span className={styles.meeting_complete}>Completed</span>
          )}
          {meetStatus === 2 && (
            <span className={styles.meeting_canceled}>Cancelled</span>
          )}
        </>
      )}
      {false &&
        {
          /* : (
        <>
          {meetStatus === 1 ? (
            <span className={styles.meeting_complete}>Completed</span>
          ) : (
            <span className={styles.meeting_canceled}>Cancelled</span>
          )}
        </>
      ) */
        }}

      {router.asPath.includes("appointment-history") && (
        <>
          {meetStatus === 1 && (
            <span className={styles.meeting_complete}>Completed</span>
          )}
          {meetStatus === 2 && (
            <span className={styles.meeting_canceled}>Cancelled</span>
          )}
        </>
      )}

      {router.asPath.includes("appointmentpending") && (
        <div className="gap-2 d-flex flex-col">
          <button
            disabled={!isCurrentTimeInRange(timming, endTime)}
            onClick={async () => {
              if (typeof window !== "undefined") {
                let item = await JSON.parse(localStorage.getItem("userInfo"));

                axiosInstance
                  .post(
                    `${API.usersUpdateConferenceId}/${item.id}/${meetingId}`
                  )
                  .then(() => {
                    handleClicked(
                      meetingId,
                      first_name,
                      meeting_type,
                      id,
                      time * 60
                    );
                  });
              }
            }}
            className={`${styles.optionBtn} ${styles.optionBtn2} ${
              !isCurrentTimeInRange(timming, endTime) && "button-diabled"
            }   align-items-center d-flex gap-3`}
          >
            {/* <div>
            <Profile color="#fff" />
          </div> */}
            <div className="d-flex font-14px align-items-center gap-2">
              {meeting_type === "video" ? (
                <BsFillCameraVideoFill />
              ) : (
                <BsHeadphones />
              )}{" "}
              Join meeting{" "}
            </div>
          </button>
          {getTimeDifferenceInMinutes(timming) && (
            <div className={styles.textC}>
              <button
                onClick={async () => {
                  if (typeof window !== "undefined") {
                    Swal.fire({
                      title: "Are you sure you want to cancel this meeting?",
                      text: "Your amount will be refunded to you",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes",
                      cancelButtonText : "No"
                    }).then((result) => {
                      if (result.isConfirmed) {
                        axiosInstance
                          .put(`/schedules/cancel/${id}`)
                          .then((res) => {
                            appointmentHistory();
                          })
                          .catch((err) => {
                            toast.error(err.message, {
                              position: "top-right",
                              autoClose: 5000,
                              hideProgressBar: true,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "dark",
                            });
                          });
                      }
                    });
                  }
                }}
                className={`${styles.optionBtn} ${styles.optionBtn2} 
                                                   align-items-center ms-auto d-flex gap-3`}
              >
                <div className="d-flex font-14px align-items-center gap-2">
                  Cancel Meeting{" "}
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* {!router.asPath.includes("appointmentpending") && (
        <span className={styles.menu} onClick={handleReview}>
          Add Review <AiFillStar />
        </span>
      )} */}

      {/* {open && (
        <div
          id="box"
          className={isPsychic ? styles.optionBoxpsychic : styles.optionBox}
        >
          {/* {!isPsychic && (
            <button
              className={`${styles.optionBtn} ${styles.optionBtn1} d-flex gap-3 `}
            >
              <div>
                <Email />
              </div>
              <div>Message Psychic</div>
            </button>
          )} */}
      {/* </div>
      )} */}
    </div>
  );
}

export default AppointmentReason;
