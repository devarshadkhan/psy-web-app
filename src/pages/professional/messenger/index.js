import React, { useEffect, useState } from "react";
import UserNavbar from "@/components/navbars/UserNavbar";
import styles from "@/styles/client/chat/Chat.module.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Offcanvas from "react-bootstrap/Offcanvas";
import classNames from "classnames";
import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import {
  convertToAmericanTime,
  convertUnixToHumanReadableDate,
  convertUnixToHumanReadableTime,
  timeValueConvertion,
} from "@/utils/common";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import { useRouter } from "next/router";
import Head from "next/head";
import NoDataMsg from "@/components/noDataMsg/NoDataMsg";

const index = () => {
  const [show, setShow] = useState(false);
  const [width, setWidth] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState([]);
  const [selectedUser, setSelecteduser] = useState("");
  const [chatData, setChatData] = useState([]);
  const [loader, setLoader] = useState(false);
  const route = useRouter();
  const handleResize = () => {
    setToggle(false);
    setWidth(window.innerWidth);
  };

  const getUserChats = (id) => {
    setLoader(true);
    axiosInstance
      .post(`${API.getChatHistory}/${id}`)
      .then((res) => {
        if (res?.data) {
          setChatData(convertToMessageArray(res?.data));
        }
        setLoader(false);
      })
      .catch((err) => {
        if (
          err?.data?.status_code === "404" &&
          err?.data?.message ===
            "No chat history is available for this conference"
        ) {
          setChatData([]);
        }
        setLoader(false);
      });
  };

  /**
   * @param {String} data
   * @returns return Array of chats
   */

  function convertToMessageArray(data) {
    // Replace single quotes with double quotes in the property names
    const dataArray = data.split("}{");

    // Add curly braces to each object and join them with commas
    const formattedData = dataArray
      .map((item, index) => {
        if (index === 0) {
          // For the first object, add an opening curly brace
          return `${item}}`;
        } else if (index === dataArray.length - 1) {
          // For the last object, add a closing curly brace
          return `{${item}`;
        } else {
          // For other objects, add both opening and closing curly braces
          return `{${item}}`;
        }
      })
      .join(",");

    // Parse the formatted data into a JavaScript object
    const convertedObject = JSON.parse(`[${formattedData}]`);
    const filteredData = convertedObject.filter((item) => {
      return !item.message.includes("{action:");
    });

    // Return the filtered array of messages
    return filteredData;
  }

  useEffect(() => {
    if (selectedUser?.id) {
      getUserChats(selectedUser?.meetingId);
    }
  }, [selectedUser]);

  const appointmentHistory = async () => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
      setUserInfo(item);
      const role = localStorage.getItem("role");
      let Url = `${API.appointmentsHisoryType}?role=${role}`;
      axiosInstance
        .get(Url)
        .then((res) => {
          if (role !== "professional") {
            setData(res);
            setSelecteduser(res[0]);
          } else {
            setData(res[0]?.completedAppointments);
            setSelecteduser(res[0]?.completedAppointments[0]);
          }
        })
        .catch((err) => console.warn(err));
    }
  };

  const getIso = (dateString) => {
    const formattedDateString = dateString.replace(" ", "T");
    const dateObject = new Date(Date.parse(formattedDateString));
    const isoString = dateObject.toISOString();
    return isoString;
  };
  useEffect(() => {
    appointmentHistory();
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Head>
        <title>Messenger | Psychix</title>
        <meta name="description" content="Messenger | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {route?.asPath?.includes("client") ? (
        <UserNavbar />
      ) : (
        <ProfessionalNavbar image="/images/avatar.png" />
      )}

      <section className={styles.chat_section}>
        <div
          className={
            "container-lg row container-md container-sm " +
            styles.containerMessage
          }
        >
          <div className="col-lg-3 chat-list-containerData p-4 col-sm-12 col-md-12">
            <div className={styles.inbox_bar}>
              <div
                onClick={() => route.back(-1)}
                className={classNames("cursor-pointer", styles.main_heading)}
              >
                <h5>
                  <AiOutlineArrowLeft /> Messenger
                </h5>
              </div>

              {data.length > 0 ? (
                data.map((ele) => {
                  return (
                    <>
                      <div
                        key={ele.id}
                        className={classNames(
                          styles.wer,
                          "cursor-pointer",
                          ele.id === selectedUser.id && styles.selectedPanal
                        )}
                        onClick={() => {
                          setSelecteduser(ele);
                          handleShow();
                        }}
                      >
                        <div className={"d-flex gap-3  " + styles.user_decs}>
                          <img
                            src={
                              route.asPath.includes("/client")
                                ? ele?.professional?.picture
                                : ele?.client?.picture
                            }
                            alt=""
                            className={styles.user_img}
                          />
                          <div>
                            <h6>
                              {route.asPath.includes("/client")
                                ? ele?.professional?.nickName
                                : ele?.client?.first_name}{" "}
                              {route.asPath.includes("/client")
                                ? ""
                                : ele?.client?.last_name}
                            </h6>
                            <span>
                              {convertUnixToHumanReadableDate(ele?.start_date)}
                            </span>
                          </div>
                          <p>{ele.thnks}</p>
                        </div>
                        {/* <div className={styles.rating}>
                          <img src="/images/ChatImages/star.svg" alt="" />
                          <span>{ele.rating}</span>
                        </div> */}
                      </div>
                      <hr />
                    </>
                  );
                })
              ) : (
                <>
                  <div className="position-absolute w-100 mt-4">
                    <div className={styles.inbox_bar}>
                      <NoDataMsg
                        message="No chat history found"
                        img="/images/message.svg"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {!loader ? (
            <>
              {" "}
              {chatData && selectedUser && (
                <div
                  className={classNames(
                    "col-lg-5 col-sm-12 col-md-12" +
                      " " +
                      styles.chatWrapper +
                      " " +
                      styles.mednone
                  )}
                >
                  <div className={styles.chat_sec}>
                    <div className={styles.chatting_sec}>
                      {chatData && chatData.length > 0 ? (
                        chatData?.map((item) => {
                          if (item.from_user === userInfo.id) {
                            return (
                              <>
                                <div className={styles.user_area}>
                                  <div className={styles.chatAvatarContainer}>
                                    <img
                                      src={userInfo.picture}
                                      className={styles.ChatAvatar}
                                      alt=""
                                    />
                                  </div>
                                  <div>
                                    <h6 className={styles.userSender}>
                                      {timeValueConvertion(
                                        item?.message_time,
                                        userInfo?.timezone
                                      )}
                                    </h6>
                                    <p
                                      className={classNames(styles.messageData)}
                                    >
                                      {item.message}
                                    </p>
                                  </div>
                                </div>
                              </>
                            );
                          } else {
                            return (
                              <>
                                <div className={styles.cleint_area}>
                                  <div className={styles.chatAvatarContainer}>
                                    <img
                                      src={
                                        route.asPath.includes("/client")
                                          ? selectedUser?.professional?.picture
                                          : selectedUser?.client?.picture
                                      }
                                      alt=""
                                      className={styles.ChatAvatar}
                                    />
                                  </div>
                                  <div className="d-flex flex-column">
                                    <h6>
                                      {timeValueConvertion(
                                        item?.message_time,
                                        userInfo?.timezone
                                      )}
                                    </h6>
                                    <p>{item.message}</p>
                                  </div>
                                </div>
                              </>
                            );
                          }
                        })
                      ) : (
                        <span className={styles.noChatFound}>
                          <img src="/images/message.svg" alt="Message" />
                          No message found
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* <div className={styles.messengerLoader}> */}
              <div
                className={classNames(styles.messengerLoader, "spinner-border")}
                role="status"
              >
                <span class="sr-only"></span>
              </div>
              {/* </div> */}
            </>
          )}

          {chatData && selectedUser && (
            <div
              className={classNames(
                "col-sm-12 p-4 col-md-12" +
                  " " +
                  styles.profileContainer +
                  " " +
                  styles.mednone
              )}
            >
              <div className={styles.main_heading}>
                <div className={styles.bdr}>
                  {route.asPath.includes("/client") ? (
                    <button
                      onClick={() =>
                        route.push(
                          `/client/dashboard/explorepsychicdetails/${
                            selectedUser?.professional?.id
                          }?type=${
                            selectedUser?.appointment_type
                          }&&last_route=${"client messenger"}`
                        )
                      }
                      className={styles.user_btn}
                    >
                      <img src="/images/ChatImages/Type.svg" alt="" />
                      View Psychic Profile
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        route.push(
                          `/professional/profile/${selectedUser?.client?.id}?resource_role=client`
                        )
                      }
                      className={styles.user_btn}
                    >
                      <img src="/images/ChatImages/Type.svg" alt="" />
                      View Client Profile
                    </button>
                  )}

                  <img
                    src={
                      route.asPath.includes("/client")
                        ? selectedUser?.professional?.picture
                        : selectedUser?.client?.picture
                    }
                    alt=""
                    className={styles.secondProfileImage}
                    width="100%"
                  />

                  <div className={styles.user_about}>
                    <h5>
                      {route.asPath.includes("/client")
                        ? selectedUser?.professional?.nickName
                        : selectedUser?.client?.first_name}{" "}
                      {route.asPath.includes("/client")
                        ? ""
                        : selectedUser?.client?.last_name?.charAt(0) + "."}
                    </h5>
                    <p>
                      This appointment with{" "}
                      {route.asPath.includes("/professional")
                        ? selectedUser?.client?.first_name
                        : selectedUser?.professional?.nickName}{" "}
                      is finished
                    </p>
                    <div className={styles.data_time}>
                      <div className={styles.frst_wrp}>
                        <img src="/images/ChatImages/clndr.svg" alt="" />
                        <div>
                          <p>Date</p>
                          <h6>
                            {convertUnixToHumanReadableDate(
                              selectedUser?.start_date
                            )}
                          </h6>
                        </div>
                      </div>
                      <div className={styles.frst_wrp}>
                        <img src="/images/ChatImages/user.svg" alt="" />
                        <div>
                          <p>Time</p>
                          <h6>
                            {convertUnixToHumanReadableTime(
                              selectedUser?.start_time
                            )}
                          </h6>
                        </div>
                      </div>
                    </div>

                    {(selectedUser?.professional?.topics ||
                      selectedUser?.client?.topics) && (
                      <div className={styles.reading_type}>
                        <img src="/images/ChatImages/ReadingType.svg" alt="" />
                        <p>
                          {route.asPath.includes("/client")
                            ? selectedUser?.professional?.topics
                                ?.map(
                                  (item) =>
                                    item.charAt(0).toUpperCase() +
                                    item.slice(1).toLowerCase()
                                )
                                .join(", ")
                            : selectedUser?.client?.topics
                                ?.map(
                                  (item) =>
                                    item.charAt(0).toUpperCase() +
                                    item.slice(1).toLowerCase()
                                )
                                .join(", ")}
                        </p>
                      </div>
                    )}

                    <div className={styles.divider_img}>
                      <img
                        src="/images/ChatImages/divider.png"
                        alt=""
                        width="100%"
                      />
                    </div>

                    {route.asPath.includes("/client") && (
                      <div className={`d-flex flex-row-reverse`}>
                        {/* <button>
                        View Other Psychics Like{" "}
                        {route.asPath.includes("/client")
                          ? selectedUser?.client?.first_name
                          : selectedUser?.professional?.first_name}
                      </button> */}
                        <button
                          onClick={() =>
                            route.push(
                              `/client/appointment-now/${
                                selectedUser?.professional?.id
                              }?${
                                selectedUser?.professional?.picture
                                  ? "picture=" +
                                    selectedUser?.professional?.picture.replace(
                                      "https://",
                                      ""
                                    )
                                  : ""
                              }&price=${
                                selectedUser?.professional?.actual_rate
                              }&type=${selectedUser?.appointment_type}&name=${
                                selectedUser?.professional?.nickName
                              }&timezone=${
                                selectedUser?.professional?.timezone
                              }`
                            )
                          }
                        >
                          Schedule again{" "}
                          {route.asPath.includes("/client")
                            ? selectedUser?.client?.first_name
                            : selectedUser?.professional?.nickName}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {width <= 991 ? (
          <>
            <Offcanvas show={show} onHide={handleClose}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Chatting...</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12 col-sm-12 col-md-12">
                      <div className={styles.chat_sec}>
                        <div className={styles.chatting_sec}>
                          {chatData &&
                            chatData.length > 0 &&
                            chatData?.map((item) => {
                              if (item.from_user === userInfo.id) {
                                return (
                                  <>
                                    <div className={styles.user_area}>
                                      <div
                                        className={styles.chatAvatarContainer}
                                      >
                                        <img
                                          src={userInfo.picture}
                                          className={styles.ChatAvatar}
                                          alt=""
                                        />
                                      </div>
                                      <p>{item.message}</p>
                                    </div>
                                    <h6>
                                      {/* {convertToAmericanTime(
                                        getIso(item?.message_time),
                                        "HH : mm AM/PM"
                                      )} */}
                                    </h6>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    <div className={styles.cleint_area}>
                                      <div
                                        className={styles.chatAvatarContainer}
                                      >
                                        <img
                                          src={
                                            route.asPath.includes("/client")
                                              ? selectedUser?.professional
                                                  ?.picture
                                              : selectedUser?.client?.picture
                                          }
                                          alt=""
                                          className={styles.ChatAvatar}
                                        />
                                      </div>
                                      <p>{item.message}</p>
                                    </div>
                                    <h6>
                                      {" "}
                                      {/* {convertToAmericanTime(
                                        getIso(item?.message_time),
                                        "HH : mm AM/PM"
                                      )} */}
                                    </h6>
                                  </>
                                );
                              }
                            })}
                        </div>

                        {/* <div className={styles.typeing_sec}>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="form-control"
                    placeholder="Say something..."
                  /> */}
                        {/* <div> */}
                        {/* <AiOutlineArrowRight /> */}
                        {/* </div> */}
                        {/* </div> */}
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-12">
                      <div className={styles.main_heading}>
                        <div className={styles.bdr}>
                          <button className={styles.user_btn}>
                            {" "}
                            <img src="/images/ChatImages/Type.svg" alt="" />
                            View Psychic Profile
                          </button>
                          <img
                            src={
                              route.asPath.includes("/client")
                                ? selectedUser?.professional?.picture
                                : selectedUser?.client?.picture
                            }
                            className={styles.secondProfileImage}
                            alt=""
                            width="100%"
                          />

                          <div className={styles.user_about}>
                            <h5>
                              {route.asPath.includes("/client")
                                ? selectedUser?.professional?.nickName
                                : selectedUser?.client?.first_name}{" "}
                              {route.asPath.includes("/client")
                                ? ""
                                : `${selectedUser?.client?.last_name?.charAt(
                                    0
                                  )}.`}
                            </h5>
                            <p>
                              This appointment with{" "}
                              {route.asPath.includes("/client")
                                ? selectedUser?.professional?.nickName
                                : selectedUser?.client?.first_name}{" "}
                              is finished
                            </p>
                            <div className={styles.data_time}>
                              <div className={styles.frst_wrp}>
                                <img
                                  src="/images/ChatImages/clndr.svg"
                                  alt=""
                                />
                                <div>
                                  <p>Date</p>
                                  <h6>
                                    {convertUnixToHumanReadableDate(
                                      selectedUser?.start_date
                                    )}
                                  </h6>
                                </div>
                              </div>
                              <div className={styles.frst_wrp}>
                                <img src="/images/ChatImages/user.svg" alt="" />
                                <div>
                                  <p>Time</p>
                                  <h6>
                                    {convertUnixToHumanReadableTime(
                                      selectedUser?.start_date
                                    )}
                                  </h6>
                                </div>
                              </div>
                            </div>

                            <div className={styles.reading_type}>
                              <img
                                src="/images/ChatImages/ReadingType.svg"
                                alt=""
                              />
                              <p>
                                {route.asPath.includes("/client")
                                  ? selectedUser?.client?.topics
                                      ?.map(
                                        (item) =>
                                          item.charAt(0).toUpperCase() +
                                          item.slice(1).toLowerCase()
                                      )
                                      .join(", ")
                                  : selectedUser?.professional?.topics
                                      ?.map(
                                        (item) =>
                                          item.charAt(0).toUpperCase() +
                                          item.slice(1).toLowerCase()
                                      )
                                      .join(", ")}
                              </p>
                            </div>

                            <div className={styles.divider_img}>
                              <img
                                src="/images/ChatImages/divider.png"
                                alt=""
                                width="100%"
                              />
                            </div>

                            <button>
                              View Other Psychics Like{" "}
                              {route.asPath.includes("/client")
                                ? selectedUser?.professional?.nickName
                                : selectedUser?.client?.first_name}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Offcanvas.Body>
            </Offcanvas>
          </>
        ) : null}
      </section>

      {/* <div class="spinner-border" role="status">
  <span class="sr-only"></span>
</div> */}
    </>
  );
};

export default index;
