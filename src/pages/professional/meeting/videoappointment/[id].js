import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "@/styles/professional/meeting/Videoappointment.module.css";
import VideoAppointmentSidebar from "@/components/videoappointmentsidebar/VideoAppointmentSidebar";
import VideoMsg from "@/components/icons/VideoMsg";
import Mic from "@/components/icons/Mic";
import CallEnd from "@/components/icons/CallEnd";
import VideoIcon from "@/components/icons/VideoIcon";
import VideoSetting from "@/components/icons/VideoSetting";
import VideoOption from "@/components/icons/VideoOption";
import ChatComponent from "@/components/chatcomponent/ChatComponent";
import Send from "@/components/icons/Send";
import { CiGrid41 } from "react-icons/ci";
import {
  Inviter,
  InviterOptions,
  Registerer,
  Session,
  SessionState,
  RegistererState,
  UserAgent,
  UserAgentOptions,
  InvitationAcceptOptions,
  Messager,
  Info,
  Notification,
} from "sip.js";
import { IoMdMicOff } from "react-icons/io";
import { BsFillCameraVideoOffFill } from "react-icons/bs";
import classNames from "classnames";
import UserNavbar from "@/components/navbars/UserNavbar";
import { Button, Modal } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import {
  convertToAmericanTime,
  convertToUTCCurrentTimeZone,
  convertUnixToISOString,
  isJSONString,
} from "@/utils/common";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

let outgoingMediaStream;
var outgoingSession;
let userAgent;
const videoappointment = () => {
  const [width, setWidth] = useState(0);
  const [isCallJOined, setIsCallJOined] = useState(true);
  const [joined, setJoined] = useState(false)
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [dilerId, setDilerID] = useState("");
  const [isMuted, setisMuted] = useState(false);
  const [isCamera, setIsCamera] = useState(false);
  const route = useRouter();
  const { first_name } = route.query;
  const [startTimeOfCall, setStartTime] = useState("");
  const { id, scedule_id } = route.query;
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [inputType, setInputType] = useState("password");
  const [messageInput, setMessageInput] = useState("");
  const [secondUser, setSecondUser] = useState("");
  const [messagesData, setMessagesData] = useState([]);
  // const [typeing, setTypeing] = useState(false);
  const [callStage, setCallStage] = useState("");
  const [isUserCalledJoined, setIsUserCalledJoined] = useState(false);
  const [isNewMessage, setisNewMessage] = useState(false);
  const [time, setTime] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [startTime, setStartTme] = useState("");
  const [isProfessionalJoined, setIsProfessionalJoined] = useState(false);
  const inputRef = useRef(null);
  const sendMessgeRef = useRef(null);

  const handleKeyMessageDown = (event) => {
    if (event.key === "Enter") {
      sendMessgeRef.current.click();
    }
  };

  useEffect(() => {
    // inputRef.current.focus();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!isCallJOined) {
      var interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isCallJOined]);

  const hours = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");

  const onMessage = (messages) => {
    messages.accept();
    if (isJSONString(messages?.incomingMessageRequest?.message?.body)) {
      let value = messages?.incomingMessageRequest?.message?.body;
      const receivedData = JSON.parse(value);
      if (receivedData.action === "JOINED") {
        localStorage.setItem("JOINED", true);
        setJoined(true)
        setCallStage("JOINED");

        sendNoteMessage("ESTABLISHED");
        sendNoteMessage("REQUEST_TIME");
        setIsCallJOined(false);
        setIsUserCalledJoined(true);
      }
      if (receivedData.action === "REQUEST_TIME") {
        sendNoteMessage(`RESPONSE_TIME:${time}`);
      }
      if (receivedData.action.includes("RESPONSE_TIME")) {
        const currentTime = receivedData.action.split(":")[1];
        console.log("RECEIVED_DATA", receivedData.action);
        setTime(Number(currentTime));
      }
      if (receivedData.action === "ESTABLISHED") {
        setJoined(true)
        localStorage.setItem("JOINED", true);
        setIsCallJOined(false);
        sendNoteMessage("REQUEST_TIME");
        setIsUserCalledJoined(true);
      }
      if (receivedData.action === "NEWMESSAGE") {
        setisNewMessage(true);
      }
      if (receivedData.action === "TERMINATE") {
        setCallStage("TERMINATE");
        hangupCall();
      }
    } else {
      const newMessage = {
        message: messages?.incomingMessageRequest?.message?.body,
        is_owned: false,
        from_user: secondUser,
        to_user: username,
        conf_id: id,
        message_time: Date.now(),
      };
      setMessagesData((prevState) => [...prevState, newMessage]);
    }
  };

  const getUserChats = () => {
    axiosInstance.post(`${API.getChatHistory}/${id}`).then((res) => {
      if (res?.data && res?.data?.length > 0 && res?.data[0]?.status === 200) {
        setMessagesData(convertToMessageArray(`${res?.data}`));
      }
    });
  };

  useEffect(() => {
    if (!isCallJOined) {
      const currenttimeValue = new Date();
      setStartTme(currenttimeValue.toISOString());
    }
  }, [isCallJOined]);

  function convertToMessageArray(data) {
    data = data.replace(/\s/g, "");
    data = data.replace(/}\{/g, "},{");
    data = `[${data}]`;
    const messages = JSON.parse(data);

    const filteredMessages = messages.filter((message) => {
      return !message.message.includes("action");
    });

    return filteredMessages;
  }

  const handlePublicProfile = async (id) => {
    axiosInstance
      .get(
        `${
          route.asPath.includes("client") ? API.psychicClient : API.userClient
        }/${id}`
      )
      .then((res) => {
        const resData = { ...res };
        setUserProfile(resData);
      })
      .catch((err) => console.log(err));
  };

  const handleUserInConference = (user_id) => {
    axios
      .post("https://voip.psychica.com/user_details.php", {
        action: "get_conf_user",
        username: user_id,
        conference: dilerId,
      })
      .then((res) => {
        setSecondUser(res?.data?.username);
        handlePublicProfile(res?.data?.username);
      })
      .catch((err) => console.log(err));
  };

  const sendMessage = () => {
    // const message = 'Hello, Bob!';
    if (messageInput?.trim()) {
      const target = UserAgent.makeURI(
        "sip:" + secondUser?.trim() + "@voip.psychica.com:9798"
      );
      const messager = new Messager(userAgent, target, messageInput);
      // userAgent.message(target, message, {
      //   contentType: 'text/plain'
      // });
      messager.message();
      const message = {
        message: messageInput,
        is_owned: true,
        from_user: username,
        to_user: secondUser,
        message_time: Date.now(),
      };
      sendNoteMessage("NEWMESSAGE");
      setMessagesData([...messagesData, message]);
      setMessageInput("");
    }
    // userAgent.on("message", (message) => {
    //   console.log("Received message:", message);
    // });
  };

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      // Call your function here
      callHandeler();
    }
  }

  useEffect(() => {
    const userProfileData = localStorage.getItem("userInfo");
    if (userProfileData) {
      const JsonData = JSON.parse(userProfileData);
      setUserName(JsonData.id);
      // setPassword(PasswordData);
    }
  }, []);

  useEffect(() => {
    if (id) {
      setDilerID(id);
    }
  }, [id]);

  useEffect(() => {
    if (username && dilerId) {
      handleUserInConference(username);
    }
  }, [username, dilerId]);
  useEffect(() => {
    if (username && dilerId && secondUser) {
      getLocalStream();
      userAgentRegistration();
    }
  }, [username, dilerId, secondUser]);

  const userAgentRegistration = () => {
    //	Create user agent object
    var domain = "voip.psychica.com:9798";
    var wss = "wss://voip.psychica.com:8089/ws";
    var UAURI = UserAgent.makeURI("sip:" + username + "@" + domain);
    if (!UAURI) {
      throw new Error("Failed to create UserAgent URI ....");
    }
    // alert(username);

    const userOptions = {
      uri: UAURI,
      authorizationPassword: username,
      authorizationUsername: username,
      transportOptions: {
        server: wss,
        traceSip: true,
      },
      delegate: { onInvite, onMessage },
      register: true,
      noAnswerTimeout: 60,
      userAgentString: "ASTPP | WEBRTC ",
      //viaHost : '1.1.1.1',
      //contactName : '2.2.2.2',
      dtmfType: "info",
      displayName: "WEBRTC",
      activeAfterTransfer: false, //	Die when the transfer is completed
      logBuiltinEnabled: true, //	Boolean - true or false - If true throws console logs
    };
    userAgent = new UserAgent(userOptions);
    //	User agent start and registration

    userAgent
      .start()
      .then(() => {
        const registerer = new Registerer(userAgent);
        //const registerer = new Registerer(userAgent);
        registerer.stateChange.addListener((registrationState) => {});
        registerer.stateChange.addListener((registrationState) => {
          switch (registrationState) {
            case RegistererState.Registered:
              setIsAuthenticated(true);
              getUserChats(dilerId);
              ClickHandel(dilerId);
              break;
            case RegistererState.Unregistered:
              console.log("Unregistered ....");
              setIsAuthenticated(false);

              toast.error("Password is incorrect", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
              break;
            case RegistererState.Terminated:
              console.log("Terminated ....");
              break;
            default:
              console.log(
                "Could not identified registration state .... ",
                registrationState
              );
              break;
          }
        });
        registerer
          .register()
          .then((request) => {
            // console.log("Successfully sent REGISTER request .... ", request);
          })
          .catch((error) => {
            // console.log("Failed to send REGISTER request .... ", error);
          });
      })
      .catch((error) => {
        console.log("Failed to connect user agent .... ", error);
      });
  };

  function getLocalStream() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        window.localAudio.autoplay = true;
        outgoingMediaStream = stream;
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`);
      });
  }

  const onInvite = (invitation) => {
    invitation.accept();
  };

  const ClickHandel = (sipNo) => {
    console.log(
      "sipNO ::::::::::::::::::::::::::::::::::::::::>>>>>>>>>>>",
      sipNo
    );
    const target = UserAgent.makeURI(
      "sip:" + sipNo + "@voip.psychica.com:9798"
    );

    console.log(
      "sipNO ::::::::::::::::::::::::::::::::::::::::>>>>>>>>>>>",
      target
    );
    const inviter = new Inviter(userAgent, target);
    console.log(
      "sipNO ::::::::::::::::::::::::::::::::::::::::>>>>>>>>>>>",
      inviter
    );
    inviter.delegate = {
      // Handle outgoing REFER request.
      onRefer(referral) {
        console.log("Handle outgoing REFER request.");
        referral
          .accept()
          .then(() => {
            console.log(
              "sipNO ::::::::::::::::::::::::::::::::::::::::>>>>>>>>>>>",
              "Session Accepted"
            );
            referral.makeInviter().invite();
          })
          .catch((err) => {
            console.log(
              "sipNO ::::::::::::::::::::::::::::::::::::::::>>>>>>>>>>>",
              err
            );
          });
      },
    };

    outgoingSession = inviter;

    inviter.stateChange.addListener((callingState) => {
      switch (callingState) {
        case SessionState.Establishing:
          console.log("Ringing on destination ....");
          break;
        case SessionState.Established:
          console.log("Call answered ....");
          console.log(isCallJOined);
          setupRemoteMedia(inviter); //	Media audio control
          break;
        case SessionState.Terminated:
          console.log("Call terminated ....");
          const result = localStorage.getItem("JOINED");
          if (!result) {
            Swal.fire({
              title: "Proceed with your meeting",
              confirmButtonText: "Continue"
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          } else {
            localStorage.removeItem("JOINED");
          }
          // callerTuneplay.pause(); //	Caller tune pause
          break;
        case SessionState.Terminating:
          console.log("Call terminating ....");
          cleanupMedia(); //	Stop media audio control
          break;
        default:
          console.log(
            "Could not identified calling state while calling .... ",
            callingState
          );
          break;
      }
    });

    // Options including delegate to capture response messages
    const inviteOptions = {
      requestDelegate: {
        onAccept: (response) => {},
        onReject: (response) => {},
      },
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: true,
        },
      },
    };

    //	Send invition
    inviter
      .invite(inviteOptions)
      .then((request) => {
        console.log("Successfully sent INVITE ....");
        //console.log("INVITE request ....");
        // console.log(request);
      })
      .catch((error) => {
        console.log("Failed to send INVITE ....");
        // console.log(error);
      });
    // });
  };

  const sendNoteMessage = (NOTE) => {
    const target = UserAgent.makeURI(
      "sip:" + secondUser.trim() + "@voip.psychica.com:9798"
    );
    const Note = JSON.stringify({ action: NOTE });
    const messager = new Messager(userAgent, target, Note);
    messager.message();
  };

  const callUserConfId = () => {
    axiosInstance.post(`${API.usersUpdateConferenceId}/${username}/${id}`);
    let CallURL = `schedules/start-appointment/${scedule_id}/`;
    const role = route.asPath.includes("/professional")
      ? "professional"
      : "client";
    CallURL = CallURL + role;
    axiosInstance.put(CallURL);
  };

  //	Connect remote media stream
  const setupRemoteMedia = (mediaSession) => {
    const mediaElement = document.getElementById("mediaElement");
    const localElement = document.getElementById("mediaElementLocal");
    try {
      const remoteStream = new MediaStream();
      const localStream = new MediaStream();
      sendNoteMessage("JOINED");
      callUserConfId();
      mediaSession.sessionDescriptionHandler.peerConnection
        .getReceivers()
        .forEach((receiver) => {
          if (receiver.track) {
            remoteStream.addTrack(receiver?.track);
            mediaElement.srcObject = remoteStream;
            mediaElement.play();
          }
        });
      mediaSession.sessionDescriptionHandler.peerConnection
        .getSenders()
        .forEach((sender) => {
          if (sender.track) {
            localStream.addTrack(sender.track);
            localElement.srcObject = localStream;
            localElement.play();
          }
        });
    } catch (error) {
      console.log("Media audio session error - ", error);
    }
  };

  //	Stop media audio
  const cleanupMedia = () => {
    const mediaElement = document.getElementById("mediaElement");
    try {
      if (mediaElement) {
        mediaElement.srcObject = null;
        mediaElement.pause();
      }
    } catch (error) {
      console.log("Clean media audio session error - ", error);
    }
  };

  //	Mute media stream session
  const muteMediaSession = () => {
    const mediaElement = document.getElementById("mediaElement");
    //	Mute outgoing session
    if (mediaElement) {
      //mediaElement.pause();
      setisMuted(true);
    }

    //	Mute outgoing session
    if (
      outgoingSession &&
      (outgoingSession._state === "Establishing" ||
        outgoingSession._state === "Established")
    ) {
      if (outgoingSession._state === "Established") {
        outgoingMediaStream =
          outgoingSession.sessionDescriptionHandler.peerConnection;
        outgoingMediaStream.getSenders().forEach((outgoingStream) => {
          //outgoingStream.track.enabled = false;
          if (outgoingStream.track.kind === "audio") {
            outgoingStream.track.enabled = false;
          }
        });
      }
    }
  };

  //	Unmute media stream session
  const unMuteMediaSession = () => {
    const mediaElement = document.getElementById("mediaElement");
    //	Unmute outgoing session
    if (mediaElement) {
      mediaElement.play();
      setisMuted(false);
    }

    //	Unmute outgoing session
    if (
      outgoingSession &&
      (outgoingSession._state === "Establishing" ||
        outgoingSession._state === "Established")
    ) {
      if (outgoingSession._state === "Established") {
        outgoingMediaStream =
          outgoingSession.sessionDescriptionHandler.peerConnection;
        outgoingMediaStream.getSenders().forEach((outgoingStream) => {
          if (outgoingStream.track.kind === "audio") {
            outgoingStream.track.enabled = true;
          }
        });
      }
    }
  };

  const muteVideoSession = () => {
    const mediaElement = document.getElementById("mediaElement");
    //	Mute outgoing session
    if (mediaElement) {
      //mediaElement.pause();
      setIsCamera(true);
    }

    //	Mute outgoing session
    if (
      outgoingSession &&
      (outgoingSession._state === "Establishing" ||
        outgoingSession._state === "Established")
    ) {
      if (outgoingSession._state === "Established") {
        outgoingMediaStream =
          outgoingSession.sessionDescriptionHandler.peerConnection;
        outgoingMediaStream.getSenders().forEach((outgoingStream) => {
          //outgoingStream.track.enabled = false;
          if (outgoingStream.track.kind === "video") {
            outgoingStream.track.enabled = false;
          }
        });
      }
    }
  };

  //	Unmute media stream session
  const unMuteVideoSession = () => {
    const mediaElement = document.getElementById("mediaElement");
    if (mediaElement) {
      mediaElement.play();
      setIsCamera(false);
    }

    if (
      outgoingSession &&
      (outgoingSession._state === "Establishing" ||
        outgoingSession._state === "Established")
    ) {
      if (outgoingSession._state === "Established") {
        outgoingMediaStream =
          outgoingSession.sessionDescriptionHandler.peerConnection;
        outgoingMediaStream.getSenders().forEach((outgoingStream) => {
          if (outgoingStream.track.kind === "video") {
            outgoingStream.track.enabled = true;
          }
        });
      }
    }
  };

  const callClientSubmit = () => {
    const end = new Date();
    const callendTime = convertToUTCCurrentTimeZone(end.toISOString());
    axiosInstance
      .put(`schedules/end-appointment/${scedule_id}/${callendTime}`)
      .then((res) => {
        if (res) {
          if (res?.status === 201) {
            route.push(`/client/dashboard`);
          } else {
            route.push(
              `/client/meeting/callreview?user=${secondUser}&name=${first_name}&scedule_id=${scedule_id}`
            );
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const hangupCall = () => {
    try {
      //	Manage outgoing state on call hangup
      if (outgoingSession) {
        if (outgoingSession._state === "Establishing") {
          //alert('123');
          sendNoteMessage("TERMINATE");
          outgoingSession.cancel();
          if (route.asPath.includes("professional")) {
            route.push(
              `/professional/meeting/callreview?user=${secondUser}&name=${first_name}&scedule_id=${scedule_id}`
            );
          } else {
            callClientSubmit();
          }
        } else if (outgoingSession._state === "Established") {
          //alert('456');
          sendNoteMessage("TERMINATE");
          outgoingSession.bye();
          localStorage.removeItem("callTime");
          if (route.asPath.includes("professional")) {
            route.push(
              `/professional/meeting/callreview?user=${secondUser}&name=${first_name}&scedule_id=${scedule_id}`
            );
          } else {
            callClientSubmit();
          }
        }
      }
    } catch (error) {
      console.log("Incoming or Outgoing session not found - ", error);
    }
  };

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

  const [show, setShow] = useState(false);
  const handleClose = () => setIsAuthenticated(false);
  return (
    <main className={styles.main}>
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
      <Modal
        className={classNames(styles.LoginModalContainer)}
        show={!isAuthenticated}
        onHide={handleClose}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className={classNames(styles.ModalContainer)}>
          <div className={classNames(styles.modalHeader)}>
            Please enter your password
          </div>
          <div className={classNames(styles.modalInputContainer)}>
            <input
              type={inputType}
              ref={inputRef}
              onKeyDown={handleKeyDown}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              className={classNames(styles.inputPassword)}
            />
            {inputType === "password" ? (
              <AiOutlineEyeInvisible
                className={styles.visibleIcon}
                onClick={() => setInputType("password")}
              />
            ) : (
              <AiOutlineEye
                className={styles.visibleIcon}
                onClick={() => setInputType("text")}
              />
            )}
          </div>
          <div className={styles.footerContainer}>
            {/* <div className={styles.forgotPassword}>Forgot password ?</div> */}
            <div className="gap-2 d-flex ms-auto">
              <Button
                onClick={() => route.back(-1)}
                className={styles.secondarybuttonContainer}
              >
                Cancel
              </Button>
              <Button
                onClick={() => callHandeler()}
                className={styles.buttonContainer}
              >
                Submit
              </Button>
            </div>
          </div>
          {/* </div> */}
        </div>
      </Modal>

      <div className={"container-fluid p-0 professionalNav"}>
        {route?.asPath?.includes("client") ? (
          <UserNavbar />
        ) : (
          <ProfessionalNavbar image="/images/avatar.png" />
        )}
      </div>

      <div className={"d-flex " + styles.bodycontainer}>
        {width > 540 && (
          <div
            // className={`${
            //   (width > 540 && show)
            //     ? styles.sidebarContainer
            //     : styles.sidebarContainer2
            // }`}
            className={styles.sidebarContainer}
          >
            <VideoAppointmentSidebar
              isCallJOined={isCallJOined}
              setisNewMessage={setisNewMessage}
              isNewMessage={isNewMessage}
              toggle="offcanvas"
              target="#offcanvasScrolling"
              controls="offcanvasScrolling"
            />

            <div
              className={`offcanvas offcanvas-start ${styles.canvaPosition}`}
              data-bs-scroll="true"
              data-bs-backdrop="false"
              tabindex="-1"
              id="offcanvasScrolling"
              aria-labelledby="offcanvasScrollingLabel"
            >
              <div className={"offcanvas-header " + styles.title}>
                <h5 className={"offcanvas-title "} id="offcanvasScrollingLabel">
                  Messages
                </h5>
                {width <= 540 && (
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                )}
              </div>
              <div className={"offcanvas-body " + styles.canvasContent}>
                <ChatComponent
                  userProfile={userProfile}
                  isNewMessage={isNewMessage}
                  setisNewMessage={setisNewMessage}
                  messages={messagesData}
                  userAgent={userAgent}
                />
              </div>
              <div className={styles.sendingMsg}>
                <div>
                  <input
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder="Type to add your message"
                    className={styles.textInput}
                    onKeyDown={handleKeyMessageDown}
                  />
                  <button
                    ref={sendMessgeRef}
                    onClick={sendMessage}
                    className={styles.sendText}
                  >
                    <Send />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {width <= 540 && show && (
          <div
            className={`offcanvas2 offcanvas-start ${styles.canvaPosition} ${styles.mobileView}`}
            data-bs-scroll="true"
            data-bs-backdrop="false"
            tabindex="-1"
            id="offcanvasScrolling"
            aria-labelledby="offcanvasScrollingLabel"
          >
            <div className={"offcanvas-header " + styles.title}>
              <h5 className={"offcanvas-title "} id="offcanvasScrollingLabel">
                Messages
              </h5>
              {width <= 540 && (
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas2"
                  aria-label="Close"
                  onClick={() => setShow(false)}
                ></button>
              )}
            </div>
            <div className={"offcanvas-body " + styles.canvasContent}>
              <ChatComponent
                userProfile={userProfile}
                isNewMessage={isNewMessage}
                setisNewMessage={setisNewMessage}
                messages={messagesData}
                userAgent={userAgent}
              />
            </div>
            <div className={styles.sendingMsg}>
              <div>
                <input
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  placeholder="Type to add your message"
                  className={styles.textInput}
                  onKeyDown={handleKeyMessageDown}
                />
                <button
                  ref={sendMessgeRef}
                  onClick={sendMessage}
                  className={styles.sendText}
                >
                  <Send />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.videocall}>
          {width <= 540 && (
            <button
              className={`${
                width <= 540 && show ? styles.hidden : styles.openMenu
              }`}
              toggle="offcanvas2"
              onClick={() => setShow(!show)}
            >
              <CiGrid41 />
            </button>
          )}
          {isCallJOined && (
            <div
              className={classNames(styles.CallLoaderContainer)}
              role="status"
            >
              <img
                src="/images/Videos/callLoader.svg"
                alt="callLoader"
                className="w-100"
                // controls
              />
            </div>
          )}
          <div className={styles.videoStreamWrapper}>
            <video
              id="mediaElement"
              className={classNames(
                styles.videoStreamContainer,
                styles.RemoteStreaming
              )}
            ></video>
            <video
              id="mediaElementLocal"
              className={classNames(
                styles.videoStreamContainer,
                styles.localStreaming
              )}
            ></video>
          </div>

          {/* <button className={`${styles.videoBtn} ${styles.positionBtn}`}>
            <VideoOption />
          </button> */}
          <div className={`${styles.bottomBtns} justify-content-center`}>
            {/* <button className={`${styles.videoBtn} `}>
              <VideoMsg />
            </button> */}
            <div className={styles.videoCallOperatorContainer}>
              <div
                className={styles.CallTimer}
              >{`${hours}:${minutes}:${seconds}`}</div>
              <div className={` d-flex gap-3 `}>
                <button
                  onClick={() =>
                    isMuted ? unMuteMediaSession() : muteMediaSession()
                  }
                  className={styles.videoBtn}
                >
                  {isMuted ? <IoMdMicOff /> : <Mic />}
                </button>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: "Are you sure you want to end this call?",
                      text: "You won't be able to join again!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "End Call",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        hangupCall();
                      }
                    });
                  }}
                  className={styles.videoBtn}
                >
                  <CallEnd />
                </button>

                <button
                  onClick={() =>
                    isCamera ? unMuteVideoSession() : muteVideoSession()
                  }
                  className={styles.videoBtn}
                >
                  {isCamera ? <BsFillCameraVideoOffFill /> : <VideoIcon />}
                </button>
              </div>
            </div>
            {/* <button className={`${styles.videoBtn} `}>
              <VideoSetting />
            </button> */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default videoappointment;