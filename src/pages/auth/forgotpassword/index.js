import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { forgotpasswordCall } from "@/store/client/forgotpassword"; 
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function forgotpassword() {
  const router = useRouter();
  const dispatch = useDispatch();
  const query = router.query;
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const { loading, error, success, userInfo } = useSelector(
    (state) => state.forgotpassword
  );

  const loginAction = (data) => {
    dispatch(forgotpasswordCall(data));
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
      <main id="main" className={classNames(styles.main)}>
        <div className="container-fluid">
          <div className="row">
            <div className={classNames(styles.leftDiv, "col-sm-6 p-0")}>
              <div className="w-100">
                <div className={styles.logoDiv}>
                  <img className={styles.logo} src="/images/logo.svg" />
                </div>
                <div className={styles.formDiv}>
                  <div className={`${styles.titleBox}`}>
                    <h1>Forget Password</h1>
                  </div>

                  <form className="mt-5" onSubmit={handleSubmit(loginAction)}>
                    <div className="row">
                      <div className="col">
                        <div className="form-floating mb-4">
                          <input 
                            type="text"
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
                      <div className="col d-grid gap-2"> 
                        <button
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
                              Loading...
                            </>
                          ) : (
                            "Continue"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

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
