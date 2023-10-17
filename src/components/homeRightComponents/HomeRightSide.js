import styles from "@/styles/components/homerightside/HomeRightSide.module.css";
import Setting from "../icons/Setting";
import Appointment from "../icons/Appointment";
import OutlineMessage from "../icons/OutlineMessage";
import Arrow from "../icons/Arrow";
import RefferCard from "./RefferCard";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import JoinProfesy from "./JoinProfesy";
import { TbSettings2 } from "react-icons/tb";
import { useEffect, useState } from "react";
import Protected from "@/pages/protected";
import Router, { useRouter } from "next/router";
function HomeRightSide({
  customProfileWrapperClass,
  isPsychic = false,
  totalAppoinements,
  refLink,
  totalRatings,
  productInfo,
  membership_type,
  userData,
  data,
}) {
  const percentage = 100;

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");

  const dateFormat = (date) => {
    const dateValue = new Date(date);
    const formattedDate = dateValue.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return formattedDate;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
      setName(item?.first_name);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
      setLastname(item?.last_name);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
      setName(item?.first_name);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
      setLastname(item?.last_name);
    }
  }, []);

  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    picture: "",
    join: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        var item = JSON.parse(userInfo);
        setUserInfo({
          ...item,
          first_name: item.first_name,
          last_name: item.last_name,
          picture: item.picture,
          join: dateFormat(item.createdAt),
        });
      }
    }
  }, []);

  const router = useRouter();
  const Redirect = () => {
    if (router.pathname.includes("professional")) {
      router.push("/professional/settings");
    } else {
      router.push("/client/settings");
    }
  };
  const RedirectAppointment = () => {
    if (router.pathname.includes("professional")) {
      router.push("/professional/dashboard/appointments");
    } else {
      router.push("/client/appointments");
    }
  };

  return (
    <div className={styles.profileWrapper + " " + customProfileWrapperClass}>
      <div>
        <div className={styles.topSectionWrapper + " " + "row text-center"}>
          <div className={styles.ppicWrap}></div>
          <div className={styles.barContainer}>
            <CircularProgressbar
              className={styles.bar}
              value={percentage}
              strokeWidth={4}
              styles={buildStyles({
                pathTransitionDuration: 0.5,
                pathColor: `rgba(0, 0, 0, ${percentage})`,
                textColor: "#000",
                trailColor: "#d6d6d6",
                backgroundColor: "#000",
              })}
            ></CircularProgressbar>
            <img
              className={styles.ppic}
              src={userInfo?.picture || "/images/dummyAvatar.png"}
            />
          </div>
          {/* <h3 className={styles.pName}>{pName}</h3> */}
          <div className="">
            <h3 className={styles.pName}>
              {name} {lastname}
            </h3>
          </div>
          <p className={styles.pGreyText}>Joined {userInfo.join}</p>
        </div>
        {isPsychic ? (
          <div className="row mt-1">
            <div className={"col mt-2 " + styles.DProw}>
              <h4>{data?.total_appointment || 0}</h4>
              <div>Total Appts.</div>
            </div>
            <div className={"col mt-2 " + styles.DProw}>
              <h4>{data?.total_rating?.averagerating || 0}</h4>

              <div>
                {router?.pathname?.includes("client")
                  ? "Referrals"
                  : "Your Rating"}
              </div>
            </div>
            <div
              style={{ border: "none" }}
              className={"col mt-2 " + styles.DProw}
            >
              <h4>
                {data?.total_clients > 1000 ? "1K+" : data?.total_clients}
              </h4>
              <div>Clients</div>
            </div>
          </div>
        ) : (
          <div className="row mt-1">
            <div className={"col mt-2 " + styles.DProw}>
              <h4>{totalAppoinements}</h4>
              <div>Total Appts.</div>
            </div>
            <div className={"col mt-2 " + styles.DProw}>
              <h4>{totalRatings}</h4>
              <div>
                {router?.pathname?.includes("client")
                  ? "Referrals"
                  : "Your Rating"}
              </div>
            </div>
            <div
              style={{ border: "none" }}
              className={"col mt-2 " + styles.DProw}
            >
              <h4>{membership_type}</h4>
              <div>Members</div>
            </div>
          </div>
        )}

        <div className="row mt-4 mx-1">
          <div
            onClick={() =>
              router.asPath.includes("professional")
                ? router.push("/professional/messenger")
                : router.push("/client/messenger")
            }
            className={" border-bottom cursor-pointer " + styles.lineC}
          >
            <div className="d-flex align-items-center">
              <span>
                <Setting className={styles.leftIcon} />
              </span>
              <h5 className={"fw-bolder " + styles.midC}>Messenger</h5>
              <span className="ms-auto">
                <Arrow />
              </span>
            </div>
          </div>

          <div
            onClick={() => {
              if (
                (!isPsychic && userData?.isEmailVerified) ||
                (userData?.isEmailVerified && userData?.is_stripe_setup)
              ) {
                RedirectAppointment();
              }
            }}
            className={
              " border-bottom" +
              " " +
              `${
                (!isPsychic && userData?.isEmailVerified) ||
                (userData?.isEmailVerified && userData?.is_stripe_setup)
                  ? "cursor-pointer"
                  : ""
              }` +
              " " +
              styles.lineC
            }
          >
            <div className="d-flex align-items-center">
              <span>
                <OutlineMessage className={styles.leftIcon} />
              </span>
              <h5 className={"fw-bolder " + styles.midC}>Your Appointments</h5>
              <span className="ms-auto">
                <Arrow />
              </span>
            </div>
          </div>

          <div
            onClick={Redirect}
            className={" border-bottom cursor-pointer " + styles.lineC}
          >
            <div className="d-flex align-items-center">
              <span>
                <img src={"/images/settings.svg"} alt="settings" />
              </span>
              <h5 className={"fw-bolder " + styles.midC}>Settings</h5>
              <span className="ms-auto">
                <Arrow />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3 mx-1 d-flex align-items-center">
        {isPsychic ? (
          userInfo?.is_stripe_setup &&
          userInfo?.isEmailVerified && (
            <JoinProfesy userData={userData} productInfo={productInfo} />
          )
        ) : (
          <RefferCard refLink={refLink} />
        )}
      </div>
    </div>
  );
}

export default HomeRightSide;
