import style from "@/styles/Home.module.css";
import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userSignup } from "@/store/professional/signup";
import { Button, Modal } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";

const PrivacyPolicy = () => {
  const [isTerm, setIsTerm] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    first_name,
    abilities,
    specialities,
    styles,
    topics,
    last_name,
    actual_rate,
  } = router.query;
  const [refSite, setRefSite] = useState("");
  const [findUs, setFindUs] = useState("");
  const { formData, loading, isSuccess } = useSelector((state) => state.signup);
  const [isPrivacy, setIsPrivacy] = useState(false);
  const [show, setShow] = useState(false);
  const [html, setHtml] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const registerAction = async (e) => {
    let params = {
      ...router.query,
      abilities: abilities.split(","),
      specialities: specialities.split(","),
      styles: styles.split(","),
      topics: topics.split(","),
      ref_site: refSite,
      find_us: findUs,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    delete params.confirmPassword;
    delete params?.rate;
    dispatch(userSignup(params));
  };

  useEffect(() => {
    async function loadHtml() {
      const response = await fetch("/myfile.html");
      const text = await response.text();

      const replacedText = text
        .replaceAll("{{rate}}", actual_rate)
        .replaceAll("{{name}}", `${first_name} ${last_name}`); // example dynamic field
      setHtml(replacedText);
    }
    loadHtml();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      document.getElementById("main").classList.add("animate__fadeOut");
      setTimeout(() => router.push("/professional/thankyou"), 1000);
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
        <title>Psychic Signup - Psychix</title>
        <meta name="description" content="Psychic Signup - Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        id="main"
        className={classNames(style.main, "animate__animated animate__fadeIn")}
      >
        <div className="container-fluid">
          <div className={style.logoDiv}>
            <img className={style.logo} src="/images/logo.svg" />
          </div>
          <hr className={classNames(style.hrLine, "m-0")} />
          <div className="row">
            <div className={classNames(style.leftDiv, "col-sm-6 p-0")}>
              <div className={classNames(style.formWrapper, "w-100")}>
                <div className={style.formDiv + " h-100"}>
                  <div className={style.titleBox}>
                    <p className={classNames(style.title, "mb-0")}>
                      Last thing
                    </p>
                    <p className={classNames(style.desc)}>
                      We love hearing about how our users find our platform, as
                      it helps us expand to a larger user base, which in turn
                      helps lower our rates.
                    </p>
                  </div>

                  <div className={classNames(style.formtag)}>
                    <>
                      <div className="row mb-4">
                        <div className="col d-grid gap-2">
                          <label className={style.selectLabel}>
                            Which psychic website have you used before?{" "}
                          </label>
                          <select
                            onChange={(event) => setRefSite(event.target.value)}
                            className={
                              "form-select fw-bolder " + style.selectBg
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
                          <label className={style.selectLabel}>
                            Where did you find us?
                          </label>
                          <select
                            onChange={(event) => setFindUs(event.target.value)}
                            className={
                              "form-select fw-bolder " + style.selectBg
                            }
                            aria-label="Default select example"
                          >
                            <option defaultValue hidden>
                              Select Platform
                            </option>
                            <option defaultValue>Google</option>
                            <option>Facebook</option>
                            <option>Instagram</option>
                            <option>LinkedIn</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col">
                          <div className="form-check form-switch">
                            <input
                              className={"form-check-input " + style.toggleBtn}
                              type="checkbox"
                              onClick={(e) => setIsPrivacy(e.target.checked)}
                              id="flexSwitchCheckDefault"
                            />
                            <label
                              className={
                                "form-check-label " + style.checkboxLabel
                              }
                              htmlFor="flexSwitchCheckDefault"
                            >
                              I agree to the Profesy{" "}
                              <u>
                                <span
                                  onClick={handleShow}
                                  className="cursor-pointer ff-Nexa-Bold"
                                >
                                  Advisor Policy
                                </span>
                              </u>
                            </label>
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
                    <div className={style.copyright}>
                      © 2023 Psychix. All rights reserved.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={classNames(
                style.rightDiv,
                " d-flex align-items-center justify-content-start col-sm-6 p-0 "
              )}
            >
              <img
                src={"/images/last.svg"}
                className={classNames(style.pageImage, "h-100")}
                alt=""
              />
            </div>
          </div>
        </div>
      </main>
      <Modal show={show} className={"modalWrapper"} onHide={handleClose}>
        <div className={style.modalContainer}>
          <div className="d-flex justify-content-end">
            <div onClick={handleClose}>
              <IoMdClose />
            </div>
          </div>
          <div
            className={style.modalBody}
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        </div>
      </Modal>
    </>
  );
};

export default PrivacyPolicy;
