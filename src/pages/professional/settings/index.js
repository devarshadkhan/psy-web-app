import React, { useState, useEffect } from "react";
import styles from "@/styles/professional/settings/EditProfile.module.css";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import ProfessionalSidebar from "@/components/addSidebar/professionalSidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateProfessionalProfile } from "@/store/professional/updateProfile";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import AutoComplete from "@/components/common/autocomplete";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/router";
import { setProfileImage } from "@/store/common/userinfo";
import Head from "next/head";
import Select from "react-select";
import { explorePsychicData } from "@/store/client/explorepsychic";
import { capitalizeFirstCharacter, hasNonEmptyString } from "@/utils/common";

const options = {
  READING_TOPIC: "topics",
  ABILITIES: "abilities",
  TOOLS: "specialities",
  STYLES: "styles",
};
import { getDatabase, onValue, ref } from "firebase/database";

const Editprofile = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error, success, userInfo } = useSelector(
    (state) => state.professionalProfile
  );
  const [location, setLocation] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [status, setStatus] = useState(false);
  const [userData, setUserData] = useState(null);
  const [type, setType] = useState([]);
  const [allow_audio_meets, setAllowAudioMeets] = useState(false);
  const [allow_video_meets, setAllowVideoMeets] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onChange", reValidateMode: "onChange" });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      uploadImage(acceptedFiles[0]);
    },
  });
  const [TypeErrors, setTypeError] = useState({
    topics: "",
    abilities: "",
    specialities: "",
    styles: "",
  });

  const handleTypesChange = (e, key) => {
    if (e.length === 0) {
      setTypeError({
        ...TypeErrors,
        [key]: "Please select atleast one option",
      });
    } else {
      setTypeError({ ...TypeErrors, [key]: "" });
    }
    let currentData = { ...userData };
    currentData[key] = e.map((res) => res.value.toLocaleLowerCase());
    setUserData(currentData);
  };

  const explorepsychic = useSelector((state) => state.explorePsychic);
  useEffect(() => {
    if (explorepsychic?.data?.length === 0) {
      dispatch(explorePsychicData());
    } else {
      let currentTypes = { ...type };
      explorepsychic?.data?.forEach((items) => {
        currentTypes[items._id] = items?.list;
      });
      setType(currentTypes);
    }
  }, [explorepsychic]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
      setStatus(item?.online_status);
      if (item?.picture) {
        setFile(item?.picture);
      } else {
        // console.log(URL.createObjectURL("/images/dummyAvatar.png"  ));
        setFile("/images/dummyAvatar.png");
      }
      setUserData(item);
      reset({
        first_name: item?.first_name,
        last_name: item?.last_name,
        email: item?.email,
        nickName: item?.nickName,
        phone: item?.phone && item.phone !== 0 ? item.phone : null,
        bio: item?.bio,
        adderss: item?.address,
        language: item?.language || "",
        website: item?.website,
        twitter: item?.twitter,
        actual_rate: item?.actual_rate,
        instagram: item?.instagram,
        facebook: item?.facebook,
      });

      if (Object.keys(item).includes("allow_audio_meets")) {
        setAllowAudioMeets(item?.allow_audio_meets);
      } else {
        setAllowAudioMeets(true);
      }

      if (Object.keys(item).includes("allow_video_meets")) {
        setAllowVideoMeets(item?.allow_video_meets);
      } else {
        setAllowVideoMeets(true);
      }

      setLocation(item?.city);
    }
  }, []);

  const [file, setFile] = useState();

  const uploadImage = (fileData) => {
    const formValue = new FormData();
    formValue.append("picture", fileData);
    axiosInstance
      .post(API.professionalpicUpdate, formValue, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res));
        dispatch(setProfileImage(res?.picture));
        setFile(res?.picture);
      });
  };

  // useEffect(() => {
  //   const db = getDatabase();
  //   const starCountRef = ref(db);
  //   onValue(starCountRef, (snapshot) => {
  //     const data = snapshot?.val();
  //     setStatus(data.users[userInfo?.id]?.online_status);
  //   });
  // }, []);

  const handleUpdate = (data) => {
    if (!hasNonEmptyString(TypeErrors)) {
      let types = {};
      Object.values(options).forEach((items) => {
        types[items] = userData[items];
      });

      dispatch(
        updateProfessionalProfile({
          ...data,
          ...types,
          phone: Number(data?.phone),
          city: location,
          dob: "10/31/2005",
        })
      ).then((res) => {
        if (!res.error) {
          setLocation(res?.payload?.city);
          const item = res?.payload;
          localStorage.setItem("userInfo", JSON.stringify(res.payload));
          if (item?.picture) {
            setFile(item?.picture);
          } else {
            // console.log(URL.createObjectURL("/images/dummyAvatar.png"  ));
            setFile("/images/dummyAvatar.png");
          }
          setUserData(item);
          reset({
            first_name: item?.first_name,
            last_name: item?.last_name,
            email: item?.email,
            // dob: item?.dob
            nickName: item?.nickName,
            phone: item?.phone && item.phone !== 0 ? item.phone : null,
            bio: item?.bio,
            adderss: item?.address,
            language: item?.language || "",
            website: item?.website,
            twitter: item?.twitter,
            actual_rate: item?.actual_rate,
            instagram: item?.instagram,
            facebook: item?.facebook,
          });
          setLocation(item?.city);
        }
      });
    }
  };
  function countCharactersWithEmojis(textAreaValue) {
    var characterCount = 0;
    for (var i = 0; i < textAreaValue.length; i++) {
      // Check if the current character is a high surrogate
      if (
        textAreaValue.charCodeAt(i) >= 0xd800 &&
        textAreaValue.charCodeAt(i) <= 0xdbff
      ) {
        // Check if there is a subsequent low surrogate
        if (
          textAreaValue.charCodeAt(i + 1) >= 0xdc00 &&
          textAreaValue.charCodeAt(i + 1) <= 0xdfff
        ) {
          characterCount++; // Increment character count for surrogate pair (emoji)
          i++; // Skip the next low surrogate character
        }
      } else {
        characterCount++; // Increment character count for regular character
      }
    }
    return characterCount;
  }

  const handleNotification = (e) => {
    axiosInstance
      .put("users/toggle-online-status")
      .then((res) => {
        let userData = JSON.parse(localStorage.getItem("userInfo"));
        userData = { ...userData, online_status: res?.online_status };
        console.log(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
        setStatus(res?.online_status);
      })
      .catch((err) => {
        toast.error(err?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const handleToggle = (event, key) => {
    const currentParams = {
      allow_audio_meets: allow_audio_meets,
      allow_video_meets: allow_video_meets,
    };

    const params = { ...currentParams, [key]: event.target.checked };

    if (!params.allow_audio_meets && !params.allow_video_meets) {
      toast.error("One meeting type should be active", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      axiosInstance
        .put("users/professional/trigger-meet-settings", params)
        .then((res) => {
          localStorage.setItem("userInfo", JSON.stringify(res));
          if (Object.keys(res).includes("allow_audio_meets")) {
            setAllowAudioMeets(res?.allow_audio_meets);
          } else {
            setAllowAudioMeets(true);
          }
          if (Object.keys(res).includes("allow_video_meets")) {
            setAllowVideoMeets(res?.allow_video_meets);
          } else {
            setAllowVideoMeets(true);
          }
        });
    }
  };

  return (
    <>
      <Head>
        <title>Settings | Psychix</title>
        <meta name="description" content="Settings | Psychix" />
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

      <section className={styles.edit_profile}>
        <div className={classNames(styles.cntr_main, "container-fluid")}>
          {/* <div className={"container"}> */}
          <div className="row">
            <div className="col-lg-3 col-md-12 col-sm-12">
              <ProfessionalSidebar />
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12">
              <div className={styles.edititing_profile}>
                <div className={styles.edit_name}>
                  <h2>Edit Psychic Profile</h2>
                  <div className="d-flex">
                    <div
                      className={classNames(
                        "d-flex online_status_container ",
                        styles.statusWrapper
                      )}
                    >
                      <span className={styles.statusText}>
                        {status ? "Online" : "Offline"}
                      </span>
                      <div className={styles.toggle_button_cover}>
                        <div className={styles.button_cover}>
                          <div
                            className={classNames(styles.button, styles.r)}
                            id={styles.button_1}
                          >
                            <input
                              type="checkbox"
                              // disabled
                              className={styles.checkbox}
                              checked={status}
                              name="is_reminder_sms_allow"
                              onChange={handleNotification}
                            />
                            <div className={classNames(styles.knobs)}></div>
                            <div className={styles.layer}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        router.push("/professional/profile");
                      }}
                    >
                      View profile
                    </button>
                  </div>
                </div>

                <div className={styles.image_banner}>
                  <h2>Your Public Picture</h2>

                  <div className={"d-flex gap-5 " + styles.dropzoneSection}>
                    <div className={styles.imgContainer}>
                      <span>Current PHOTO</span>
                      <div className={styles.profileContainer}>
                        <img
                          className={styles.ProfileImage}
                          src={file}
                          alt="Profile"
                        />
                      </div>
                    </div>

                    <div
                      className={"form-floating mb-3 " + styles.dropBox}
                      {...getRootProps({ className: "dropzone" })}
                    >
                      <input
                        type="text"
                        // type="file"
                        id="bannerUpdate"
                        accept="image/png, image/jpeg"
                        // className="d-none cursor-pointer"
                        maxSize={2 * 1024 * 1024} // 1MB in bytes
                        className={`form-control `}
                        // id="floatingInput"
                        {...getInputProps()}
                      />

                      <div className={`${styles.dropDown} ${styles.dotted}`}>
                        <img src="/images/gallery.svg" />
                        <div>
                          <p>
                            Drop your image here, or select{" "}
                            <span className="cursor-pointer">
                              Click to browse
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <form
                  className={styles.account_info}
                  onSubmit={(event) => {
                    event.preventDefault();

                    trigger()
                      .then((res) => {
                        if (res) {
                          handleUpdate(getValues());
                        }
                      })
                      .catch((err) => console.log(err));
                  }}
                >
                  <h6>Account info</h6>
                  <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div className={styles.display_name}>
                        <p for="cheese">First Name</p>

                        <input
                          type="text"
                          placeholder="Enter your display name"
                          name="first_name"
                          className={`${
                            errors.first_name && styles.invalid
                          } form-control`}
                          {...register("first_name", {
                            required: {
                              value: true,
                              message: "This is required",
                            },
                            pattern: {
                              value: /^[a-zA-Z]+$/,
                              message: "Only aphlabets are allowed",
                            },

                            maxLength: {
                              value: 20,
                              message:
                                "First name can only contain 20 characters",
                            },
                          })}
                        />
                        {errors.first_name && (
                          <span style={{ color: "red" }}>
                            {errors?.first_name?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div className={styles.display_name}>
                        <p for="cheese">Last name</p>
                        <input
                          type="text"
                          name="last_name"
                          className={`${
                            errors.last_name && styles.invalid
                          } form-control`}
                          placeholder="last name"
                          {...register("last_name", {
                            required: {
                              value: true,
                              message: "This is required",
                            },
                            pattern: {
                              value: /^[a-zA-Z]+$/,
                              message: "Only aphlabets are allowed",
                            },
                            maxLength: {
                              value: 20,
                              message:
                                "Last name can only contain 20 characters",
                            },
                          })}
                        />
                        {errors.last_name && (
                          <span className="invalid-feedback">
                            {errors?.last_name?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className={styles.display_name}>
                        <p for="cheese">Moniker</p>
                        <input
                          type="text"
                          name="nickName"
                          className={`${
                            errors.nickName && styles.invalid
                          } form-control`}
                          placeholder="Moniker"
                          {...register("nickName", {
                            required: {
                              value: true,
                              message: "This is required",
                            },
                            pattern: {
                              value: /^[a-zA-Z_]+$/,
                              message: "Only aphlabets are allowed",
                            },
                            maxLength: {
                              value: 20,
                              message: "Moniker can only contain 20 characters",
                            },
                          })}
                        />
                        {errors.nickName && (
                          <span className="invalid-feedback">
                            {errors?.nickName?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div class={styles.display_name}>
                        <p for="cheese">Phone</p>
                        <input
                          onInput={(e) =>
                            (e.target.value =
                              e.target.value.match(/^[1-9][0-9]*$/))
                          }
                          pattern="[1-9]{1}[0-9]{9}"
                          type="text"
                          maxLength={"10"}
                          className={` ${styles.RBorder} ${
                            errors.phone && styles.invalid
                          }  form-control`}
                          placeholder="Phone number"
                          {...register("phone", {
                            minLength: {
                              value: 10,
                              message:
                                "Phone number should be atleast 10 digits",
                            },
                            maxLength: {
                              value: 10,
                              message:
                                "Phone number should be atleast 10 digits",
                            },
                          })}
                        />
                        {errors.phone && (
                          <span className="invalid-feedback">
                            {errors?.phone?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div class={styles.display_name}>
                        <p for="cheese">email</p>
                        <input
                          type="email"
                          disabled
                          className="form-control"
                          placeholder="kohaku@gmail.com"
                          {...register("email", {
                            required: {
                              value: true,
                              message: "This is a Required Field",
                            },
                          })}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div class={styles.display_name}>
                        <div className="d-flex align-items-center justify-content-between">
                          <p for="cheese" className="m-0">
                            bio
                          </p>
                          <p
                            className={classNames(styles.reviewLength, "mt-4")}
                          >
                            {countCharactersWithEmojis(textAreaValue)}/1000
                          </p>
                        </div>
                        <textarea
                          class={classNames(
                            errors?.bio && "bioValidity",
                            "form-control"
                          )}
                          maxLength="1000"
                          placeholder="About yourself in a few words"
                          id="floatingTextarea2"
                          {...register("bio", {
                            pattern: {
                              value: true,
                              // value: /^[a-zA-Z0-9., \n]*$/,
                              message:
                                "Special Characters are not allowed except full stop (.) and comma (,)",
                            },
                            onChange: (event) =>
                              setTextAreaValue(event.target.value),
                          })}
                        ></textarea>
                        {errors.bio && (
                          <span className="invalid-feedback">
                            {errors?.bio?.message}
                          </span>
                        )}
                      </div>
                      {/* {countCharactersWithEmojis(textAreaValue)}/500 */}
                    </div>

                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div class={styles.display_name}>
                        <p for="cheese">lives in</p>
                        <AutoComplete
                          errors={errors}
                          register={register}
                          showLabel={false}
                          isAddress={false}
                          UpdateCity={setLocation}
                          location={location}
                          setValue={setValue}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div class={styles.display_name}>
                        <p for="cheese">speak</p>
                        <select
                          className={classNames(
                            "form-select",
                            "form-customize"
                          )}
                          aria-label="Default select example"
                          name="language"
                          {...register("language")}
                        >
                          <option defaultValue value="" hidden>
                            Select Language
                          </option>
                          <option value="english-US" selected>
                            English <span>(United States)</span>
                          </option>
                          <option value="english-UK">
                            English <span>(United Kingdom)</span>
                          </option>
                          <option value="german">German</option>
                        </select>
                      </div>
                    </div>
                    <div className={classNames(styles.account_info1)}>
                      <h6>Social</h6>
                      <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                          <div className={styles.display_name}>
                            <p for="cheese">Website</p>
                            <input
                              type="text"
                              className={`${
                                errors.website && styles.invalid
                              } form-control`}
                              placeholder="Your site URL"
                              id="websiteLink"
                              name="website"
                              {...register("website", {
                                pattern: {
                                  value:
                                    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i,
                                  message: "Invalid URL format",
                                },
                              })}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                          <div className={styles.display_name}>
                            <p for="cheese1">facebook</p>
                            <input
                              type="text"
                              className={`${
                                errors.facebook && styles.invalid
                              } form-control`}
                              placeholder="Your site URL"
                              id="facebookLink"
                              name="facebook"
                              {...register("facebook", {
                                pattern: {
                                  value:
                                    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i,
                                  message: "Invalid URL format",
                                },
                              })}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                          <div className={styles.display_name}>
                            <p for="cheese2">twitter</p>
                            <input
                              type="text"
                              className={`${
                                errors.twitter && styles.invalid
                              } form-control`}
                              placeholder="Your site URL"
                              id="twitterLink"
                              name="twitter"
                              {...register("twitter", {
                                // required: 'URL is required',
                                pattern: {
                                  value:
                                    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i,
                                  message: "Invalid URL format",
                                },
                              })}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                          <div className={styles.display_name}>
                            <p for="cheese3">Instagram</p>
                            <input
                              type="text"
                              className={`${
                                errors.instagram && styles.invalid
                              } form-control`}
                              placeholder="Your site URL"
                              id="instagramLink"
                              name="instagram"
                              {...register("instagram", {
                                // required: 'URL is required',
                                pattern: {
                                  value:
                                    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i,
                                  message: "Invalid URL format",
                                },
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div class={styles.display_name}>
                        <p for="cheese">Rate</p>
                        <select
                          {...register("actual_rate", {
                            required: true,
                            validate: (value) => {
                              return (
                                value !== "Select Rate" ||
                                "This is A Required Field"
                              );
                            },
                            onChange: (event) => {
                              event.target.value > 8
                                ? setShowWarning(true)
                                : setShowWarning(false);
                            },
                          })}
                          className={classNames(
                            "form-select fw-bolder",
                            errors.actual_rate && styles.invalid,
                            styles.greyInputBg
                          )}
                          aria-label="Default select example"
                        >
                          <option defaultValue hidden></option>
                          <option value="5">$5</option>
                          <option value="8">$8</option>
                          <option value="10">$10</option>
                          <option value="15">$15</option>
                        </select>

                        {errors.actual_rate && (
                          <span className="invalid-feedback">
                            This is required.
                          </span>
                        )}
                      </div>
                      <div className="row">
                        <div className="col-6 switch-container">
                          <div className={styles.display_name}>
                            <div
                              className={classNames(
                                "d-flex",
                                styles.statusWrapper
                              )}
                            >
                              <span
                                className={styles.statusText + " " + "me-5"}
                              >
                                Audio
                              </span>
                              <div className={styles.toggle_button_cover}>
                                <div className={styles.button_cover}>
                                  <div
                                    className={classNames(
                                      styles.button,
                                      styles.r
                                    )}
                                    id={styles.button_1}
                                  >
                                    <input
                                      type="checkbox"
                                      // disabled
                                      className={styles.checkbox}
                                      checked={allow_audio_meets}
                                      name="is_reminder_sms_allow"
                                      onChange={(event) =>
                                        handleToggle(event, "allow_audio_meets")
                                      }
                                    />
                                    <div
                                      className={classNames(styles.knobs)}
                                    ></div>
                                    <div className={styles.layer}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6 switch-container">
                          <div className={styles.display_name}>
                            <div
                              className={classNames(
                                "d-flex",
                                styles.statusWrapper
                              )}
                            >
                              <span
                                className={styles.statusText + " " + "me-5"}
                              >
                                Video
                              </span>
                              <div className={styles.toggle_button_cover}>
                                <div className={styles.button_cover}>
                                  <div
                                    className={classNames(
                                      styles.button,
                                      styles.r
                                    )}
                                    id={styles.button_1}
                                  >
                                    <input
                                      type="checkbox"
                                      // disabled
                                      className={styles.checkbox}
                                      checked={allow_video_meets}
                                      name="is_reminder_sms_allow"
                                      onChange={(event) =>
                                        handleToggle(event, "allow_video_meets")
                                      }
                                    />
                                    <div
                                      className={classNames(styles.knobs)}
                                    ></div>
                                    <div className={styles.layer}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {showWarning && (
                        <span
                          className={classNames(
                            styles.warningsection,
                            "fw-semibold"
                          )}
                        >
                          {" "}
                          Warning: By selecting any amount over $8, you greatly
                          decrease the chances of being hired for your services.{" "}
                        </span>
                      )}
                    </div>
                    {Object.keys(type).map((items) => {
                      return (
                        <div className="col-lg-6 col-md-6 col-sm-6">
                          <div class={styles.display_name}>
                            <p for="cheese">{items.replace("_", " ")}</p>

                            <Select
                              className={
                                TypeErrors[options[items]]
                                  ? "error-boundry"
                                  : "normal-boundry"
                              }
                              value={userData[options[items]]?.map(
                                (itemsValue) => {
                                  return {
                                    value: capitalizeFirstCharacter(itemsValue),
                                    label: capitalizeFirstCharacter(itemsValue),
                                  };
                                }
                              )}
                              onChange={(e) =>
                                handleTypesChange(e, options[items])
                              }
                              isMulti
                              name="colors"
                              options={type[items].map((datas) => {
                                return {
                                  value: capitalizeFirstCharacter(datas.name),
                                  label: capitalizeFirstCharacter(datas.name),
                                };
                              })}
                              classNamePrefix="select"
                            />
                            {TypeErrors[options[items]] && (
                              <span className="invalid-feedback">
                                {TypeErrors[options[items]]}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <img src="/images/SettingsImage/divider.png" alt="" />

                  <div className={styles.account_info2}>
                    <div className={styles.submit_btn}>
                      <button type="submit">
                        {loading ? (
                          <>
                            <span
                              className="spinner-border me-2 spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Update Profile...
                          </>
                        ) : (
                          "Update"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Editprofile;
