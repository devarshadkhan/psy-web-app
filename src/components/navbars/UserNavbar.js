import styles from "@/styles/components/navbar/Navbar.module.css";
import { MdKeyboardArrowDown } from "react-icons/md";
import Notification from "../icons/Notification";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Messenger from "../icons/Messenger";
import Profile from "../icons/Profile";
import Security from "../icons/Security";
import classNames from "classnames";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setProfileImage } from "@/store/common/userinfo";
import VerifyEmail from "../verifyEmail/VerifyEmail";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getDatabase, onValue, ref } from "firebase/database";
import { firebseInit, getDbdata } from "@/utils/firebase";

function UserNavbar({ image }) {
  const route = useRouter();
  const { token, refreshToken } = route.query;
  const [width, setWidth] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState(true);
  const dispatch = useDispatch();
  const profileImage = useSelector((state) => state.profileImage);

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
    if (userProfile) {
      setUserData(JSON.parse(userProfile));
    }
  }, []);

  const handleResize = () => {
    setToggle(false);
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", function () {
      if (window.innerWidth > 992) {
        document
          .querySelectorAll(".navbar .nav-item")
          .forEach(function (everyitem) {
            everyitem.addEventListener("mouseover", function (e) {
              let el_link = this.querySelector("img[data-bs-toggle]");

              if (el_link != null) {
                let nextEl = el_link.nextElementSibling;

                nextEl?.classList.add("show");
              }
            });
            everyitem.addEventListener("mouseleave", function (e) {
              let el_link = this.querySelector("img[data-bs-toggle]");

              if (el_link != null) {
                let nextEl = el_link.nextElementSibling;
                nextEl?.classList.remove("show");
              }
            });
          });
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  async function handleLogout() {
    setLoader(true);
    if (typeof window !== "undefined") {
      var refreshToken = localStorage.getItem("userTokenRefresh");
      var accessToken = localStorage.getItem("userToken");
    }
    await axiosInstance
      .post(API.logout, { refreshToken, accessToken })
      .then(() => {
        localStorage.clear();
        route.push("/client/login");
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
  }

  const handleNavigation = () => {
    route.push("/client/dashboard/explore");
  };
  const [img, setImg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
      setImg(item?.banner);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));

      dispatch(setProfileImage(item?.picture));
    }
  }, []);

  async function getProfileData() {
    await axiosInstance
      .get(API.getUserProfile)
      .then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res));

        setEmail(res?.isEmailVerified);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    setTimeout(() => {
      if (token) {
        localStorage.setItem("userToken", token);
        localStorage.setItem("userTokenRefresh", refreshToken);
        localStorage.setItem("role", "client");
        getProfileData();
      } else if (localStorage.getItem("userToken")) {
        getProfileData();
      }
    }, 2000);
  }, [token]);

  return (
    <>
      {!email && (
        <>
          <VerifyEmail />
        </>
      )}

      <nav
        className={`navbar navbar-expand-xl navbar-light  ${styles.navPaddding}`}
      >
        <div className="container-fluid p-0">
          <Link className="navbar-brand " href="/client/dashboard">
            <img className={styles.navLogo} src="/images/psychia-logo.svg" />
          </Link>

          {/* {width <= 991 ? (
            <span className="ms-auto me-3">
              <Notification />
            </span>
          ) : null} */}
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
              width !== 0 && width <= 991
                ? styles.setOverlay + " collapse navbar-collapse"
                : " collapse navbar-collapse"
            } `}
            id="navbarText"
          >
            <ul
              className={classNames(
                styles.explorePsychics,
                "navbar-nav me-auto mb-2 mb-lg-0"
              )}
            >
              <li>
                <div className={styles.navTopEle}>
                  <span
                    className={`${
                      route.pathname.includes("explore") && styles.Selected
                    } ${styles.navDT} ${styles.navFont}`}
                    onClick={handleNavigation}
                  >
                    Explore Psychics
                  </span>{" "}
                </div>
              </li>
            </ul>
            <ul
              className={
                "navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center " +
                styles.navRightEles
              }
            >
              <li className={styles.navEles}>
                <OverlayTrigger
                  trigger={["hover"]}
                  placement="left"
                  overlay={
                    !email ? (
                      <Tooltip id="tooltip">
                        <strong>Please verify your email</strong>
                      </Tooltip>
                    ) : (
                      <></>
                    )
                  }
                >
                  <Link
                    href={email ? "/client/appointments" : "#"}
                    className={`${
                      route.pathname.includes("appointments") && styles.Selected
                    } ${styles.navEle}  ${!email && "disabled-text"} ${
                      styles.navFont
                    } ${styles.eleSpacing}`}
                  >
                    Appointments
                  </Link>
                </OverlayTrigger>
              </li>
              <li className={styles.navEles}>
                <OverlayTrigger
                  trigger={["hover"]}
                  placement="left"
                  overlay={
                    !email ? (
                      <Tooltip id="tooltip">
                        <strong>Please verify your email</strong>
                      </Tooltip>
                    ) : (
                      <></>
                    )
                  }
                >
                  <Link
                    href={email ? "/client/settings/wallet" : "#"}
                    className={`${
                      route.pathname.includes("wallet") && styles.Selected
                    } ${!email && "disabled-text"} ${styles.navEle} ${
                      styles.navFont
                    } ${styles.eleSpacing}`}
                  >
                    Wallet
                  </Link>
                </OverlayTrigger>
              </li>
              {width > 991 ? (
                <li className={styles.navEles}>
                  <Link
                    href="/client/settings"
                    className={`${
                      route.asPath === "/client/settings" && styles.Selected
                    } ${styles.navEle} ${styles.navFont} ${styles.eleSpacing}`}
                  >
                    Settings
                  </Link>
                </li>
              ) : (
                <li className={styles.navEles}>
                  <div className={"dropdown "}>
                    <span
                      className={`${styles.navFont}`}
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ marginLeft: "20px" }}
                    >
                      Settings
                      <span>
                        <MdKeyboardArrowDown className={styles.downIcon} />
                      </span>
                    </span>{" "}
                    <ul
                      className={"dropdown-menu " + styles.DDoverlay}
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li>
                        <Link className="dropdown-item" href="/client/settings">
                          Edit Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          href="/client/settings/security"
                        >
                          Security
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          href="/client/settings/wallet"
                        >
                          Wallet
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          href="/client/settings/notifications"
                        >
                          Notifications
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
              )}

              <li className={styles.navEles}>
                <Link
                  href="/client/settings"
                  className={`btn  ${styles.outlinedBtn} ${styles.navFont} ${styles.eleSpacing}`}
                >
                  Edit your profile
                </Link>
              </li>
              {/* {width >= 991 ? (
                <li className={styles.navEles}>
                  <div className={styles.notificationWrapper}>
                    <Notification />
                    <span className={styles.ShowNotification}>
                      <ShowNotification />
                    </span>
                  </div>
                </li>
              ) : null} */}

              <li className={styles.navEles} id="avatar-menu">
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
                        className={`${styles.eleSpacing} ${styles.navProfile}`}
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
                            href="/client/messenger"
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
                            href="/client/profile"
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
                            href="/client/settings/notifications"
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
                            href="/client/settings/security"
                          >
                            <span className={styles.DDIcon}>
                              <Security />
                            </span>
                            Security
                          </Link>
                        </li>
                        {/* <li className="d-flex gap-2"> */}
                        <button
                          className={`w-100 mt-3 btn text-center ${styles.dropdownBtn} ${styles.dropdownBtn2}`}
                          onClick={handleLogout}
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
                          {/* Logout */}
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
                          className={`${styles.eleSpacing} ${
                            styles.navProfile
                          } ${"cursor-pointer"}`}
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
                              className="dropdown-item"
                              href="/client/messenger"
                            >
                              <span className={styles.DDIcon}>
                                <Messenger />
                              </span>
                              Messenger
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              href="/client/profile"
                            >
                              <span className={styles.DDIcon}>
                                <Profile color="#777E90" />
                              </span>
                              Your Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              href="/client/settings/notifications"
                            >
                              <span className={styles.DDIcon}>
                                <Notification />
                              </span>
                              Notifications
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              href="/client/settings/security"
                            >
                              <span className={styles.DDIcon}>
                                <Security />
                              </span>
                              Security
                            </Link>
                          </li>
                          <li className="">
                            <button
                              className={` w-100 mt-3 btn text-center ${styles.dropdownBtn} ${styles.dropdownBtn2}`}
                              onClick={handleLogout}
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
                              {/* Logout */}
                            </button>
                          </li>
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

export default UserNavbar;
