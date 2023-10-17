import UserNavbar from "@/components/navbars/UserNavbar";
import Head from "next/head";
import styles from "@/styles/client/appointment/Appointment.module.css";
import AppointmentCard from "@/components/appointmentCard/AppointmentCard";
import Career from "@/components/icons/Career";
import Dot from "@/components/icons/Dot";
import Options from "@/components/icons/Options";
import Book from "@/components/icons/Book";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { Tooltip as ReactTooltip } from "react-tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import classNames from "classnames";
import Slider from "react-slick";
import { Swiper, SwiperSlide } from "swiper/react";
import moment from "moment";
// import Swiper, { Navigation, Pagination } from 'swiper';
import SwiperCore, {
  Navigation,
  Pagination,
  Autoplay,
  Virtual,
} from "swiper/core";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
  convertUnixToHumanReadable,
  getTimeDifferenceInMinutes,
  isCurrentTimeInRange,
  isTimeGapMoreThan10Minutes,
} from "@/utils/common";
import AppVideo from "@/components/icons/AppVideo";
import { BsFillCameraVideoFill, BsHeadphones } from "react-icons/bs";
import NoDataMsg from "@/components/noDataMsg/NoDataMsg";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';

SwiperCore.use([Navigation, Pagination, Autoplay, Virtual]);

function Index() {
  const router = useRouter();

  const [todayApp, setTodayApp] = useState();
  const [appHistory, setAppHistory] = useState();
  const [todayAppointment, setTodayAppointment] = useState([]);
  const [futureAppointment, setFutureAppointment] = useState([]);
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState(null);
  const appointmentHistory = async () => {
    setLoader(true);
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
      setUserData(item);
    }
    axiosInstance
      .get(`${API.appointments}`)
      .then((res) => {
        setLoader(false);
        setTodayApp(res);
        setTodayAppointment(res[res.length - 1].appointmentsToday);
        setFutureAppointment(res[res.length - 1].futureAppointments);
        setAppHistory(res.slice(0, res.length - 1));
      })
      .catch((err) => {
        console.warn(err);
      });
  };
  useEffect(() => {
    appointmentHistory();
  }, []);

  const handleClicked = async (
    meetingId,
    first_name,
    meeting_type,
    schedule_id,
    duration
  ) => {
    if (typeof window !== "undefined") {
      let item = await JSON.parse(localStorage.getItem("userInfo"));

      axiosInstance
        .post(`${API.usersUpdateConferenceId}/${item.id}/${meetingId}`)
        .then(() => {
          if (meeting_type === "video") {
            router.push(
              `/client/meeting/videoappointment/${meetingId}?duration=${duration}&first_name=${first_name}&scedule_id=${schedule_id}`
            );
          } else {
            router.push(
              `/client/meeting/audioappointment/${meetingId}?scedule_id=${schedule_id}&first_name=${first_name}&duration=${duration}`
            );
          }
        });
    }
  };

  return (
    <>
      <Head>
        <title>Appointments | Psychix</title>
        <meta name="description" content="Appointments | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={"container-fluid p-0 "}>
          <div>
            <UserNavbar image="/images/avatar.png" />
          </div>

          {todayApp?.length ? (
            <>
              {" "}
              <div className={"d-flex flex-wrap " + styles.appointmentMC}>
                <div className={"col-lg-9 col-md-12 col-sm-12"}>
                  <div className={styles.appointmentInnerC}>
                    <div className={"mt-5 " + styles.AHSection}>
                      <div
                        className={
                          "d-flex justify-content-between align-items-center " +
                          styles.historyHeading
                        }
                      >
                        <h2>Appointment pending</h2>
                        <button
                          onClick={() =>
                            router.push("/client/appointment-history")
                          }
                          className="btn "
                        >
                          View Entire Appointment History
                        </button>
                      </div>
                      <hr />

                      {loader ? (
                        <>
                          {/* <div className="text-center">
                        <span
                          className={`spinner-border me-2 spinner-border-sm `}
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </div> */}
                        </>
                      ) : (
                        <>
                          {appHistory?.length === 0 ? (
                            <h2 className={styles.nodata}>
                              <NoDataMsg
                                message="You do not have an appointment"
                                img="/images/loadImg/calender.svg"
                              />
                            </h2>
                          ) : (
                            <>
                              <div className={styles.detailsContainer}>
                                {appHistory
                                  ? appHistory.map((ele) => {
                                      return (
                                        <div
                                          key={ele?.id}
                                          className={
                                            // "d-flex justify-content-between border-bottom " +
                                            "d-flex border-bottom " +
                                            styles.detailsW
                                          }
                                        >
                                          {/* <div className={"d-flex " + styles.detailsIC}> */}
                                          <div className={styles.sec1}>
                                            <h6>
                                              Appointment with{" "}
                                              {ele?.professional?.nickName
                                                ?.charAt()
                                                .toUpperCase() +
                                                ele?.professional?.nickName?.slice(
                                                  1
                                                )}{" "}
                                              {/* {ele?.professional?.last_name} */}
                                            </h6>
                                            <div
                                              className={
                                                "d-flex gap-2 " +
                                                styles.detailsC
                                              }
                                            >
                                              <div className="d-flex gap-1">
                                                <span
                                                  className={styles.spanIcon}
                                                >
                                                  <Career />
                                                </span>
                                                <span
                                                  className={
                                                    styles.ASpan +
                                                    " " +
                                                    "text-normal"
                                                  }
                                                >
                                                  {/* {ele.professional.topics[0]} */}
                                                  {/* {index !== 0 && ","} */}
                                                  {ele.appointment_type}
                                                </span>
                                                {/* {ele?.professional?.topics.map(
                                      (tools, index) => {
                                        return (
                                          <>
                                            <span className={styles.ASpan}>
                                              {ele.professional.topics[0]}
                                              {index !== 0 && ","}
                                              {tools}
                                            </span>
                                          </>
                                        );
                                      }
                                    )} */}
                                              </div>
                                              <div className="d-flex gap-2">
                                                <span
                                                  className={styles.spanIcon}
                                                >
                                                  <Dot />
                                                </span>
                                                <span className={styles.ASpan}>
                                                  {convertUnixToHumanReadable(
                                                    ele?.start_date,
                                                    "MM/DD/YY"
                                                  )}
                                                </span>
                                              </div>
                                              {/* <div className="d-flex gap-2">
                                        <span className={styles.spanIcon}>
                                          <Dot />
                                        </span>
                                        <span className={styles.ASpan}>
                                          {" "}
                        
                                          {convertUnixToHumanReadable(
                                            ele?.start_time,
                                            "HH:mm AM/PM"
                                          )}
                                        </span>
                                      </div> */}
                                            </div>
                                          </div>

                                          <div
                                            className={classNames(
                                              "d-flex " + styles.sec
                                            )}
                                          >
                                            <div
                                              className={
                                                "d-flex flex-column " +
                                                styles.textC
                                              }
                                            >
                                              <span className={styles.ASpan}>
                                                Type
                                              </span>

                                              {/* <OverlayTrigger
                                    key="top"
                                    placement="top"
                                    overlay={
                                      <Tooltip id="tooltip-disabled">
                                        {ele?.appointment_type}
                                      </Tooltip>
                                    }
                                    
                                   
                                  >
                                    <h6 className="cursor-pointer">
                                      {" "}
                                      {ele?.appointment_type
                                        ?.toString()
                                        .substr(0, 6)}
                                      ...
                                    </h6>
                                  </OverlayTrigger> */}
                                              <h6
                                                className="cursor-pointer 
                                                text-normal"
                                              >
                                                {" "}
                                                {/* {ele?.appointment_type
                                          ?.toString()
                                          .substr(0, 6)}
                                        ... */}
                                                {ele?.appointment_type}
                                              </h6>
                                            </div>
                                            <div
                                              className={
                                                "d-flex flex-column " +
                                                styles.textC
                                              }
                                            >
                                              <span className={styles.ASpan}>
                                                Duration
                                              </span>
                                              <h6>{ele?.duration} min</h6>
                                            </div>
                                            <div
                                              className={
                                                "d-flex flex-column " +
                                                styles.textC
                                              }
                                            >
                                              <span className={styles.ASpan}>
                                                Status
                                              </span>
                                              {/* <h6>{ele?.status}</h6> */}
                                              <h6>Paid</h6>
                                            </div>
                                          </div>
                                          {getTimeDifferenceInMinutes(
                                            ele?.start_time,
                                            userData?.timezone
                                          ) ? (
                                            <div className={styles.textC}>
                                              <button
                                                onClick={async () => {
                                                  if (
                                                    typeof window !==
                                                    "undefined"
                                                  ) {
                                                    Swal.fire({
                                                      title:
                                                        "Are you sure you want to cancel this meeting?",
                                                      text: "Your amount will be refunded to you",
                                                      icon: "warning",
                                                      showCancelButton: true,
                                                      confirmButtonColor:
                                                        "#3085d6",
                                                      cancelButtonColor: "#d33",
                                                      confirmButtonText: "Yes",
                                                      cancelButtonText: "No",
                                                    }).then((result) => {
                                                      if (result.isConfirmed) {
                                                        axiosInstance
                                                          .put(
                                                            `/schedules/cancel/${ele?.id}`
                                                          )
                                                          .then((res) => {
                                                            appointmentHistory();
                                                          })
                                                          .catch((err) => {
                                                            toast.error(
                                                              err.message,
                                                              {
                                                                position:
                                                                  "top-right",
                                                                autoClose: 5000,
                                                                hideProgressBar: true,
                                                                closeOnClick: true,
                                                                pauseOnHover: true,
                                                                draggable: true,
                                                                progress:
                                                                  undefined,
                                                                theme: "dark",
                                                              }
                                                            );
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
                                          ) : (
                                            <div className={styles.textC}></div>
                                          )}

                                          <div
                                            className={
                                              "d-flex " + styles.optionIcon
                                            }
                                          >
                                            <span className="cursor-pointer">
                                              {/* <Options color="#000" /> */}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })
                                  : null}
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className={styles.rightAppointmentWrapper}>
                    {/* slider */}

                    <Tabs>
                      <TabList>
                        <Tab>Today</Tab> | <Tab> Future</Tab>
                      </TabList>

                      <TabPanel>
                        <Swiper
                          spaceBetween={50}
                          slidesPerView={1}
                          navigation
                          onSlideChange={() => console.log("slide change")}
                          onSwiper={(swiper) => console.log(swiper)}
                          id="swiper"
                        >
                          {todayAppointment?.length ? (
                            <>
                              {todayAppointment?.map((item) => {
                                return (
                                  <>
                                    <SwiperSlide>
                                      <div className={styles.todaysApp}>
                                        <div
                                          className={styles.todaysAppHeading}
                                        ></div>
                                        <div
                                          className={
                                            "card " + styles.appCardContainer
                                          }
                                        >
                                          <div
                                            className={styles.imageContainer}
                                          >
                                            <img
                                              src={item?.professional?.picture}
                                              className={styles.AppImg}
                                              alt="..."
                                            />
                                            <button className={styles.todayBtn}>
                                              Today
                                            </button>
                                            <button
                                              disabled={
                                                !isCurrentTimeInRange(
                                                  item?.start_time,
                                                  item?.end_time
                                                )
                                              }
                                              onClick={() =>
                                                handleClicked(
                                                  item?.meetingId,
                                                  item?.professional?.nickName,
                                                  item?.meeting_type,
                                                  item?.id,
                                                  item?.duration
                                                )
                                              }
                                              className={
                                                styles.joinBtn +
                                                " " +
                                                "align-items-center font-14px" +
                                                `${
                                                  !isCurrentTimeInRange(
                                                    item?.start_time,
                                                    item?.end_time
                                                  )
                                                    ? " button-diabled"
                                                    : ""
                                                }`
                                              }
                                            >
                                              {item?.meeting_type ===
                                              "video" ? (
                                                <BsFillCameraVideoFill />
                                              ) : (
                                                <BsHeadphones />
                                              )}{" "}
                                              Join Meeting{" "}
                                            </button>
                                          </div>
                                          <div
                                            className={
                                              "card-body " + styles.BGColour
                                            }
                                          >
                                            <div
                                              className={
                                                "d-flex justify-content-between " +
                                                styles.appInfo
                                              }
                                            >
                                              <p
                                                style={{
                                                  textTransform: "capitalize",
                                                }}
                                              >
                                                {item?.professional?.nickName}{" "}
                                              </p>
                                              <button>
                                                {convertUnixToHumanReadable(
                                                  item.start_time,
                                                  "HH:mm AM/PM"
                                                )}{" "}
                                              </button>
                                            </div>
                                            <div className="d-flex gap-2 align-items-center">
                                              <span>
                                                <Book />
                                              </span>

                                              <span
                                                className={
                                                  styles.appType +
                                                  " " +
                                                  "text-normal"
                                                }
                                              >
                                                {item.appointment_type}
                                              </span>
                                            </div>
                                            <hr />
                                            <div
                                              className={
                                                "d-flex justify-content-between " +
                                                styles.appFooter
                                              }
                                            >
                                              <div>
                                                <h6>{item.duration} Minutes</h6>
                                              </div>
                                              <div className="d-flex align-items-center gap-2">
                                                <h6>PAID:</h6>
                                                <p className={styles.appType}>
                                                  ${item.amount_paid}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </SwiperSlide>
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            <>
                              {/* <NoDataMsg
                            message="No appointment found"
                            img="/images/loadImg/calender.svg"
                          /> */}

                              <div
                                className={
                                  styles.noChatHistory +
                                  " " +
                                  "col-lg-12 p-4 col-sm-12 col-md-12"
                                }
                              >
                                <div className="text-center">
                                  <img
                                    src={"/images/loadImg/calender.svg"}
                                    className={styles.IMG}
                                    style={{
                                      height: "100px",
                                      width: "100px",
                                    }}
                                    alt=""
                                  />
                                </div>
                                <p className={styles.noChatHistorytext}>
                                  You do not have an appointment.
                                </p>
                              </div>
                            </>
                          )}
                        </Swiper>
                      </TabPanel>
                      <TabPanel>
                        <Swiper
                          spaceBetween={50}
                          slidesPerView={1}
                          // pagination
                          navigation
                          onSlideChange={() => console.log("slide change")}
                          onSwiper={(swiper) => console.log(swiper)}
                          id="swiper"
                        >
                          {/* <Slider {...settings} className={styles.slider_main_wrp}> */}
                          {futureAppointment.length ? (
                            <>
                              {futureAppointment &&
                                futureAppointment?.map((item) => {
                                  return (
                                    <>
                                      <SwiperSlide>
                                        <div className={styles.todaysApp}>
                                          <div
                                            className={styles.todaysAppHeading}
                                          >
                                            {/* <h6>Future Appointments</h6> */}
                                          </div>
                                          <div
                                            className={
                                              "card " + styles.appCardContainer
                                            }
                                          >
                                            <div
                                              className={styles.imageContainer}
                                            >
                                              <img
                                                src={
                                                  item?.professional?.picture
                                                }
                                                className={styles.AppImg}
                                                alt="..."
                                              />
                                              <button
                                                className={styles.todayBtn}
                                              >
                                                Future
                                              </button>
                                              {/* <button
                                        disabled={
                                          !isCurrentTimeInRange(
                                            item?.start_time,
                                            item?.end_time
                                          )
                                        }
                                        onClick={() =>
                                          handleClicked(
                                            item?.meetingId,
                                            item?.professional?.first_name,
                                            item?.meeting_type,
                                            item?.id,
                                            item?.duration
                                          )
                                        }
                                        className={
                                          styles.joinBtn +
                                          " " +
                                          "align-items-center" +
                                          `${
                                            !isCurrentTimeInRange(
                                              item?.start_time,
                                              item?.end_time
                                            )
                                              ? " button-diabled"
                                              : ""
                                          }`
                                        }
                                      >
                                        {item?.meeting_type === "video" ? (
                                          <BsFillCameraVideoFill />
                                        ) : (
                                          <BsHeadphones />
                                        )}{" "}
                                        Join Meeting{" "}
                                      </button> */}
                                            </div>
                                            <div
                                              className={
                                                "card-body " + styles.BGColour
                                              }
                                            >
                                              <div
                                                className={
                                                  "d-flex justify-content-between " +
                                                  styles.appInfo
                                                }
                                              >
                                                <p
                                                  style={{
                                                    textTransform: "capitalize",
                                                  }}
                                                >
                                                  {item?.professional?.nickName}{" "}
                                                  {/* {item.professional.last_name} */}
                                                </p>
                                                <button>
                                                  {convertUnixToHumanReadable(
                                                    item.start_time,
                                                    "HH:mm AM/PM"
                                                  )}{" "}
                                                </button>
                                              </div>
                                              <div className="d-flex gap-2 align-items-center">
                                                <span>
                                                  <Book />
                                                </span>

                                                <span
                                                  className={
                                                    styles.appType +
                                                    " " +
                                                    "text-normal"
                                                  }
                                                >
                                                  {item.appointment_type}
                                                </span>
                                              </div>
                                              <hr />
                                              <div
                                                className={
                                                  "d-flex justify-content-between " +
                                                  styles.appFooter
                                                }
                                              >
                                                <div>
                                                  <h6>
                                                    {item.duration} Minutes
                                                  </h6>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                  <h6>PAID:</h6>
                                                  <p className={styles.appType}>
                                                    $
                                                    {/* {item.reduce(
                                          (acc, items) =>
                                            items.duration *
                                              items.professional.actual_rate +
                                            acc,
                                          0
                                        )} */}
                                                    {item.amount_paid}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </SwiperSlide>
                                    </>
                                  );
                                })}
                            </>
                          ) : (
                            <>
                              {/* <NoDataMsg
                            message="No appointment found"
                            img="/images/loadImg/calender.svg"
                          /> */}

                              <div
                                className={
                                  styles.noChatHistory +
                                  " " +
                                  "col-lg-12 p-4 col-sm-12 col-md-12"
                                }
                              >
                                <div className="text-center">
                                  <img
                                    src={"/images/loadImg/calender.svg"}
                                    className={styles.IMG}
                                    style={{
                                      height: "100px",
                                      width: "100px",
                                    }}
                                    alt=""
                                  />
                                </div>
                                <p className={styles.noChatHistorytext}>
                                  You do not have an appointment.
                                </p>
                              </div>
                            </>
                          )}
                        </Swiper>
                      </TabPanel>
                    </Tabs>

                    {/* </Slider> */}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </main>
    </>
  );
}

export default Index;
