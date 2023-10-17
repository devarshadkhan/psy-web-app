import UserNavbar from "@/components/navbars/UserNavbar";
import Head from "next/head";
import styles from "@/styles/client/dashboard/Home.module.css";
import HomeRightSide from "@/components/homeRightComponents/HomeRightSide";
import HomeCard from "@/components/homeLeftComponents/HomeCard";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import { toast } from "react-toastify";
import {
  convertUnixToHumanReadableTime,
  convertUnixToHumanReadableDate,
} from "@/utils/common";
import { Tooltip } from "react-bootstrap";
import { useRouter } from "next/router";

function Index() {
  const [dashBoardData, setDashboardData] = useState(null);
  const route = useRouter();
  const [userData, setUserData] = useState(null);
  const { token, refreshToken } = route.query;

  async function getProfileData() {
    await axiosInstance
      .get(API.getUserProfile)
      .then((res) => {
        setUserData(res);
      })
      .catch((err) => console.log(err));
  }

  const getDashboadData = async () => {
    await axiosInstance
      .get(API.clientDashBoard)
      .then((res) => {
        setDashboardData(res);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error?.message, {
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
  };

  useEffect(() => {
    setTimeout(() => {
      if (token) {
        localStorage.setItem("userToken", token);
        localStorage.setItem("userTokenRefresh", refreshToken);
        localStorage.setItem("role", "client");
        getProfileData();
        getDashboadData();
      } else if (localStorage.getItem("userToken")) {
        getProfileData();
        getDashboadData();
      }
    }, 1000);
  }, [token, refreshToken]);

  const tooltip = (
    <Tooltip id="tooltip">
      <strong>Please verify your email</strong>
    </Tooltip>
  );

  return (
    <>
      <Head>
        <title>Dashboard | Psychix</title>
        <meta name="description" content="Dashboard | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={"container-fluid " + styles.fullWidth}>
          <div>
            <UserNavbar image="/images/avatar.png" />
          </div>

          <div className={"d-flex " + styles.homeBG}>
            <div
              className={"col-lg-9 col-md-6 col-sm-12 " + styles.leftContainer}
            >
              <div className={styles.leftWrapper}>
                <p className={styles.pageHeading}>Dashboard</p>

                <div className="d-flex flex-wrap justify-content-between mb-5">
                  <HomeCard
                    cardHeading={"Next Appointment"}
                    cardContent={
                      dashBoardData?.next_appointment_detail?.start_date
                        ? convertUnixToHumanReadableDate(
                            dashBoardData?.next_appointment_detail?.start_date
                          )
                        : "No Upcoming Appointments"
                    }
                    cardSubContent={
                      dashBoardData?.next_appointment_detail?.start_time &&
                      convertUnixToHumanReadableTime(
                        dashBoardData?.next_appointment_detail?.start_time
                      )
                    }
                    isClient={true}
                    userInfo={userData}
                    tooltip={tooltip}
                    cardBtn={"View all"}
                    link={"/client/appointments"}
                  />
                  <HomeCard
                    isClient={true}
                    cardHeading={"Your Wallet"}
                    cardContent={`$${
                      dashBoardData?.wallet_amount
                        ? dashBoardData?.wallet_amount
                        : 0
                    }`}
                    // cardSubContent={"This includes referral fees"}
                    cardBtn={"View wallet"}
                    tooltip={tooltip}
                    userInfo={userData}
                    link={"/client/settings/wallet"}
                  />
                </div>
              </div>
            </div>

            <div className={styles.rightContainer + " col-lg-3 col-md-6 col-sm-12 p-0"}>
              <HomeRightSide
                totalAppoinements={dashBoardData?.total_appointment}
                totalRatings={dashBoardData?.total_referrals}
                membership_type={dashBoardData?.membership_type}
                userData={userData}
                refLink={dashBoardData?.referral_link}
                image="/images/avatar2.png"
                pName="Kohaku Tora"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Index;
