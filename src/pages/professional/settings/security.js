import React from "react";
import styles from "@/styles/client/settings/Security.module.css";
import UserNavbar from "@/components/navbars/UserNavbar";
import EditProfileSidebar from "@/components/editprofilesidebar/EditProfileSidebar";
import { checkPasswordStrength, generatePassword } from "@/utils/password";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { forgotpasswordCall } from "@/store/client/forgotpassword";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import updatePassword from "@/store/client/updatePassword";
import { useRouter } from "next/router";
import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import ProfessionalSidebar from "@/components/addSidebar/professionalSidebar";
import { convertToRelativePastDate } from "@/utils/common";
import Head from "next/head";
const Security = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [enable, setEnable] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const strengthName = [
    "Very Weak",
    "Weak",
    "Fairly Strong",
    "Strong",
    "Very Strong",
  ];

  const [passwordType, setPasswordType] = useState("password");
  const [passwordType1, setPasswordType1] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoutLoader, setLogoutLoader] = useState("");
  const [passWordStrength, setpasswordStrength] = useState(0);

  const togglePassword = (e) => {
    setShowPassword(!showPassword);
    if (passwordType === "password") {
      setPasswordType("text");
    } else if (passwordType === "text") {
      setPasswordType("password");
    }
  };
  const togglePassword1 = (e) => {
    setShowPassword1(!showPassword1);
    if (passwordType1 === "password") {
      setPasswordType1("text");
    } else if (passwordType1 === "text") {
      setPasswordType1("password");
    }
  };

  const toggleConfirmPassword = (e) => {
    setShowConfirmPassword(!showConfirmPassword);
    if (confirmPasswordType === "password") {
      setConfirmPasswordType("text");
    } else if (confirmPasswordType === "text") {
      setConfirmPasswordType("password");
    }
  };

  const {
    register,
    watch,
    reset,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", reValidateMode: "onChange" });

  const [loader, setLoader] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
      setUserInfo(item);
    }
  }, []);
  const updatePassowrd = async () => {
    setLoader(true);
    setEnable(false);

    const values = getValues();
    axiosInstance
      .post(`${API.updatePassowrd}`, {
        oldPassword: values.oldpassword,
        newPassword: values.password,
      })
      .then((res) => {
        // if (res?.status) {
        toast.success(res.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        reset({
          oldpassword: "",
          password: "",
          confirmPassword: "",
        });
        localStorage.setItem("userInfo", JSON.stringify(res?.user));
        setUserInfo(res);
        setLoader(false);
        setShow(false);
        setEnable(true);
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
        setLoader(false);
        // setShow(false);
      });
  };

  const [pwd, setPwd] = useState();
  const [confirmPwd, setConfirmPwd] = useState();

  const handlePwdChange = (e) => {
    e.preventDefault();
    setPwd(e.target.value);
  };
  const handlePwdChangesnd = (e) => {
    e.preventDefault();
    setPwd(e.target.value);
  };

  const handleConfirmPwdChange = (e) => {
    e.preventDefault();
    setConfirmPwd(e.target.value);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const items = localStorage.getItem("userTokenRefresh");
    }
  }, []);

  const [logginSession, setLogginSession] = useState([]);
  const [logginSessionLoader, setLogginSessionLoader] = useState(false);
  const getLogginSession = async () => {
    const items = localStorage.getItem("userTokenRefresh");
    setLogginSessionLoader(true);
    await axiosInstance
      .get(`${API.getLogginSession}/${items}`)
      .then((res) => {
        setLogginSessionLoader(false);
        setLogginSession(res.sessions);
      })
      .catch((error) => {
        setLogginSessionLoader(false);
        console.error(error);
      });
  };

  useEffect(() => {
    getLogginSession();
  }, []);

  const getFormattedTime = (time) => {
    const today = new Date(time);
    const hours = today.getHours();
    const minutes = today.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedTime = `${formattedHours
      .toString()
      .padStart(2, "0")} : ${minutes} ${ampm}`;
    return formattedTime;
  };
  const getFormatedDate = (date) => {
    const today = new Date(date);

    return `${today.getDate()} ${today.toLocaleString("default", {
      month: "long",
    })}, ${today.getFullYear()}`;
  };

  const deleteLogginSession = async (_id, item) => {
    setLogoutLoader(_id);
    await axiosInstance
      .delete(`${API.logoutDevice}/${_id}`)
      .then((res) => {
        setLogoutLoader("");
        getLogginSession();
      })
      .catch((error) => {
        setLogoutLoader("");
        console.error(error);
      });
  };
  return (
    <>
      <Head>
        <title>Security | Psychix</title>
        <meta name="description" content="Security | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
      <ProfessionalNavbar />

      <section className={styles.edit_security}>
        <div className={classNames(styles.cntr_main, "container-fluid")}>
          <div className="row">
            <div className="col-lg-3 col-md-12 col-sm-12">
              <ProfessionalSidebar />
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12">
              <div className={styles.edititing_profile}>
                <div className={styles.edit_name}>
                  <h2>Security</h2>
                </div>

                <div className={styles.security_info}>
                  <h6>Login</h6>

                  <div className={styles.updt_password}>
                    <div>
                      <h6>Password</h6>
                      <p>
                        Last updated{" "}
                        {convertToRelativePastDate(userInfo?.password_updated)}
                      </p>
                    </div>
                    <button onClick={handleShow}>Update password</button>
                  </div>
                  <hr />
                </div>

                {false && (
                  <div className={styles.security_info}>
                    <h6>Social accounts</h6>

                    <div className={styles.updt_flex}>
                      <div className={styles.updt_passwords}>
                        <div>
                          <h6>Facebook</h6>
                          <p>Not connected</p>
                        </div>
                        <button>Connect</button>
                      </div>
                      <div className={styles.updt_passwords}>
                        <div>
                          <h6>Twitter</h6>
                          <p>Not connected</p>
                        </div>
                        <button>Connect</button>
                      </div>
                    </div>
                    <img
                      src="/images/SettingsImage/divider.png"
                      alt=""
                      className={styles.bottom_image}
                    />
                  </div>
                )}

                <div className={styles.security_info}>
                  <h6>Device history</h6>

                  {logginSessionLoader ? (
                    <span
                      className="spinner-border me-2 spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : logginSession.length === 0 ? (
                    <div
                      className={
                        "NoDataFound d-flex mt-3 align-items-center justify-content-center"
                      }
                    >
                      No Availabe Data
                    </div>
                  ) : (
                    logginSession?.map((item, id) => {
                      return (
                        <>
                          <div className={styles.updt_password}>
                            <div>
                              <p className={styles.Agent_name}>
                                {item.userAgent}
                              </p>
                              <p>
                                {getFormatedDate(item.updatedAt)} at{" "}
                                {getFormattedTime(item.loginTime)}
                              </p>
                            </div>
                            <button
                              disabled={
                                logoutLoader === item._id || item.current
                              }
                              onClick={() => deleteLogginSession(item._id)}
                            >
                              {item.current ? (
                                "Current Device"
                              ) : (
                                <>
                                  {logoutLoader === item._id ? (
                                    <>
                                      <span
                                        className="spinner-border me-2 spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                      logging out
                                    </>
                                  ) : (
                                    "Logout of device"
                                  )}
                                </>
                              )}
                            </button>
                          </div>
                          <img
                            src="/images/SettingsImage/divider.png"
                            alt=""
                            className={styles.bottom_social_image}
                          />
                        </>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      ></div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Password update</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form action="" onSubmit={handleSubmit(updatePassowrd)}>
            <div className="modal-body">
              <div className="row">
                <div className="col">
                  <div className="mb-4">
                    <div
                      className={`input-group  ${
                        errors.password && styles.invalid
                      } rounded`}
                    >
                      <div className="form-floating">
                        <input
                          type={passwordType1}
                          className={`${styles.greyInputBg} ${styles.RBorder} form-control`}
                          id="floatingInputPassword"
                          placeholder="Current Password"
                          // onChange={(event) => setOldpassword(event.target.value)}
                          onChange={handlePwdChangesnd}
                          {...register("oldpassword", {
                            required: {
                              value: true,
                              message: "This is a Required Field",
                            },
                            pattern: {
                              value:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-\+=:;"'?\/>.<,{}\[\]])[a-zA-Z\d~`!@#$%^&*()_\-\+=:;"'?\/>.<,{}\[\]]{8,}$/,
                              message:
                                "Password must be 8 characters and must contain atleast 1 small alphabet, 1 capital alphabet, 1 numeric value and 1 special character",
                            },
                            minLength: {
                              value: 8,
                              message:
                                "password should contain minimum 8 charaters long",
                            },
                            maxLength: {
                              value: 20,
                              message:
                                "password should contain maximum 20 charaters long",
                            },
                          })}
                        />
                        <label
                          htmlFor="floatingInputPassword"
                          className={styles.floatingLabel}
                        >
                          Current Password
                        </label>
                      </div>
                      <span
                        className={"input-group-text " + styles.eyeBg}
                        id="basic-addon2"
                        onClick={togglePassword1}
                      >
                        {!showPassword1 ? (
                          <AiOutlineEyeInvisible className={styles.eyeIcon} />
                        ) : (
                          <AiOutlineEye className={styles.eyeIcon} />
                        )}
                      </span>
                    </div>
                    {errors.oldpassword && (
                      <span
                        className="invalid-feedback"
                        style={{ fontWeight: "bold", fontSize: "10px" }}
                      >
                        {errors?.oldpassword?.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="mb-4">
                    <div
                      className={`input-group  ${
                        errors.password && styles.invalid
                      } rounded`}
                    >
                      <div className="form-floating">
                        <input
                          type={passwordType}
                          className={`${styles.greyInputBg} ${styles.RBorder} form-control`}
                          id="floatingInputPassword"
                          placeholder="New Password"
                          // onChange={(event) => setNewPassword(event.target.value)}
                          onChange={handlePwdChange}
                          {...register("password", {
                            required: {
                              value: true,
                              message: "This is a Required Field",
                            },
                            onChange: (e) => {
                              const passwordStrengthValue =
                                checkPasswordStrength(e.target.value);
                              setpasswordStrength(passwordStrengthValue);
                            },
                            validate: (value) => {
                              if (value === getValues()?.confirmPassword) {
                                setError("confirmPassword", "");
                              }
                            },
                            pattern: {
                              value:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-\+=:;"'?\/>.<,{}\[\]])[a-zA-Z\d~`!@#$%^&*()_\-\+=:;"'?\/>.<,{}\[\]]{8,}$/,
                              message:
                                "Password must be 8 characters and must contain atleast 1 small alphabet, 1 capital alphabet, 1 numeric value and 1 special character",
                            },
                            minLength: {
                              value: 8,
                              message:
                                "password should contain minimum 8 charaters long",
                            },
                            maxLength: {
                              value: 20,
                              message:
                                "password should contain maximum 20 charaters long",
                            },
                          })}
                        />
                        <label
                          htmlFor="floatingInputPassword"
                          className={styles.floatingLabel}
                        >
                          New Password
                        </label>
                      </div>
                      <span
                        className={"input-group-text " + styles.eyeBg}
                        id="basic-addon2"
                        onClick={togglePassword}
                      >
                        {!showPassword ? (
                          <AiOutlineEyeInvisible className={styles.eyeIcon} />
                        ) : (
                          <AiOutlineEye className={styles.eyeIcon} />
                        )}
                      </span>
                    </div>
                    {errors?.password && (
                      <span
                        className="invalid-feedback"
                        style={{ fontWeight: "bold", fontSize: "10px" }}
                      >
                        {errors?.password?.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="mb-4">
                    <div
                      className={`input-group  ${
                        errors.password && styles.invalid
                      } rounded`}
                    >
                      <div className="form-floating">
                        <input
                          type={confirmPasswordType}
                          className={`${styles.greyInputBg} ${styles.RBorder} form-control`}
                          id="floatingInputPassword"
                          placeholder="Confirm Password"
                          onChange={handleConfirmPwdChange}
                          {...register("confirmPassword", {
                            required: {
                              value: true,
                              message: "This is a Required Field",
                            },
                            validate: (value) =>
                              value === watch("password") ||
                              "Passwords do not match.",
                            pattern: {
                              value:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-\+=:;"'?\/>.<,{}\[\]])[a-zA-Z\d~`!@#$%^&*()_\-\+=:;"'?\/>.<,{}\[\]]{8,}$/,
                              message:
                                "Password must be 8 characters and must contain atleast 1 small alphabet, 1 capital alphabet, 1 numeric value and 1 special character",
                            },
                            minLength: {
                              value: 8,
                              message:
                                "password should contain minimum 8 charaters long",
                            },
                            maxLength: {
                              value: 20,
                              message:
                                "password should contain maximum 20 charaters long",
                            },
                          })}
                        />
                        <label
                          htmlFor="floatingInputPassword"
                          className={styles.floatingLabel}
                        >
                          Confirm Password
                        </label>
                      </div>
                      <span
                        className={"input-group-text " + styles.eyeBg}
                        id="basic-addon2"
                        onClick={toggleConfirmPassword}
                      >
                        {!showConfirmPassword ? (
                          <AiOutlineEyeInvisible className={styles.eyeIcon} />
                        ) : (
                          <AiOutlineEye className={styles.eyeIcon} />
                        )}
                      </span>
                    </div>
                    {errors?.confirmPassword && (
                      <span
                        className="invalid-feedback"
                        style={{ fontWeight: "bold", fontSize: "10px" }}
                      >
                        password does not match
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center w-100">
                <div
                  className={classNames(
                    styles.customProgressStylng,
                    "progress"
                  )}
                >
                  <div
                    className={classNames(
                      styles.customProgressBarStylng,
                      "progress-bar"
                    )}
                    role="progressbar"
                    style={{
                      width: `${(passWordStrength / 5) * 100}%`,
                    }}
                    aria-valuenow={(passWordStrength / 5) * 100}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>

                <div
                  className={classNames(
                    styles.passWordStrength,
                    "ml-auto mb-2"
                  )}
                >
                  {strengthName[passWordStrength - 1]}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {/* <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                 data-bs-dismiss="modal"
              >
                Close
              </button> */}
              <button
                type="submit"
                className="btn btn-primary"
                // disabled={enable}
                disabled={pwd === confirmPwd && confirmPwd}
                style={{
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  fontWeight: "bold",
                }}
                // onClick={reveiw}
              >
                {loader ? (
                  <>
                    <span
                      className="spinner-border me-2 spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    updating...
                  </>
                ) : (
                  "update password"
                )}
              </button>
            </div>
          </form>
        </Modal.Body>
        {/* 
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default Security;
