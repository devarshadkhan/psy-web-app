import { MdHome } from "react-icons/md";
import Chat from "../icons/Chat";
import MeetingCall from "../icons/MeetingCall";
import styles from "@/styles/components/videoappointmentsidebar/VideoAppointmentSidebar.module.css";
import ShowNotification from "../icons/ShowNotification";
import Profile from "../icons/Profile";
import Home from "../icons/Home";

const VideoAppointmentSidebar = ({
  toggle,
  setisNewMessage,
  isNewMessage,
  isCallJOined,
  target,
  controls,
}) => {
  return (
    <div className={styles.sidebar}>
      {/* <span className={`${styles.iconContainer} d-flex justify-content-center`}>
        <Home />
      </span> */}
      <span
        className={`${styles.iconContainer} ${
          !isCallJOined && "cursor-pointer"
        }  d-flex gap-3 `}
        data-bs-toggle={isCallJOined ? "" : toggle}
        data-bs-target={isCallJOined ? "" : target}
        toggle={!isCallJOined}
        onClick={() => setisNewMessage(false)}
        aria-controls={isCallJOined ? "" : controls}
      >
        <Chat className={styles.icon} />
        {isNewMessage && (
          <span className={styles.notification}>
            <ShowNotification />
          </span>
        )}
      </span>
      {/* <span className={`${styles.iconContainer} ${styles.border} d-flex gap-3`}>
        <MeetingCall className={styles.icon} />
        <span className={styles.notification}>
          <ShowNotification />
        </span>
      </span> */}
    </div>
  );
};

export default VideoAppointmentSidebar;
