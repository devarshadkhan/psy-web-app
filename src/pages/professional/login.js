import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { professionalLogin } from "@/store/professional/login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchToken } from "@/utils/firebase";

export default function psychicLogin() {
  const router = useRouter();

  const { loading } = useSelector((state) => state.professionalLogin);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const loginAction = async (data) => {
    const fcm_token = await fetchToken();
    let params = {
      ...data,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    if (fcm_token) {
      params["fcm_token"] = fcm_token;
      params["device_type"] = "web";
    }
    dispatch(
      professionalLogin({
        ...params,
      })
    )
      .then((res) => {
        if (!res?.error) {
          if (res?.payload?.status) {
            router.push("/professional/dashboard");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

  const togglePassword = (e) => {
    setShowPassword(!showPassword);
    if (passwordType === "password") {
      setPasswordType("text");
    } else if (passwordType === "text") {
      setPasswordType("password");
    }
  };

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
        <title>Psychix | Registration</title>
        <meta name="description" content="Psychix | Registration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={classNames(styles.main)}>
        <div className="container-fluid">
          <div className="row">
            <div className={classNames(styles.leftDiv, "col-sm-6 p-0")}>
              <div className="w-100">
                <div className={styles.logoDiv}>
                  <img className={styles.logo} src="/images/logo.svg" />
                </div>
                <div className={styles.formDiv}>
                  <div className={styles.titleBox}>
                    <h1>Psychic login</h1>
                  </div>

                  <form onSubmit={handleSubmit(loginAction)}>
                    <div className="row">
                      <div className="col">
                        <div className="form-floating mb-4">
                          <input
                            type="text"
                            autoComplete="off"
                            className={`${styles.greyInputBg} ${
                              errors.email && styles.invalid
                            } form-control`}
                            id="floatingInputEmail"
                            onChange={(event) =>
                              setValue("email", event.target.value)
                            }
                            placeholder="Email Address"
                            {...register("email", {
                              required: true,
                              pattern:
                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            })}
                          />
                          <label
                            htmlFor="floatingInputEmail"
                            className={styles.floatingLabel}
                          >
                            Email Address
                          </label>
                          {errors.email && (
                            <span className="invalid-feedback">
                              Please enter valid Email Address
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
                                autoComplete="off"
                                type={passwordType}
                                className={`${styles.greyInputBg} ${styles.RBorder} form-control`}
                                id="floatingInputPassword"
                                placeholder="Password"
                                onChange={(event) =>
                                  setValue("password", event.target.value)
                                }
                                {...register("password", {
                                  required: true,
                                  pattern: {
                                    value:
                                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-\+=:;"'?\/>.<,{}\[\]])[a-zA-Z\d~`!@#$%^&*()_\-\+=:;"'?\/>.<,{}\[\]]{8,}$/,
                                    message:
                                      "Password must be minimum 8 charaters long and maximum 20 charaters long and must contain atleast 1 small alphabet, 1 capital alphabet, 1 numeric value and 1 special character",
                                  },
                                  minLength: {
                                    value: 8,
                                    message:
                                      "Password must be minimum 8 charaters long and maximum 20 charaters long and must contain atleast 1 small alphabet, 1 capital alphabet, 1 numeric value and 1 special character",
                                  },
                                  maxLength: {
                                    value: 20,
                                    message:
                                      "Password must be minimum 8 charaters long and maximum 20 charaters long and must contain atleast 1 small alphabet, 1 capital alphabet, 1 numeric value and 1 special character",
                                  },
                                })}
                              />
                              <label
                                htmlFor="floatingInputPassword"
                                className={styles.floatingLabel}
                              >
                                Password
                              </label>
                            </div>
                            <span
                              className={"input-group-text " + styles.eyeBg}
                              id="basic-addon2"
                              onClick={togglePassword}
                            >
                              {!showPassword ? (
                                <AiOutlineEyeInvisible
                                  className={styles.eyeIcon}
                                />
                              ) : (
                                <AiOutlineEye className={styles.eyeIcon} />
                              )}
                            </span>
                          </div>
                          {errors.password && (
                            <span className="invalid-feedback">
                              {errors?.password?.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col d-grid gap-2">
                        <button
                          disabled={loading}
                          className="btn btn-dark btn-block signupBtn"
                          type="submit"
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border me-2 spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Logging In
                            </>
                          ) : (
                            "Login"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="row mt-2">
                    <div className={styles.loginDiv + " col"}>
                      <p>
                        Don’t have an account?{" "}
                        <a href={"/professional/signup"} className="btn-link">
                          Signup
                        </a>
                      </p>
                      <p className={styles.forgotPasswordDeskTop}>
                        Forgot your password?{" "}
                        <a href="/auth/forgotpassword" className="btn-link">
                          Reset it
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col">
                      <p className={styles.copyright + " mt-4"}>
                        © 2023 Psychix. All rights reserved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={classNames(
                styles.rightDiv,
                " d-flex align-items-center justify-content-center col-sm-6 p-0 ",
                styles.bgPsychicImage
              )}
            ></div>
          </div>
        </div>
      </main>
    </>
  );
}
