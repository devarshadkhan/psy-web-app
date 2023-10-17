import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { BiCheck } from "react-icons/bi";

import { useDispatch, useSelector } from "react-redux";
import { addSignupData } from "@/store/professional/signup";
import Image from "next/image";
import { explorePsychicData } from "@/store/client/explorepsychic";

const Topics = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [topics, setTopics] = useState([]);

  const [categoriesData, setCategoriesData] = useState([]);
  const explorepsychic = useSelector((state) => state.explorePsychic);

  useEffect(() => {
    if (explorepsychic?.data?.length === 0) {
      dispatch(explorePsychicData());
    }
  }, [explorepsychic]);

  useEffect(() => {
    if (explorepsychic) {
      setCategoriesData(
        explorepsychic?.data?.find((item) => {
          return item._id === "READING_TOPIC";
        })
      );
    }
  }, [explorepsychic]);

  const onSubmitHandeler = (event) => {
    event.preventDefault();
    const currentFormData = {
      ...router.query,
      topics,
    };
    const queryParams = new URLSearchParams({
      ...currentFormData,
    }).toString();
    document.getElementById("main").classList.add("animate__fadeOut");
    setTimeout(
      () => router.push(`/professional/signup/tools?${queryParams}`),
      1000
    );
  };

  const handleCheck = (id, value) => {
    if (value) {
      const CurrentData = [...topics];
      CurrentData.push(id);
      setTopics(CurrentData);
    } else {
      let CurrentValue = [...topics];
      CurrentValue = CurrentValue.filter((items) => items !== id);
      setTopics(CurrentValue);
    }
  };

  return (
    <>
      <Head>
        <title>Psychic Signup - Psychix</title>
        <meta name="description" content="Psychic Signup - Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        id="main"
        className={classNames(
          styles.main,
          " animate__animated animate__fadeIn"
        )}
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
                      Tell us about your preferred reading topics
                    </p>
                    <p className={classNames(styles.desc)}>
                      Please select your preferred reading topics below.
                    </p>
                  </div>

                  <div
                    className={classNames(
                      styles.formtag,
                      "h-75 d-flex flex-column justify-content-center"
                    )}
                  >
                    <div
                      className={classNames(styles.checkcontainer, "row mb-3")}
                    >
                      {categoriesData?.list?.map((item) => {
                        return (
                          <div
                            key={item.name.toLowerCase()}
                            className={classNames(
                              styles.checksData,
                              "mb-3 col-6"
                            )}
                          >
                            <div
                              className="btn-group"
                              role="group"
                              aria-label="Basic checkbox toggle button group"
                            >
                              <input
                                type="checkbox"
                                className="btn-check"
                                id={item.name.toLowerCase()}
                                checked={topics.includes(
                                  item.name.toLowerCase()
                                )}
                                onChange={(event) =>
                                  handleCheck(
                                    item.name.toLowerCase(),
                                    event.target.checked
                                  )
                                }
                                autoComplete="off"
                              />
                              <label
                                className={
                                  "btn btn-outline-dark " + styles.checkbox
                                }
                                htmlFor={item.name.toLowerCase()}
                              >
                                <BiCheck className={styles.checkIcon} />
                              </label>
                            </div>
                            <span
                              className={classNames(
                                styles.notificationText,
                                "ml-3"
                              )}
                            >
                              {item.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div
                      className={classNames(
                        styles.SignUpButtonContainer,
                        "row mt-3"
                      )}
                    >
                      <div className="col ">
                        <button
                          disabled={!(topics.length > 0)}
                          onClick={onSubmitHandeler}
                          className="btn btn-dark btn-block signupBtn rounded-2 w-75"
                          role="button"
                        >
                          Next
                        </button>
                      </div>
                    </div>
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
                src={"/images/Signuppage3.svg"}
                className={classNames(styles.pageImage, styles.PF2Img)}
                alt=""
              />

              <div className={classNames(styles.vh25, styles.rightDivTitle)}>
                <h5 className={classNames(styles.heading)}>
                  It's also why Psychix pays its psychics more than any other
                  marketplace.
                </h5>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Topics;
