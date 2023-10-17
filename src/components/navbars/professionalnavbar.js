import styles from "@/styles/components/navbar/ProfessionalNavbar.module.css";
import Notification from "../icons/Notification";
import { useState, useEffect } from "react";
import Messenger from "../icons/Messenger";
import Profile from "../icons/Profile";
import Security from "../icons/Security";
import Horroscope from "../icons/Horroscope";
import { FiSearch } from "react-icons/fi";
import classNames from "classnames";
import { BiBell } from "react-icons/bi";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import { isJSONString } from "@/utils/common";
import { useDispatch, useSelector } from "react-redux";
import { setProfileImage } from "@/store/common/userinfo";
import VerifyEmail from "../verifyEmail/VerifyEmail";
import Link from "next/link";
import StripeSetupNotification from "../stripeSetup/stripeSetupNotification";
import { ToastContainer, toast } from "react-toastify";
import { getDatabase, onValue, ref } from "firebase/database";
import { firebseInit, getDbdata } from "@/utils/firebase";

function ProfessionalNavbar() {
  const [width, setWidth] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const route = useRouter();
  const profileImage = useSelector((state) => state.profileImage);
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState(true);
  const [isStripeSetup, setIsStripeSetup] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));

      dispatch(setProfileImage(item?.picture));
      setIsStripeSetup(item?.is_stripe_setup);
    }
  }, []);

  useEffect(() => {
    if (userData?.id) {
      firebseInit().then((response) => {
        getDbdata((res) => {
          if (res?.users) {
            if (!email && res?.users[userData?.id]?.email_verified) {
              route.reload(route.pathname);
            }   
            setEmail(res?.users[userData?.id]?.email_verified);
          }
        });
      });
    }
  }, [userData]);

  useEffect(() => {
    const userProfile = localStorage.getItem("userInfo");
    if (userProfile && isJSONString(userProfile)) {
      setUserData(JSON.parse(userProfile));
    }
  }, []);

  const handleResize = () => {
    setToggle(false);
    setWidth(window.innerWidth);
  };

  async function handleLogout() {
    setLoader(true);
    if (typeof window !== "undefined") {
      var refreshToken = localStorage.getItem("userTokenRefresh");

      var accessToken = localStorage.getItem("userToken");
      // console.log("TOKENN",refreshToken)
    }
    await axiosInstance
      .post(API.logout, { refreshToken, accessToken })
      .then(() => {
        localStorage.clear();
        setLoader(false);
        route.push("/professional/login");
      })
      .catch((err) => setLoader(false));
  }

  async function getProfileData() {
    setLoader(true);

    await axiosInstance
      .get(API.getUserProfile)
      .then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res));
        setLoader(false);
        setEmail(res?.isEmailVerified);
      })
      .catch((err) => setLoader(false));
  }

  useEffect(() => {
    handleResize();
  }, []);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // handle click outside function for avatar menu
  const handleClickOutSide = (e) => {
    const concernedElement = document.getElementById("menu");
    if (concernedElement && !concernedElement?.contains(e.target)) {
      setToggle(false);
    }
  };
  useEffect(() => {
    if (toggle) {
      document.addEventListener("mousedown", handleClickOutSide);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [toggle]);

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <>
      {!email && <VerifyEmail />}

      {/* {email && !isStripeSetup && <StripeSetupNotification />} */}

      <nav
        className={`navbar navbar-expand-xl navbar-dark  ${styles.navStyling}`}
      >
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
        <div className="container-fluid p-0">
          <Link className="navbar-brand " href="/professional/dashboard">
            <img
              className={styles.navLogo}
              src="/images/psychia-logo-professional.png"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className={"navbar-toggler-icon " + styles.toggleIcon}></span>
          </button>
          <div
            className={`${
              width !== 0 && width <= 1024
                ? styles.setOverlay + " collapse navbar-collapse"
                : " collapse navbar-collapse"
            } `}
            id="navbarText"
          >
            <ul
              className={
                "navbar-nav w-100 mb-2 mb-lg-0 d-flex align-items-center " +
                styles.navRightEles
              }
            >
              <li className={classNames(styles.navEles)}>
                <Link
                  href="/professional/dashboard"
                  className={`${styles.navEle} ${
                    route.pathname.includes("dashboard") && styles.navSelected
                  } ${styles.navFont} ${styles.eleSpacing}`}
                >
                  Dashboard
                </Link>
              </li>
              <li className={styles.navEles}>
                <Link
                  href="/professional/advertise"
                  className={`${styles.navEle}  ${
                    route.pathname.includes("advertise") && styles.navSelected
                  } ${styles.navFont} ${styles.eleSpacing}`}
                >
                  Advertise
                </Link>
              </li>
              <li className={styles.navEles}>
                <Link
                  href="/professional/settings/profesy"
                  // className={`${styles.navEle} ${styles.navFont} ${styles.eleSpacing}`}
                  className={`${
                    route.pathname.includes("profesy") && styles.navSelected
                  } ${styles.navEle} ${styles.navFont} ${styles.eleSpacing}`}
                >
                  Profesy+
                </Link>
              </li>
              <li className={styles.navEles}>
                <Link
                  href="/professional/settings"
                  className={`${styles.navEle} ${
                    route.pathname.includes("settings") &&
                    !route.pathname.includes("profesy") &&
                    styles.navSelected
                  } ${styles.navEle} ${styles.navFont} ${styles.eleSpacing}`}
                >
                  Settings
                </Link>
              </li>

              <li
                className={classNames("py-0 ms-auto", styles.navEles)}
                id="avatar-menu"
              >
                <div
                  onMouseOver={() => {
                    setToggle(true);
                  }}
                  onMouseLeave={() => setToggle(false)}
                  className="dropdown"
                >
                  {width > 1024 ? (
                    <>
                      {" "}
                      <img
                        onClick={() => setToggle(!toggle)}
                        src={
                          profileImage?.profileImage ||
                          "/images/dummyAvatar.png"
                        }
                        id="dropdownMenuLink"
                        className={`${styles.eleSpacing} ${
                          styles.navProfile
                        } ${"cursor-pointer"}`}
                      />
                      <ul
                        id="menu"
                        className={classNames(
                          styles.avatarDropdown,
                          "dropdown-menu",
                          toggle ? " d-block" : "d-none"
                        )}
                        aria-labelledby="dropdownMenuLink"
                      >
                        <li>
                          <Link
                            className={styles.btn_change}
                            href="/professional/messenger"
                          >
                            <span className={styles.DDIcon}>
                              <Messenger />
                            </span>
                            Messenger
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={styles.btn_change}
                            href="/professional/profile"
                          >
                            <span className={styles.DDIcon}>
                              <Profile color="#777E90" />
                            </span>
                            Your Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={styles.btn_change}
                            href="/professional/settings/notifications"
                          >
                            <span className={styles.DDIcon}>
                              <Notification />
                            </span>
                            Notifications
                          </Link>
                        </li>
                        <hr className="m-2" />
                        <li>
                          <Link
                            className={styles.btn_change}
                            href="/professional/settings/security"
                          >
                            <span className={styles.DDIcon}>
                              <Security />
                            </span>
                            Security
                          </Link>
                        </li>
                        {/* <li className="d-flex gap-2"> */}
                        <button
                          onClick={handleLogout}
                          className={` mt-4 dropdown-item btn text-center ${styles.dropdownBtn} ${styles.dropdownBtn2}`}
                        >
                          {loader ? (
                            <>
                              <span
                                className="spinner-border me-2 spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            </>
                          ) : (
                            "Logout"
                          )}
                        </button>
                        {/* </li> */}
                      </ul>
                    </>
                  ) : (
                    <>
                      <hr className={styles.mobileDivider} />

                      <Link
                        className={classNames(styles.mobileDropAvatar)}
                        data-bs-toggle="collapse"
                        href="#collapseExample"
                        role="button"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                      >
                        <img
                          src={
                            profileImage?.profileImage ||
                            "/images/dummyAvatar.png"
                          }
                          className={`${styles.eleSpacing} ${styles.navProfile}`}
                        />
                        <img src="/images/arrow-down.svg" />
                      </Link>

                      <div
                        className={classNames("collapse", styles.mobile)}
                        id="collapseExample"
                      >
                        <ul
                          className={classNames(
                            styles.navRightElesMob,
                            "card card-body"
                          )}
                          aria-labelledby="dropdownMenuLink"
                        >
                          <li>
                            <Link
                              className={styles.btn_change}
                              href="/professional/messenger"
                            >
                              <span className={styles.DDIcon}>
                                <Messenger />
                              </span>
                              Messenger
                            </Link>
                          </li>
                          <li>
                            <Link
                              className={styles.btn_change}
                              href="/professional/settings"
                            >
                              <span className={styles.DDIcon}>
                                <Profile color="#777E90" />
                              </span>
                              Your Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              className={styles.btn_change}
                              href="/professional/settings/notifications"
                            >
                              <span className={styles.DDIcon}>
                                <Notification />
                              </span>
                              Notifications
                            </Link>
                          </li>
                          <li>
                            <Link
                              className={styles.btn_change}
                              href="/professional/settings/security"
                            >
                              <span className={styles.DDIcon}>
                                <Security />
                              </span>
                              Security
                            </Link>
                          </li>
                          {/* <li className="d-flex gap-2"> */}
                          {/* <button
                              className={`dropdown-item btn ${styles.dropdownBtn} ${styles.dropdownBtn1}`}
                              href="#"
                            >
                              Mobile
                            </button> */}
                          <button
                            onClick={handleLogout}
                            className={`mt-4 dropdown-item btn ${styles.dropdownBtn} ${styles.dropdownBtn2}`}
                            href="#"
                          >
                            Logout
                          </button>
                          {/* </li> */}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default ProfessionalNavbar;
