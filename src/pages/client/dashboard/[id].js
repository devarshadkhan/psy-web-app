import React, { useEffect, useState } from "react";
import styles from "@/styles/client/dashboard/ExplorePsychicsCategory.module.css";
import classNames from "classnames";
import { AiOutlineCheck, AiOutlineCheckCircle } from "react-icons/ai";
import UserNavbar from "@/components/navbars/UserNavbar";
import { psychicCategoryData } from "@/store/client/psychiccategory";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";
import Swal from "sweetalert2";
import NoDataMsg from "@/components/noDataMsg/NoDataMsg";

const category = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { value, type } = router.query;
  const [defaultProfile, setDefaultProfile] = useState([]);
  const [promoted, setPromoted] = useState([]);
  const [available, setAvailable] = useState([]);
  const [empty, setEmpty] = useState(false);
  let heading = type?.toLowerCase();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
      setUserProfile(item);
    }
  }, []);

  const fetchData = () => {
    dispatch(
      psychicCategoryData({ type: type, value: value.toLowerCase() })
    ).then((res) => {
      setEmpty(res?.payload?.length === 0 && true);
      if (!res.error) {
        setDefaultProfile(res.payload[0]);
        if (res.payload[0]) {
          setPromoted([...promoted, res.payload[0]]);
        }
        if (res.payload[1]) {
          setPromoted([...promoted, res.payload[1]]);
        }
        setAvailable(res.payload.slice(2, res.payload.length));
      } else {
        setEmpty(true);
      }
    });
  };

  useEffect(() => {
    if (value && type) {
      fetchData();
    }
  }, [type]);

  const handlePsychicDetails = (id) => {
    router.push(`/client/dashboard/explorepsychicdetails/${id}?type=${value}`);
  };

  return (
    <>
      <Head>
        <title>Explore Physics Detail | Psychix</title>
        <meta name="description" content="Explore Physics Detail | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserNavbar />
      {empty ? (
        <>
          <NoDataMsg
            message="No psychics Available"
            img="/images/loadImg/new.svg"
          />
        </>
      ) : (
        <>
          <section className={styles.wrapper_main}>
            <div className={classNames(styles.cntr_main, "container-fluid")}>
              <div id="explore-PsychicContainer" className="row">
                <div className="col-md-12">
                  <div className={styles.main_heading}>
                    <h2>Explore {router?.query?.value} Psychics</h2>
                  </div>
                </div>

                <div className="col-md-12 col-lg-7 col-sm-12">
                  <div className={styles.user_bio}>
                    <div className={styles.user_name}>
                      <h3 style={{ textTransform: "capitalize" }}>
                        {defaultProfile?.nickName}
                      </h3>
                    </div>
                    <div
                      className={classNames(
                        styles.user_decs,
                        " d-flex align-items-center"
                      )}
                    >
                      <img
                        src="/images/ExploreCategoryImages/eyeIcon.svg"
                        alt=""
                      />
                      {defaultProfile?.abilities?.map((ele, index) => {
                        return (
                          <p>
                            {index !== 0 && ", "}
                            {ele?.charAt(0).toUpperCase() + ele.slice(1)}
                          </p>
                        );
                      })}
                    </div>
                    <div className={styles.user_img}>
                      <div
                        style={{
                          backgroundImage: `url(${
                            defaultProfile?.picture
                              ? defaultProfile?.picture
                              : "/images/ProfileImages/user-bg1.png"
                          })`,
                        }}
                        className={styles.cardBgImage}
                      ></div>
                      <img
                        src={
                          defaultProfile?.picture
                            ? defaultProfile?.picture
                            : "/images/ProfileImages/user-bg1.png"
                        }
                        alt=""
                      />
                      <div class={"form-check" + " " + "online-radio"}>
                        <input
                          className={
                            defaultProfile?.online_status
                              ? "form-check-input online-radio-input"
                              : "form-check-input offline-radio-input"
                          }
                          type="radio"
                          disabled={true}
                          checked={true}
                        />
                      </div>
                    </div>
                    <div className={styles.user_check_ftr}>
                      <div className={styles.recomend}>
                        <div className={styles.recomed_decs}>
                          <AiOutlineCheckCircle
                            className={styles.recomend_checkIcon}
                          />
                          <p>Recommended By Staff</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12 col-sm-12 col-lg-5">
                  <div className={styles.user_about_main}>
                    <div className={styles.user_about_sub}>
                      <div className={styles.user_about_head}>
                        <h2 className="mb-0">
                          ${defaultProfile?.actual_rate} <span>/minute</span>
                        </h2>

                        <img
                          src={
                            defaultProfile?.picture
                              ? defaultProfile?.picture
                              : "/images/dummyAvatar.png"
                          }
                          alt=""
                        />
                        <img
                          src="/images/ExploreCategoryImages/check.svg"
                          className={styles.check}
                          alt=""
                        />
                      </div>
                    </div>
                    <div className={styles.user_rating}>
                      <div className={styles.user_rating_count}>
                        <img
                          src="/images/ExploreCategoryImages/star.svg"
                          alt=""
                        />
                        <h2 className={styles.rting}>
                          {defaultProfile?.average_rating || 0}
                          <span>
                            ( {defaultProfile.review_count || 0}{" "}
                            {defaultProfile.review_count > 1
                              ? "reviews"
                              : "review"}{" "}
                            )
                          </span>
                        </h2>
                      </div>
                    </div>
                    <div className={styles.user_status}>
                      <div className={styles.user_status_calender}>
                        <img
                          src="/images/ExploreCategoryImages/calender.svg"
                          alt=""
                        />
                        <div className={styles.user_status_decs}>
                          <span>Status</span>
                          <h3>Available</h3>
                        </div>
                      </div>
                      <div className={styles.user_status_calender}>
                        <img
                          src="/images/ExploreCategoryImages/calender.svg"
                          alt=""
                        />
                        <div className={styles.user_status_decs}>
                          <span>Estimated Wait</span>
                          <h3>0 minutes</h3>
                        </div>
                      </div>
                      <div className={classNames(styles.user_status_calender)}>
                        <img
                          src="/images/ExploreCategoryImages/user.svg"
                          alt=""
                        />
                        <div className={styles.user_status_decs}>
                          <span>Time Minimum</span>
                          <h3>30 minutes</h3>
                        </div>
                      </div>
                    </div>
                    <div className={styles.user_btn}>
                      <button
                        // href={`$/client/dashboard/explorepsychicdetails/${id}?type=${value}`}
                        onClick={() => handlePsychicDetails(defaultProfile.id)}
                        className={styles.user_e_btn}
                      >
                        Learn More{" "}
                        {/* {defaultProfile?.first_name?.toString()?.substr(0, 2)} */}
                      </button>
                      <button
                        onClick={() => {
                          if (!userProfile?.isEmailVerified) {
                            Swal.fire({
                              title: "Please Verify your email",
                              icon: "error",
                              confirmButtonText: "OK",
                            });
                          } else {
                            router.push(
                              `/client/appointment-now/${defaultProfile?.id}?${
                                defaultProfile?.picture
                                  ? "picture=" +
                                    defaultProfile?.picture.replace(
                                      "https://",
                                      ""
                                    )
                                  : ""
                              }&price=${
                                defaultProfile.actual_rate
                              }&type=${value}&name=${
                                defaultProfile?.nickName
                              }&online=${defaultProfile?.online_status}&timezone=${defaultProfile?.timezone}&audio=${
                                Object.keys(defaultProfile).includes(
                                  "allow_audio_meets"
                                )
                                  ? defaultProfile?.allow_audio_meets
                                  : true
                              }&video=${
                                Object.keys(defaultProfile).includes(
                                  "allow_video_meets"
                                )
                                  ? defaultProfile?.allow_video_meets
                                  : true
                              } `
                            );
                          }
                        }}
                        className={classNames(
                          styles.user_e_btnsnd,
                          !userProfile?.isEmailVerified && "diabled-btn"
                        )}
                      >
                        Meet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.wrapper_recommend}>
            <div className={classNames(styles.cntr_main, "container-fluid")}>
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className={styles.sub_heading}>
                    <h2>
                      {" "}
                      {heading == "reading_topic"
                        ? "Reading Topic"
                        : heading}{" "}
                      Psychics Recommended For You
                    </h2>
                  </div>
                </div>

                {promoted?.map((ele) => {
                  return (
                    <div
                      className="mt-5 position-relative col-lg-6 col-md-12 col-sm-12 cursor-pointer"
                      onClick={() => handlePsychicDetails(ele?.id)}
                    >
                      <div className={styles.promote_card}>
                        <div className={styles.cards}>
                          <div
                            style={{
                              backgroundImage: `url(${
                                ele?.picture
                                  ? ele?.picture
                                  : "/images/dummyAvatar.png"
                              })`,
                            }}
                            className={styles.cardBgImage}
                          ></div>
                          <img
                            src={
                              ele?.picture
                                ? ele?.picture
                                : "/images/dummyAvatar.png"
                            }
                            className={classNames(
                              styles.card_image,
                              "card-img-top"
                            )}
                            alt=""
                            width="100%"
                          />

                          <div className={styles.cardStatus}>Promoted</div>
                          <div class={"form-check" + " " + "online-radio"}>
                            <input
                              className={
                                ele?.online_status
                                  ? "form-check-input online-radio-input"
                                  : "form-check-input offline-radio-input"
                              }
                              type="radio"
                              disabled={true}
                              checked={true}
                            />
                          </div>
                        </div>

                        <div className={styles.main_card_padding}>
                          <div className={styles.main_card}>
                            <div className={styles.card_body}>
                              <h5 className={styles.card_title}>
                                {ele?.nickName}
                              </h5>
                              <div className={styles.card_ftr}>
                                <img
                                  src="/images/ExploreCategoryImages/eyeIcon.svg"
                                  alt=""
                                />
                                {ele?.abilities?.map((items, index) => (
                                  <span className="card-text">
                                    {" "}
                                    {index !== 0 && ", "}
                                    {items.charAt(0).toUpperCase() +
                                      items.slice(1)}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className={styles.timespans}>
                              <span>${ele?.actual_rate}/minute</span>
                            </div>
                          </div>

                          <div className={styles.divider_img}>
                            <img
                              src={"/images/ExploreCategoryImages/divider.png"}
                              alt=""
                            />
                          </div>

                          <div className={styles.card_footer_name}>
                            <h4>0 min Est. Wait</h4>
                            <div className={styles.footer_rating}>
                              <img
                                src="/images/ExploreCategoryImages/star.svg"
                                alt=""
                              />
                              <h4>
                                {ele?.average_rating || 0}
                                <span>
                                  ({ele?.review_count || 0}{" "}
                                  {ele?.review_count > 1 ? "reviews" : "review"}
                                  )
                                </span>
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {false && (
                <div className="col-lg-6 col-md-12 col-sm-12">
                  <div className={styles.promote_card}>
                    <div className={styles.cards}>
                      <img
                        className="card-img-top"
                        src="/images/ExploreCategoryImages/img2.png"
                        alt="Card image cap"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="row">
                {available?.map((ele) => {
                  return (
                    <>
                      <div
                        className="position-relative col-lg-4 col-md-12 col-sm-12 mt-5 cursor-pointer"
                        onClick={() => handlePsychicDetails(ele?.id)}
                      >
                        <div className={styles.promote_card}>
                          <div className={styles.cards}>
                            <img
                              className={classNames(
                                "card-img-top",
                                styles.img_fixing
                              )}
                              src={ele?.picture}
                              alt="Card image cap"
                            />

                            <div className={styles.cardStatus}>Available</div>
                            <div class={"form-check" + " " + "online-radio"}>
                              <input
                                className={
                                  ele?.online_status
                                    ? "form-check-input online-radio-input"
                                    : "form-check-input offline-radio-input"
                                }
                                type="radio"
                                disabled={true}
                                checked={true}
                              />
                            </div>
                          </div>
                          <div className={styles.main_card_padding}>
                            <div className={styles.main_card}>
                              <div className={styles.card_body}>
                                <h5 className={styles.card_title}>
                                  {ele?.nickName}
                                </h5>
                                <div className={styles.card_ftr}>
                                  <img
                                    src="/images/ExploreCategoryImages/eyeIcon.svg"
                                    alt=""
                                  />
                                  {ele?.abilities?.map((items, index) => (
                                    <>
                                      <span className="card-text">
                                        {" "}
                                        {index !== 0 && ", "}
                                        {items.charAt(0).toUpperCase() +
                                          items.slice(1)}{" "}
                                      </span>
                                    </>
                                  ))}
                                </div>
                              </div>
                              <div className={styles.timespans}>
                                <span>${ele.actual_rate}/minute</span>
                              </div>
                            </div>
                            <div className={styles.divider_img}>
                              <img
                                src={
                                  "/images/ExploreCategoryImages/divider.png"
                                }
                                alt=""
                              />
                            </div>

                            <div className={styles.card_footer_name}>
                              <h4>0 min Est. Wait</h4>
                              <div className={styles.footer_rating}>
                                <img
                                  src="/images/ExploreCategoryImages/star.svg"
                                  alt=""
                                />
                                <h4>
                                  {ele?.average_rating || 0}{" "}
                                  <span>
                                    {" "}
                                    ({ele?.review_count || 0}{" "}
                                    {ele?.review_count > 1
                                      ? "reviews"
                                      : "review"}
                                    )
                                  </span>
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>

              <div className="col-lg-12 col-sm-12 col-md-12">
                {available ===
                  6 >
                  (
                    <div className={styles.loader_btn}>
                      <button>Show more</button>
                    </div>
                  )}
              </div>
            </div>
            {/* </div> */}
          </section>
        </>
      )}
    </>
  );
};

export default category;
