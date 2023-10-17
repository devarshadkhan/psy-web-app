import styles from "@/styles/Home.module.css";
import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userClientSignup } from "@/store/client/signup";
import { Modal } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  const [isPrivacy, setIsPrivacy] = useState(false);
  const router = useRouter();
  const { formData, loading, isSuccess } = useSelector(
    (state) => state.clientSignup
  );
  const [refSite, setRefSite] = useState("");
  const [findUs, setFindUs] = useState("");
  const [show, setShow] = useState(false);
  const [html, setHtml] = useState("");
  useEffect(() => {
    async function loadHtml() {
      const response = await fetch("/termsandConditions.html");
      const text = await response.text();
      setHtml(text);
    }
    loadHtml();
  }, []);

  const handleShow = (e) => {
    e.stopPropagation();
    setShow(true);
  };

  const registerAction = async (e) => {
    let params = {
      ...router.query,
      ref_site: refSite,
      find_us: findUs,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    delete params.confirmPassword;
    dispatch(userClientSignup(params));
  };

  const handleClose = () => setShow(false);

  useEffect(() => {
    if (isSuccess) {
      document.getElementById("main").classList.add("animate__fadeOut");
      setTimeout(() => router.push("/client/thankyou"), 1000);
    }
  }, [isSuccess]);

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
                      Last thing
                    </p>
                    <p className={classNames(styles.desc)}>
                      We love hearing about how our users find our platform, as
                      it helps us expand to a larger user base, which in turn
                      helps lower our rates.
                    </p>
                  </div>

                  <div className={classNames(styles.formtag)}>
                    <>
                      <div className="row mb-4">
                        <div className="col d-grid gap-2">
                          <label className={styles.selectLabel}>
                            Which psychic website have you used before?{" "}
                          </label>
                          <select
                            onChange={(event) => setRefSite(event.target.value)}
                            className={
                              "form-select fw-bolder " +
                              styles.selectBg +
                              " " +
                              styles.clentSelect
                            }
                            aria-label="Default select example"
                          >
                            <option defaultValue hidden>
                              Select Psychic Website
                            </option>
                            <option value="california_psychics">
                              California Psychics
                            </option>
                            <option value="kasamba">Kasamba</option>
                            <option value="oranum">Oranum</option>
                            <option value="keen">Keen</option>
                            <option value="everclear">Everclear</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col d-grid gap-2">
                          <label className={styles.selectLabel}>
                            Where did you find us?
                          </label>
                          <select
                            onChange={(event) => setFindUs(event.target.value)}
                            className={
                              "form-select fw-bolder " +
                              styles.selectBg +
                              " " +
                              styles.clentSelect
                            }
                            aria-label="Default select example"
                          >
                            <option defaultValue hidden>
                              Select Platform
                            </option>
                            <option value="google">Google</option>
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col">
                          <div className="form-check d-flex form-switch">
                            <input
                              className={"form-check-input " + styles.toggleBtn}
                              type="checkbox"
                              onClick={(e) => setIsPrivacy(e.target.checked)}
                              id="flexSwitchCheckDefault"
                            />
                            <label
                              className={
                                "form-check-label " + styles.checkboxLabel
                              }
                              htmlFor="flexSwitchCheckDefault"
                            >
                              I agree to the Profesy{"    "}
                            </label>{" "}
                            <u>
                              <Link
                                href={`${process.env.PROJECT_URL}/terms-condition`}
                                // onClick={handleShow}
                                target="_blank"
                                className={classNames(
                                  styles.terms,
                                  "cursor-pointer ff-Nexa-Bold"
                                )}
                              >
                                Terms & Condition
                              </Link>
                            </u>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col d-grid gap-2">
                          <button
                            className="btn btn-dark btn-block signupBtn rounded-2"
                            disabled={
                              loading || !isPrivacy || !findUs || !refSite
                            }
                            role="button"
                            onClick={registerAction}
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
                              "Sign Up"
                            )}
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
                src={"/images/last.svg"}
                className={classNames(styles.pageImage, "h-100")}
                alt=""
              />
            </div>
          </div>
        </div>
      </main>
      <Modal show={show} className={"modalWrapper"} onHide={handleClose}>
        <div className={styles.modalContainer}>
          <div className="d-flex justify-content-end">
            <div onClick={handleClose}>
              <IoMdClose />
            </div>
          </div>
          <div
            className={styles.modalBody}
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        </div>
      </Modal>
    </>
  );
};

export default PrivacyPolicy;
