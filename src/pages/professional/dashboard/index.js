import Head from "next/head";
import styles from "@/styles/professional/dashboard/Dashboard.module.css";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import HomeCards from "@/components/homeLeftComponents/HomeCard";
import classNames from "classnames";
import HomeRightSide from "@/components/homeRightComponents/HomeRightSide";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import {
  convertUnixToHumanReadableTime,
  convertUnixToHumanReadableDate,
} from "@/utils/common";
import { ToastContainer, toast } from "react-toastify";
import { setLoader } from "@/store/common/loader";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function Index() {
  const route = useRouter();

  const { payoutAccountStatus } = route.query;
  const [userInfo, setUserInfo] = useState(null);
  const [loader, setLoader] = useState(false);

  const [productInfo, setProductInfo] = useState(null);

  const getproductData = async () => {
    axiosInstance.get(API.usersProducts).then((res) => {
      setProductInfo(res[0]);
    });
  };

  async function getProfileData() {
    await axiosInstance
      .get(API.getUserProfile)
      .then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res));
        setUserInfo(res);
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    getProfileData();
    getproductData();
    setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
  }, []);

  useEffect(() => {
    if (
      payoutAccountStatus &&
      payoutAccountStatus === "true" &&
      !userInfo?.is_stripe_setup
    ) {
      checkAndValidateAccountStatus();
    }
  }, [payoutAccountStatus]);

  const checkAndValidateAccountStatus = async () => {
    setLoader(true);
    axiosInstance
      .get(`${API.walletUpdateStripeAccount}`)
      .then((res) => {
        setLoader(false);
        localStorage.setItem("userInfo", JSON.stringify(res));
        setUserInfo(res);
        toast.success("Your Account is activated successfully", {
          position: "top-right",
          autoClose: 100,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((err) => {
        setLoader(true);
        console.log(err);
        toast.error("", {
          position: "top-right",
          autoClose: 100,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const tabsData = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "appointments",
      label: "Appointments",
    isDisabled: !(userInfo?.isEmailVerified && userInfo?.is_stripe_setup),
    },
    {
      id: "wallet",
      label: "Wallet",
      isDisabled: !(userInfo?.isEmailVerified && userInfo?.is_stripe_setup),
    },
  ];

  const [dashboardData, setDashboard] = useState();

  const requestForStripeConnectAccount = async () => {
    setLoader(true);
    axiosInstance
      .get(`${API.walletCreateStripeAccount}`)
      .then((res) => {
        setLoader(false);
        window.location.href = res?.url;
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  useEffect(() => {});

  const getDashboadData = async () => {
    await axiosInstance
      .get(API.dashboardData)
      .then((res) => {
        setDashboard(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getDashboadData();
  }, []);

  const handleSelectTab = (value) => {
    if (value !== "overview") {
      route.push(`/professional/dashboard/${value}`);
    } else {
      route.push(`/professional/dashboard/`);
    }
  };

  const tooltip = (
    <Tooltip id="tooltip">
      <strong>Please verify your email</strong>
    </Tooltip>
  );

  return (
    <>
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
      <Head>
        <title>Dashboard | Psychix</title>
        <meta name="description" content="Dashboard | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={"container-fluid p-0 professionalNav"}>
          <ProfessionalNavbar image="/images/avatar.png" />
        </div>
        <div className={styles.bodyContainer}>
          <ProfessionalTopSection
            tabsData={tabsData}
            handleSelectTab={handleSelectTab}
            routedata={["Dashboard", "Overview"]}
            activeTab={"overview"}
            title={`Welcome back, ${userInfo?.first_name} 👏🏻`}
          />
          <OverlayTrigger
            trigger={["hover"]}
            placement="left"
            overlay={!userInfo?.isEmailVerified ? tooltip : <></>}
          >
            <div
              role="button"
              onClick={(e) =>
                userInfo?.isEmailVerified &&
                !userInfo?.is_stripe_setup &&
                requestForStripeConnectAccount(e)
              }
              className={classNames(
                !(userInfo?.isEmailVerified && !userInfo?.is_stripe_setup) &&
                  "cursor-normal",
                !userInfo?.isEmailVerified && "button-diabled",
                styles.addANewAccountButton
              )}
            >
              {loader ? (
                <span
                  className={`spinner-border me-2 spinner-border-sm ${styles.SearchIcon}`}
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : !userInfo?.is_stripe_setup ? (
                "Setup Your Account"
              ) : (
                "Account Verified"
              )}
            </div>
          </OverlayTrigger>

          <div className={classNames(styles.overViewainContainer)}>
            <div className={classNames(styles.leftContainer)}>
              <div>
                <div
                  className={classNames(
                    styles.cardContainer,
                    "d-flex gap-4 flex-wrap"
                  )}
                >
                  <HomeCards
                    tooltip={tooltip}
                    cardHeading={"Next Appointment"}
                    userInfo={userInfo}
                    // isDisabled={
                    //   !(userInfo?.isEmailVerified && userInfo?.is_stripe_setup)
                    // }
                    cardContent={
                      dashboardData?.next_appointment_detail?.start_date
                        ? convertUnixToHumanReadableDate(
                            dashboardData?.next_appointment_detail?.start_date
                          )
                        : "No Upcoming Appointments"
                    }
                    cardSubContent={
                      dashboardData?.next_appointment_detail?.start_time &&
                      convertUnixToHumanReadableTime(
                        dashboardData?.next_appointment_detail?.start_time
                      )
                    }
                    cardBtn={"View all"}
                    link={"/professional/dashboard/appointments"}
                  />
                  {/* <HomeCards
                    cardHeading={"Next Appointment"}
                    cardContent={
                      userInfo?.next_appointment_detail?.date
                        ? getFormatedDate(
                          userInfo?.next_appointment_detail?.date
                          )
                        : "No Upcoming Appointments"
                    }
                    cardSubContent={
                      userInfo?.next_appointment_detail?.time &&
                      getFormattedTime(
                        userInfo?.next_appointment_detail?.time
                      )
                    }
                    cardBtn={"View all"}
                    link={"/professional/appointments"}
                  /> */}
                  <HomeCards
                    tooltip={tooltip}
                    cardBtn={"View wallet"}
                    cardHeading={"Your Wallet"}
                    userInfo={userInfo}
                    cardContent={`$ ${
                      dashboardData?.wallet_amount
                        ? dashboardData?.wallet_amount
                        : 0
                    }`}
                    helperText={
                      "Please setup your account for accessing wallet"
                    }
                    // cardSubContent={"This includes referral fees"}
                    // link={"/professional/settings/wallet"}
                    link={"/professional/dashboard/wallet"}
                  />
                </div>
              </div>
            </div>
            <div
              className={classNames(
                styles.RightContainer,
                userInfo?.isEmailVerified && styles.top10
              )}
            >
              <HomeRightSide
                pName={"Tina W."}
                data={dashboardData}
                userData={userInfo}
                productInfo={productInfo}
                totalRatings={dashboardData?.total_rating?.averagerating}
                customProfileWrapperClass={styles.profileWrapper}
                isPsychic={true}
              />
            </div>
          </div>
          <img
            className={styles.professionalOverviewImage}
            src={"/images/bgProfessionalDashboard.svg"}
          />
        </div>
      </main>
    </>
  );
}

export default Index;
