import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/professional/meeting/CallReview.module.css";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import StarRatings from "react-star-ratings";
import classNames from "classnames";
import Picker from "emoji-picker-react";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import UserNavbar from "@/components/navbars/UserNavbar";
import { convertUnixToISOString } from "@/utils/common";

const CallReview = () => {
  const [rating, setRating] = useState(0);
  const [showEmojiPicker, setEmojiPicker] = useState(false);
  const [role, setRole] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [btnclick, setBtnclick] = useState(false);
  const router = useRouter();
  const { id, user, scedule_id, name, start_time, end_time } = router.query;

  const emojiPicker = useRef(null);

  const onEmojiClick = (emojiData, event) => {
    console.dir(emojiData);
    setTextAreaValue(textAreaValue + emojiData.emoji);
  };

  const [data, setData] = useState();

  const reveiw = async () => {
    setBtnclick(true);
    let params = {
      userId: data,
      resourceId: user,
      resource_role: router.asPath.includes("/client")
        ? "client"
        : "professional",
      review: textAreaValue,
      meetingId: scedule_id,
      rating: rating,
    };
    axiosInstance
      .post(`${API.review}`, params)
      .then((res) => {
        toast.success("Thanks for feedback ", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        if (router.asPath.includes("/client")) {
          router.push("/client/dashboard");
        } else {
          router.push("/professional/dashboard");
        }
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
        setBtnclick(false);
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      callHandeler();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      let item = JSON.parse(localStorage.getItem("userInfo"));
      let role = localStorage.getItem("role");
      setData(item.id);
      setRole(role);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPicker.current && !emojiPicker.current.contains(event.target)) {
        setEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   const handlePopstate = () => {
  //     console.log("CALLED");
  //     if (role === "client") {
  //       router.push("/client/dashboard");
  //     } else {
  //       router.push("/professional/dashboard");
  //     }
  //   };

  //   window.addEventListener("popstate", handlePopstate);

  //   return () => {
  //     window.removeEventListener("popstate", handlePopstate);
  //   };
  // }, []);

  function countCharactersWithEmojis(textAreaValue) {
    var characterCount = 0;
    for (var i = 0; i < textAreaValue.length; i++) {
      if (
        textAreaValue.charCodeAt(i) >= 0xd800 &&
        textAreaValue.charCodeAt(i) <= 0xdbff
      ) {
        if (
          textAreaValue.charCodeAt(i + 1) >= 0xdc00 &&
          textAreaValue.charCodeAt(i + 1) <= 0xdfff
        ) {
          characterCount++;
          i++;
        }
      } else {
        characterCount++;
      }
    }
    return characterCount;
  }

  return (
    <main className={styles.main}>
      <div className={"container-fluid p-0 professionalNav"}>
        {router?.asPath?.includes("/client") ? (
          <UserNavbar />
        ) : (
          <ProfessionalNavbar image="/images/avatar.png" />
        )}
      </div>
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
      <div className={styles.bodyContainer}>
        <div className={styles.topSection}>
          <div
            onClick={() =>
              router?.asPath.includes("/client")
                ? router.push("/client/appointments")
                : router.push("/professional/dashboard/appointments")
            }
            className={styles.topSectionUpper}
          >
            <BsArrowLeft /> <span>Back to Appointment Management</span>
          </div>
          <div className={styles.titleSection}>Review {name}</div>
        </div>
        <div className={styles.bottomSection}>
          <div className={styles.bodySection}>
            <div className={styles.title}>
              <span>
                Honest reviews help us better assess our service providers.
              </span>
            </div>

            <StarRatings
              rating={rating}
              starRatedColor="#FFD166"
              starHoverColor="#FFD166"
              starDimension="24px"
              svgIconPath="M8.52275 6.93361C8.42172 7.17558 8.19391 7.3408 7.93252 7.36167L3.18325 7.74094C2.56183 7.79057 2.31039 8.56657 2.78461 8.97121L6.39904 12.0554C6.59925 12.2262 6.68672 12.4949 6.62542 12.7509L5.52045 17.3652C5.37552 17.9704 6.03337 18.4497 6.56505 18.1262L10.6365 15.649C10.86 15.5131 11.1406 15.5131 11.3642 15.649L15.4356 18.1262C15.9672 18.4497 16.6251 17.9704 16.4802 17.3652L15.3752 12.7509C15.3139 12.4949 15.4014 12.2262 15.6016 12.0554L19.216 8.97121C19.6902 8.56657 19.4388 7.79057 18.8174 7.74094L14.0681 7.36167C13.8067 7.3408 13.5789 7.17558 13.4779 6.93361L11.6463 2.54699C11.4067 1.97327 10.5939 1.97327 10.3544 2.54699L8.52275 6.93361ZM15.0179 5.43115L13.4918 1.77638C12.5679 -0.436537 9.43275 -0.436517 8.50877 1.77638L6.98275 5.43115L3.02404 5.74729C0.627119 5.9387 -0.34273 8.93184 1.48641 10.4926L4.49492 13.0597L3.57544 16.8994C3.0164 19.234 5.55383 21.0826 7.60461 19.8348L11.0003 17.7688L14.396 19.8348C16.4468 21.0826 18.9842 19.2339 18.4252 16.8994L17.5057 13.0597L20.5142 10.4926C22.3434 8.93183 21.3735 5.9387 18.9766 5.74729L15.0179 5.43115Z"
              svgIconViewBox="0 0 22 21"
              changeRating={(newRating, name) => {
                setRating(newRating);
              }}
              numberOfStars={5}
              name="rating"
            />
            <div className={styles.reviewSection}>
              <textarea
                placeholder="Share your thoughts"
                type="text"
                value={textAreaValue}
                onKeyDown={handleKeyDown}
                onChange={(event) => {
                  setTextAreaValue(event.target.value);
                }}
                className={styles.textInput}
                height="200px"
                maxLength="500"
              />
              <div className={styles.controlsContainer}>
                <img
                  onClick={() => setEmojiPicker(!showEmojiPicker)}
                  src="/images/emoji.svg"
                  alt="emoji"
                  className={styles.emojiPicker}
                />
                <button
                  type="submit"
                  disabled={btnclick}
                  className={classNames("cursor-pointer", styles.postbtn)}
                  onClick={(e) => {
                    e.preventDefault();
                    reveiw();
                  }}
                >
                  Post <BsArrowRight className={styles.postbtnicon} />
                </button>
              </div>
            </div>
            <p className={styles.reviewLength}>
              {countCharactersWithEmojis(textAreaValue)}/500
            </p>
            {showEmojiPicker && (
              <div
                ref={emojiPicker}
                className={classNames(styles.emojiPickerContainer)}
              >
                <Picker
                  height={"350px"}
                  width={"335px"}
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CallReview;
