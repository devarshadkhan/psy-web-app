import UserNavbar from "@/components/navbars/UserNavbar";
import React, { useEffect, useState } from "react";
import styles from "@/styles/client/profile/Profile.module.css";
import classNames from "classnames";
import { BsStar } from "react-icons/bs";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import Link from "next/link";
import SwiperCore, {
  Navigation,
  Pagination,
  Autoplay,
  Virtual,
} from "swiper/core";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useDispatch } from "react-redux";
import { setProfileImage } from "@/store/common/userinfo";
import { ToastContainer, toast } from "react-toastify";
import Head from "next/head";

SwiperCore.use([Navigation, Pagination, Autoplay, Virtual]);
const Profile = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const { id } = router.query;
  console.log();
  const [isPublic, setIsPublic] = useState(true);
  // const [currentPage, setCurrentPage] = useState(1);
  const [reviewType, setReviewType] = useState(1);
  const [role, setRole] = useState("");

  const [loader, setLoader] = useState(false);
  const [bannerloader, setBannerLoader] = useState(false);
  const dispatch = useDispatch();
  const { resource_role } = router?.query;
  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = localStorage.getItem("role");
      setRole(item);
    }
  }, []);

  const dateFormat = (date) => {
    const dateValue = new Date(date);
    const formattedDate = dateValue.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return formattedDate;
  };

  const handlePublicProfile = async (id) => {
    axiosInstance
      .get(
        `${
          resource_role === "client" ? API.userClient : API.psychicClient
        }/${id}`
      )
      .then((res) => {
        const createdAt = res.createdAt ? dateFormat(res.createdAt) : "";
        setUserProfile({
          ...res,
          createdAt,
        });
      })
      .catch((err) => console.log(err));
  };

  const [reviewData, setReviewData] = useState([]);
  const reveiw = async () => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
    }
    axiosInstance
      .get(`${API.rveiewById}/?userId=${id ? id : item.id}&type=${reviewType}`)
      .then((res) => {
        setReviewData([...res]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    reveiw();
  }, [reviewType, id]);

  useEffect(() => {
    if (id) {
      handlePublicProfile(id);
      setIsPublic(true);
    } else {
      const userProfileData = localStorage.getItem("userInfo");
      if (userProfileData) {
        const JsonValue = JSON.parse(userProfileData);
        const createdAt = JsonValue.createdAt
          ? dateFormat(JsonValue.createdAt)
          : "";
        setUserProfile({
          ...JsonValue,
          createdAt,
        });
      }
      setIsPublic(false);
    }
  }, [router.query]);

  const uploadBannerImage = (fileData) => {
    setBannerLoader(true);
    const formValue = new FormData();
    formValue.append("picture", fileData);
    axiosInstance
      .post(API.uploadBannerPic, formValue, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setBannerLoader(false);
        if (!res.error) {
          localStorage.setItem("userInfo", JSON.stringify(res));
          const createdAt = res.createdAt ? dateFormat(res.createdAt) : "";
          setUserProfile({ ...res, createdAt });
        }
        setBannerLoader(false);
      });
  };

  const profileBannerHandeler = (event) => {
    const files = event?.target?.files[0];
    const maxSize = 2048 * 1024; // 500kb in bytes
    if (files && files.size <= maxSize) {
      // Do something with the selected file
      setBannerLoader(true);
      uploadBannerImage(files);
    } else {
      toast.error("The selected file exceeds the maximum file size of 2MB.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const uploadImage = (fileData) => {
    setLoader(true);
    // setBannerLoader(true)
    const formValue = new FormData();
    formValue.append("picture", fileData);
    axiosInstance
      .post(API.clientPicUpdate, formValue, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (!res.error) {
          localStorage.setItem("userInfo", JSON.stringify(res));
          const createdAt = res.createdAt ? dateFormat(res.createdAt) : "";
          dispatch(setProfileImage(res?.picture));
          setUserProfile({ ...res, createdAt });
        }
        setLoader(false);
      });
  };

  const profileChangeHandeler = (event) => {
    const files = event?.target?.files[0];
    const maxSize = 2048 * 1024; // 500kb in bytes
    if (files && files.size <= maxSize) {
      // Do something with the selected file
      setLoader(true);
      uploadImage(files);
    } else {
      toast.error("The selected file exceeds the maximum file size of 2MB.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const handleClick = (id, resource_role) => {
    if (router.asPath.includes("client")) {
      if (resource_role === "client") {
        router.push(`/client/profile/${id}?resource_role=${resource_role}`);
      }
    } else {
      router.push(`/professional/profile/${id}?resource_role=${resource_role}`);
    }
  };
  const routingHandleClick = () => {
    if (router.asPath.includes("client")) {
      router.push(`/client/settings`);
    } else {
      router.push(`/professional/settings`);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const startIndex = (currentPage - 1) * itemsPerPage;

  const userRole = resource_role ? resource_role : role;
  return (
    <>
      <Head>
        <title>Profile | Psychix</title>
        <meta name="description" content="Profile | Psychix" />
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
      {console.log("ROLE", role)}
      {role?.includes("client") ? (
        <UserNavbar />
      ) : (
        <ProfessionalNavbar image="/images/avatar.png" />
      )}

      <section className={styles.user_profile}>
        <div className="container">
          <div className="row">
            <div
              className={classNames(
                styles.posA,
                "col-lg-12 col-md-12 col-sm-12"
              )}
            >
              <div className={styles.edit_bg_img}>
                <img
                  src={
                    userProfile?.banner
                      ? userProfile?.banner
                      : "/images/ProfileImages/user-bg1.png"
                  }
                  alt=""
                />
                {!isPublic && (
                  <>
                    <input
                      onChange={profileBannerHandeler}
                      type="file"
                      id="bannerUpdate"
                      accept="image/png, image/jpeg"
                      className="d-none cursor-pointer"
                      maxSize={1 * 1024 * 1024} // 1MB in bytes
                    />

                    <>
                      <label
                        htmlFor="bannerUpdate"
                        className={styles.editcoverBtn + " " + "cursor-pointer"}
                      >
                        <img
                          src={"/images/editBanner.svg"}
                          alt=""
                          className="cursor-pointer"
                        />
                        {bannerloader ? (
                          <>
                            <span
                              className="spinner-border cursor-pointer me-2 spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          </>
                        ) : (
                          "Edit cover"
                        )}
                      </label>
                    </>
                  </>
                )}
              </div>
            </div>

            {/* user profile */}

            <div
              className={classNames(
                styles.posB,
                "col-lg-4 col-md-12 col-sm-12"
              )}
            >
              <div className={styles.user_sidebar}>
                <div className={styles.user_main_img}>
                  <img src={userProfile?.picture} alt="" />
                </div>
                {!isPublic && (
                  <>
                    <input
                      onChange={profileChangeHandeler}
                      type="file"
                      id="profileUpdate"
                      accept="image/png, image/jpeg"
                      className="d-none"
                    />
                    <label
                      htmlFor="profileUpdate"
                      className={classNames(
                        styles.user_edit_name,
                        "cursor-pointer"
                      )}
                    >
                      {loader ? (
                        <>
                          <span
                            className="spinner-border me-2 spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        </>
                      ) : (
                        <>
                          {" "}
                          <img
                            src="/images/ProfileImages/icons/edit-name.svg"
                            alt=""
                          />{" "}
                          <p>Update avatar</p>
                        </>
                      )}
                    </label>
                  </>
                )}
                <div className={styles.user_name}>
                  <h2>
                    {userProfile?.first_name} {userProfile?.last_name}
                  </h2>
                  {userProfile?.nickName && (
                    <div className={styles.member_join + " " + "mt-1"}>
                      <p>@{userProfile?.nickName}</p>
                    </div>
                  )}
                </div>
                <div className={styles.user_check_ftr}>
                  <div className={styles.recomend}>
                    <div className={styles.recomed_decs}>
                      <div className={styles.rating}>
                        {/* condition role indentity verified */}
                        {userProfile?.isEmailVerified ? (
                          <>
                            {" "}
                            <AiOutlineCheck />
                            <p>
                              {userRole.includes("client")
                                ? "Email"
                                : "Identity"}{" "}
                              Verified
                            </p>
                          </>
                        ) : (
                          <>
                            {" "}
                            <AiOutlineClose />
                            <p>Identity unverified</p>
                          </>
                        )}
                      </div>
                      {/* {reviewData?.filter(
                        (data) => data.resourceId && data.resourceId.id
                      ).length > 0 && (
                        <div className={classNames(styles.rating, "m-0")}>
                          <BsStar />
                          <p>
                            {
                              reviewData?.filter(
                                (data) => data.resourceId && data.resourceId.id
                              ).length
                            }{" "}
                            Review
                          </p>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>

                {/* {userProfile?.website ? (
                  <Link
                    href={userProfile?.website}
                    target="_blank"
                    className={styles.twitter_url}
                  >
                    <img src="/images/ProfileImages/icons/web.svg" alt="" />
                    <a target="_blank" href={$`{https://twitter.com/${userProfile?.twitter}}`}><p>https://twitter.com/{userProfile?.twitter}</p></a>
                    <p>{userProfile?.website}</p>
                  </Link>
                ) : (
                  <></>
                )} */}

                <div className={styles.social_media}>
                  {userProfile?.website && userProfile?.website !== "" && (
                    <>
                      {" "}
                      <a href={userProfile?.website} target="_blank">
                        {" "}
                        <img src="/images/ProfileImages/icons/web.svg" alt="" />
                      </a>
                    </>
                  )}
                  {userProfile?.twitter && userProfile?.twitter !== "" && (
                    <>
                      {" "}
                      <a href={userProfile?.twitter} target="_blank">
                        {" "}
                        <img
                          src="/images/ProfileImages/icons/twitter.svg"
                          alt=""
                        />
                      </a>
                    </>
                  )}
                  {userProfile?.facebook && userProfile?.facebook !== "" && (
                    <>
                      {" "}
                      <a href={userProfile?.facebook} target="_blank">
                        {" "}
                        <img
                          src="/images/ProfileImages/icons/facebook.svg"
                          alt=""
                        />
                      </a>
                    </>
                  )}

                  {userProfile?.instagram && userProfile?.instagram !== "" && (
                    <>
                      <a href={userProfile?.instagram} target="_blank">
                        <img
                          src="/images/ProfileImages/icons/instagram.svg"
                          alt=""
                        />
                      </a>
                    </>
                  )}
                </div>

                <div className={styles.divider}>
                  <img src="/images/ProfileImages/divider.png" alt="" />
                </div>
                {userProfile?.createdAt && (
                  <div className={styles.member_join}>
                    <p>Member since {userProfile?.createdAt}</p>
                  </div>
                )}
              </div>
            </div>

            <div
              className={classNames(
                styles.posB,
                "col-lg-8 col-md-12 col-sm-12"
              )}
            >
              <div className={styles.user_edit_profile}>
                <div className={styles.user_name}>
                  <h2>Hi, I'm {userProfile?.first_name}</h2>
                  {!isPublic && (
                    <button onClick={routingHandleClick}>
                      Edit your profile
                    </button>
                  )}
                </div>
                <div className={styles.user_decs}>
                  <p>{userProfile?.bio}</p>
                </div>
                {userProfile?.city && (
                  <div className={styles.user_lives}>
                    <img src="/images/ProfileImages/icons/home.svg" alt="" />
                    <span>Lives in</span>
                    <h4>{userProfile?.city}</h4>
                  </div>
                )}

                <div className={styles.user_lives}>
                  <img src="/images/ProfileImages/icons/route.svg" alt="" />
                  <span>Identity</span>
                  <h4>
                    {userProfile?.isEmailVerified ? "Verified" : "Unverified"}
                  </h4>
                </div>

                {userProfile?.language && (
                  <div className={styles.user_lives}>
                    <img src="/images/ProfileImages/icons/comment.svg" alt="" />
                    <span>Speaks</span>
                    <h4> {userProfile?.language}</h4>
                  </div>
                )}
                <img
                  src="/images/SettingsImage/divider.png"
                  alt=""
                  className={styles.bottom_image}
                />
                <div className={styles.security_info}>
                  <h6>Social accounts</h6>
                  <div className={styles.updt_flex}>
                    <div className={styles.updt_passwords}>
                      <div>
                        <h6>Facebook</h6>
                        {
                          <p>
                            {userProfile?.facebook
                              ? "Connected"
                              : "Not Connected"}
                          </p>
                        }
                      </div>

                      {/* <button disabled>Connect</button> */}
                    </div>
                    <div className={styles.updt_passwords}>
                      <div>
                        <h6>Twitter</h6>
                        {
                          <p>
                            {userProfile?.twitter
                              ? "Connected"
                              : "Not Connected"}
                          </p>
                        }
                      </div>
                    </div>
                    <div className={styles.updt_passwords}>
                      <div>
                        <h6>Instagram</h6>
                        {
                          <p>
                            {userProfile?.instagram
                              ? "Connected"
                              : "Not Connected"}
                          </p>
                        }
                      </div>
                    </div>
                  </div>
                  <img
                    src="/images/SettingsImage/divider.png"
                    alt=""
                    className={styles.bottom_image}
                  />
                </div>

                {userProfile?.abilities &&
                  userProfile?.abilities?.length > 0 && (
                    <div
                      className={classNames(
                        styles.user_lives,
                        styles.typeContainr
                      )}
                    >
                      <span className={styles.psyname}>Abilities</span>
                      <div className={styles.TagsContainer}>
                        {userProfile?.abilities?.map((items) => {
                          return <p className="tags">{items}</p>;
                        })}
                      </div>
                    </div>
                  )}

                {userProfile?.specialities &&
                  userProfile?.specialities?.length > 0 && (
                    <div
                      className={classNames(
                        styles.user_lives,
                        styles.typeContainr
                      )}
                    >
                      <span className={styles.psyname}>Tools</span>
                      <div className={styles.TagsContainer}>
                        {userProfile?.specialities?.map((items) => {
                          return <p className="tags">{items}</p>;
                        })}
                      </div>
                    </div>
                  )}

                {userProfile?.styles && userProfile?.styles?.length > 0 && (
                  <div
                    className={classNames(
                      styles.user_lives,
                      styles.typeContainr
                    )}
                  >
                    <span className={styles.psyname}>Styles</span>
                    <div className={styles.TagsContainer}>
                      {userProfile?.styles?.map((items) => {
                        return <p className="tags">{items}</p>;
                      })}
                    </div>
                  </div>
                )}

                {userProfile?.topics && userProfile?.topics?.length > 0 && (
                  <div
                    className={classNames(
                      styles.user_lives,
                      styles.typeContainr
                    )}
                  >
                    <span className={styles.psyname}>Reading Topic</span>
                    <div className={styles.TagsContainer}>
                      {userProfile?.topics?.map((items) => {
                        return <p className="tags">{items}</p>;
                      })}
                    </div>
                  </div>
                )}

                <div className={styles.user_reveiw}>
                  <h2>
                    {
                      reviewData.filter(
                        (data) =>
                          (data?.resourceId && data?.resourceId?.id) ||
                          (data?.userId && data?.userId?.id)
                      ).length
                    }{" "}
                    review
                  </h2>

                  <div className={styles.about_reveiw}>
                    <button
                      onClick={() => setReviewType(1)}
                      className={classNames(
                        styles.buttont,
                        reviewType === 1 && styles.active
                      )}
                    >
                      Reviews about {id ? userProfile?.first_name : "you"}
                    </button>

                    <button
                      onClick={() => setReviewType(0)}
                      className={classNames(
                        styles.buttont,
                        reviewType === 0 && styles.active
                      )}
                    >
                      Reviews from {id ? userProfile?.first_name : "you"}
                    </button>
                  </div>
                </div>
                {reviewData
                  ?.filter(
                    (data) =>
                      (data?.resourceId && data?.resourceId?.id) ||
                      (data?.userId && data?.userId?.id)
                  )
                  .map((item) => {
                    return (
                      <>
                        <div
                          key={item.id}
                          className={styles.cleint_review}
                          onClick={() => {
                            if (item.userId && item.userId.id)
                              handleClick(item?.userId?.id, item?.userId?.role);
                            else if (item.resourceId && item.resourceId.id) {
                              handleClick(item?.userId, item?.resource_role);
                            } else {
                              handleClick(userProfile?.id, userProfile?.role);
                            }
                            // else {

                            // }
                            // item.userId && item.userId.id
                            //   ?
                            //   : userProfile?.role
                            // );
                          }}
                        >
                          <img
                            src={
                              item.userId && item.userId.id
                                ? item?.userId?.picture
                                : userProfile?.picture
                            }
                            alt=""
                          />
                          <div>
                            <h4>
                              {item.userId && item.userId.id
                                ? item?.userId?.nickName
                                  ? item?.userId?.nickName
                                  : item?.userId?.first_name
                                : userProfile?.nickName
                                ? userProfile?.nickName
                                : userProfile?.first_name}{" "}
                            </h4>
                            <p>{item?.review}</p>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
