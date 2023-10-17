import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "@/store/client/login";
import { ToastContainer } from "react-toastify";
import { fetchToken } from "@/utils/firebase";

function psychicLogin() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.login);
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
      userLogin({
        ...params,
      })
    )
      .then((res) => {
        if (!res?.error) {
          if (res?.payload?.status) {
            router.push("/client/dashboard");
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
        <title>Client | Sign-in</title>
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
                    <h1>Client Login</h1>
                  </div>
                  {/* <div>
                    <div className="row mb-3">
                      <div className="col d-grid gap-2">
                        <button 
                          className={
                            "btn btn-block loginBtn py-3 " + styles.googleBtn
                          }
                        >
                          <span className={styles.btnImage}>
                            <Google />
                          </span>
                          Sign in with Google
                        </button>
                      </div>
                    </div>
                    <div className="row mb-5">
                      <div className="col d-grid gap-2">
                        <button
                          className={
                            "btn btn-block loginBtn py-3 " + styles.fbBtn
                          }
                        >
                          <span className={styles.btnImage}>
                            <Facebook className={styles.btnImage} />
                          </span>
                          Sign in with Facebook
                        </button>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="d-flex justify-content-between mb-4 ">
                    <div className={styles.lines}></div>
                    <div className={styles.loginText}>Or login with email</div>
                    <div className={styles.lines}></div>
                  </div> */}

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
                            placeholder="Email Address"
                            {...register("email", {
                              required: true,
                              pattern:
                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            })}
                            onChange={(event) =>
                              setValue("email", event.target.value)
                            }
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
                                type={passwordType}
                                className={`${styles.greyInputBg} ${styles.RBorder} form-control`}
                                id="floatingInputPassword"
                                placeholder="Password"
                                autoComplete="off"
                                onChange={(event) =>
                                  setValue("password", event.target.value)
                                }
                                {...register("password", {
                                  required: true,
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
                        <a href={"/client/signup"} className="btn-link ">
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
                styles.bgLoginSideImage
              )}
            ></div>
          </div>
        </div>
      </main>
    </>
  );
}

export default psychicLogin;
