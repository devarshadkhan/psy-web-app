import { addClientSignupData } from "@/store/client/signup";
import styles from "@/styles/Home.module.css";
import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import classNames from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HelpUs = () => {
  const router = useRouter();
  const { isSuccess } = useSelector((state) => state.signup);
  const [issues, setIssues] = useState("");
  const [other_issues, setOtherIssues] = useState("");
  const [issuesList, setIssuesList] = useState([]);
  const [otherIssuesList, setOtherIssuesList] = useState([]);
  const onSubmitHandeler = (event) => {
    event.preventDefault();
    const currentFormData = {
      ...router.query,
      issues,
      other_issues,
    };
    const queryParams = new URLSearchParams({
      ...currentFormData,
    }).toString();
    document.getElementById("main").classList.add("animate__fadeOut");
    setTimeout(
      () => router.push(`/client/signup/password?${queryParams}`),
      1000
    );
  };
  useEffect(() => {
    if (isSuccess) {
      document.getElementById("main").classList.add("animate__fadeOut");
      setTimeout(() => router.push("/thankyou"), 1000);
    }
  }, [isSuccess]);

  const getIssuesList = async () => {
    axiosInstance.get(API.issues).then((res) => {
      setIssuesList(res?.issues?.issueWith);
      setOtherIssuesList(res?.issues?.otherIssues);
    });
  };

  useEffect(() => {
    getIssuesList();
  }, []);

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
        <title>Client Signup - Psychix</title>
        <meta name="description" content="Client Signup - Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        id="main"
        className={classNames(styles.main, "animate__animated animate__fadeIn")}
      >
        <div className="container-fluid">
          <div className={styles.logoDiv}>
            <img className={styles.logo} src="/images/logo.svg" />
          </div>
          <hr className={classNames(styles.hrLine, "m-0")} />
          <div className="row">
            <div className={classNames(styles.leftDiv, "col-sm-6 p-0")}>
              <div className={classNames(styles.formWrapper, "w-100")}>
                <div className={styles.formDiv + " h-100"}>
                  <div className={styles.titleBox}>
                    <p className={classNames(styles.title, "mb-0")}>
                      Help us, help you
                    </p>
                    <p className={classNames(styles.desc)}>
                      We use AI to help match you with the best psychics in our
                      marketplace and it helps for us to have a bit of
                      preliminary information to start the process. Let us know
                      why you're interested in speaking with a psychic today.
                    </p>
                  </div>

                  <div className={classNames(styles.formtag)}>
                    <>
                      <div className="row mb-4">
                        <div className="col d-grid gap-2">
                          <label
                            className={classNames(
                              styles.selectLabel,
                              styles.clientLabel
                            )}
                          >
                            I'm having issues with
                          </label>
                          <select
                            onChange={(e) => setIssues(e.target.value)}
                            className={
                              "form-select fw-bolder " +
                              styles.selectBg +
                              " " +
                              styles.clentSelect
                            }
                            aria-label="Default select example"
                          >
                            <option defaultValue hidden>
                              Select Your Issues
                            </option>
                            {issuesList.map((items) => {
                              return (
                                <option key={items?._id} value={items?.value}>
                                  {items?.label}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col d-grid gap-2">
                          <label
                            className={classNames(
                              styles.selectLabel,
                              styles.clientLabel
                            )}
                          >
                            Select any other issues you’re facing
                          </label>
                          <select
                            onChange={(e) => setOtherIssues(e.target.value)}
                            className={
                              "form-select fw-bolder " +
                              styles.selectBg +
                              " " +
                              styles.clentSelect
                            }
                            aria-label="Default select example"
                          >
                            <option defaultValue hidden>
                              Select Your Issues with
                            </option>
                            {issuesList.map((items) => {
                              return (
                                <option key={items?._id} value={items?.value}>
                                  {items?.label}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col d-grid gap-2">
                          <button
                            className="btn btn-dark btn-block signupBtn rounded-2"
                            role="button"
                            disabled={!issues || !other_issues}
                            onClick={onSubmitHandeler}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                    <div className={styles.copyright}>
                      © 2023 Psychix. All rights reserved.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={classNames(
                styles.rightDiv,
                " d-flex align-items-center justify-content-start col-sm-6 p-0 "
              )}
            >
              <img
                src={"/images/helper.svg"}
                className={classNames(styles.pageImage, "h-100")}
                alt="helper"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default HelpUs;
