import styles from "@/styles/components/chatcomponent/ChatComponent.module.css";
import { convertToAmericanTime, getChatTime } from "@/utils/common";
import { useEffect, useRef, useState } from "react";

const ChatComponent = ({
  userAgent,
  isNewMessage,
  userProfile,
  setisNewMessage,
  messages,
}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [timeZone, setTimeZone] = useState();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
      const { timeZone } = JSON.parse(localStorage.getItem("userInfo"));
      setTimeZone(timeZone);
    }
  }, []);
  useEffect(() => {
    if (bottomRef) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div id="container_div" className={styles.chatContainer}>
      {messages?.map((ele, idx) => {
        return (
          <div>
            {ele.is_owned ? (
              <div className={"d-flex gap-2 " + styles.sender}>
                <div>
                  <p className={styles.time}>
                    {getChatTime(ele.message_time, timeZone)}
                  </p>
                  {/* &nbsp; &nbsp; */}
                  <span className={styles.name}>{ele.sender_name}</span>
                  <div
                    className={`${
                      ele.is_owned ? styles.sendermsg : styles.recievermsg
                    } ${styles.message}`}
                  >
                    {ele.message}
                  </div>
                </div>
                <span className={styles.avatarContainer}>
                  <img className={styles.profilepic} src={userInfo?.picture} />
                </span>
              </div>
            ) : (
              <div className={"d-flex gap-3 " + styles.reciever}>
                <div>
                  {/* <span className={styles.time}>
                    {convertToAmericanTime(ele.message_time, "HH:mm AM/PM")}
                  </span> */}
                  <span className={styles.avatarContainer}>
                    <img
                      className={styles.profilepic}
                      src={userProfile?.picture}
                    />
                  </span>
                </div>
                <div>
                  <span className={styles.name}>{ele.sender_name}</span>
                  <p className={styles.time1}>
                    {getChatTime(ele.message_time, timeZone)}
                  </p>
                  <div
                    className={`${
                      ele.is_owned ? styles.sendermsg : styles.recievermsg
                    } ${styles.message}`}
                  >
                    {ele.message}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatComponent;
