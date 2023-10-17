import styles from "@/styles/Home.module.css";
import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import classNames from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";

const verify = () => {
  const [loader, setLoader] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [Message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const handleVerify = async () => {
    setLoader(true);
    // console.log(id);
    axiosInstance
      .post(`${API.verifyMail}/${id}`)
      .then((res) => {
        setRole(res?.role);
        setLoader(false);
        setIsVerified(true);
        if (typeof window !== "undefined") {
          if (localStorage.getItem("userToken")) {
            let userData = JSON.parse(localStorage.getItem("userInfo"));
            userData.isEmailVerified = true;
            localStorage.setItem("userInfo", JSON.stringify(userData));
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        }
        setMessage("Your account has been verified successfully");
      })
      .catch((err) => {
        if (typeof window !== "undefined") {
          if (localStorage.getItem("userToken")) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        }
        setRole(err?.role);
        setLoader(false);
        setIsVerified(false);
        setMessage(err?.message);
      });
  };

  useEffect(() => {
    if (id) {
      handleVerify();
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>Verify - Psychix</title>
        <meta name="description" content="Verify - Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={classNames(styles.main)}>
        <div className="container-fluid">
          <div className={styles.logoDiv}>
            <img className={styles.logo} src="/images/logo.svg" />
          </div>
          <hr className={classNames(styles.hrLine, "m-0")} />
          <div className="row">
            <div className={classNames(styles.leftDiv, "col-sm-6 p-0")}>
              <div className={classNames(styles.formWrapper, "w-100")}>
                <div
                  className={
                    styles.formDiv +
                    " d-flex align-items-center justify-content-center " +
                    " h-100"
                  }
                >
                  <div
                    className={classNames("row w-100", styles.VerifyContainer)}
                  >
                    {loader ? (
                      <div className="spinner-border " role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <>
                        {isVerified ? (
                          <div className="d-flex align-items-center flex-column">
                            <BsFillCheckCircleFill
                              className={classNames(styles.checkIcons)}
                            />
                            <div className={styles.verificationText}>
                              {Message}
                            </div>
                            {isLoggedIn ? (
                              <button
                                onClick={() =>
                                  role === "client"
                                    ? router.push("/client/dashboard")
                                    : router.push("/professional/dashboard")
                                }
                                className="btn btn-dark btn-block mt-4 signupBtn rounded-2 w-25"
                              >
                                Dashboard
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  role === "client"
                                    ? router.push("/client/login")
                                    : router.push("/professional/login")
                                }
                                className="btn btn-dark btn-block mt-4 signupBtn rounded-2 w-25"
                              >
                                Login
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="d-flex align-items-center flex-column">
                            <AiFillCloseCircle
                              className={classNames(
                                styles.checkIcons,
                                styles.errorIcon
                              )}
                            />
                            <div className={styles.verificationText}>
                              {Message}
                            </div>
                            {isLoggedIn ? (
                              <button
                                onClick={() =>
                                  role === "client"
                                    ? router.push("/client/dashboard")
                                    : router.push("/professional/dashboard")
                                }
                                className="btn btn-dark btn-block mt-4 signupBtn rounded-2 w-25"
                              >
                                Dashboard
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  role === "client"
                                    ? router.push("/client/login")
                                    : router.push("/professional/login")
                                }
                                className="btn btn-dark btn-block mt-4  signupBtn rounded-2 w-25"
                              >
                                Login
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={classNames(
                styles.rightDiv,
                " d-flex align-items-center justify-content-end col-sm-6 p-0 "
              )}
            >
              <img
                src={"/images/Signuppage8.svg"}
                className={classNames(styles.pageImage)}
                alt=""

              />
            </div>
          </div>
        </div>
        {/* <div className="container-fluid">
          <div className={styles.logoDiv}>
            <img className={styles.logo} src="/images/logo.svg" />
          </div>
          <hr className={classNames(styles.hrLine, "m-0")} />
          <div className={classNames("row", styles.VerifyContainer)}>
            {loader ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <>
                {isVerified ? (
                  <div className="d-flex align-items-center flex-column">
                    <BsFillCheckCircleFill
                      className={classNames(styles.checkIcons)}
                    />
                    <div className={styles.verificationText}>
                      Your Account Has been verified Successfully
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center flex-column">
                    <AiFillCloseCircle
                      className={classNames(
                        styles.checkIcons,
                        styles.errorIcon
                      )}
                    />
                    <div className={styles.verificationText}>
                      Email is Not Verified , Please try again
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div> */}
      </main>
    </>
  );
};

export default verify;
