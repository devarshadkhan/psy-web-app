import React, { useEffect, useState } from "react";
import styles from "@/styles/client/settings/EditProfile.module.css";
import UserNavbar from "@/components/navbars/UserNavbar";
import EditProfileSidebar from "@/components/editprofilesidebar/EditProfileSidebar";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { updateProfile } from "@/store/client/updateProfile";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AutoComplete from "@/components/common/autocomplete";
import Link from "next/link";
import Head from "next/head";
const Editprofile = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  // console.log("UPDATEPROFILE",textAreaValue)
  const {
    register,
    setValue,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange", reValidateMode: "onChange" });

  const { loading } = useSelector((state) => state.clientUpdateProfile);

  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
      reset({
        first_name: item?.first_name,
        last_name: item?.last_name,
        email: item?.email,
        dob: item?.dob,
        phone: item?.phone && item.phone !== 0 ? item.phone : null,
        bio: item?.bio,
        language: item?.language,
        website: item?.website,
        twitter: item?.twitter,
        instagram: item?.instagram,
        facebook: item?.facebook,
      });
      setLocation(item?.city);
    }
  }, []);

  const handleUpdate = (data) => {
    let params = {
      ...data,
      city: location,
      dob: "10/31/2005",
    };

    if (Number(data?.phone)) {
      params["phone"] = Number(data.phone);
    } else {
      params["phone"] = "";
    }

    dispatch(updateProfile(params)).then((res) => {
      if (!res.error) {
        localStorage.setItem("userInfo", JSON.stringify(res.payload));
        setLocation(res?.payload?.city);
      }
    });
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

  function has1000CharactersOrLess(textAreaValue) {
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

      // Break loop if character count exceeds 1000
      if (characterCount > 1000) {
        return false;
      }
    }
    return true;
  }

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
      <UserNavbar />

      <section className={styles.edit_profile}>
        <div className={classNames(styles.cntr_main, "container-fluid")}>
          <div className="row">
            <div className="col-lg-3 col-md-12 col-sm-12">
              <EditProfileSidebar />
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12">
              <div className={styles.edititing_profile}>
                <div className={styles.edit_name}>
                  <h2>Edit Profile</h2>
                  <Link href="/client/profile">View profile</Link>
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
                            // pattern: {
                            //     // value: /^[a-zA-Z ]+$/,
                            //     // value: /^[a-zA-Z]+[a-zA-Z\s]*?[^0-9]$/,
                            //     // value: /^([A-Za-z]!@#$%^&*().,<>{}[\]<>?_=+\-|;:\'\"\/])*[^\s]\+$/,
                            //     // value:  /^[A-Za-z]+$/,
                            //     value:  /^[^\s][a-z\sA-Z\s0-9\s-()][^\s$]/,
                            //     // message: "Only aphlabets are allowed",
                            //     message: "Invalid characters. Only alphabetic characters are allowed.",
                            //   },
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
                            // pattern: {
                            //     // value: /^[a-zA-Z ]+$/,
                            //     // value: /^[a-zA-Z]+[a-zA-Z\s]*?[^0-9]$/,
                            //     // value: /^([A-Za-z]!@#$%^&*().,<>{}[\]<>?_=+\-|;:\'\"\/])*[^\s]\+$/,
                            //     // value:  /^[A-Za-z]+$/,
                            //     value:  /^[^\s][a-z\sA-Z\s0-9\s-()][^\s$]/,
                            //     // message: "Only aphlabets are allowed",
                            //     message: "Invalid characters. Only alphabetic characters are allowed.",
                            //   },
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

                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div className={styles.display_name}>
                        <p for="cheese">Phone</p>
                        <input
                          // type="number"
                          maxLength="10"
                          minLength="10"
                          onInput={(e) =>
                            (e.target.value =
                              e.target.value.match(/^[1-9][0-9]*$/))
                          }
                          pattern="[1-9]{1}[0-9]{9}"
                          type="text"
                          className={`${
                            errors.phone && styles.invalid
                          } form-control`}
                          placeholder="Phone number"
                          name="phone"
                          {...register("phone", {
                            required: {
                              value: true,
                              message: "This is a Required Field",
                            },
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
                            //                   pattern: {
                            //   value: /^[0-9]{0,10}$/,
                            //   message: "Invalid phone number"
                            // },
                            pattern: {
                              value:
                                /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                              // value: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
                              message: "Invalid phone number",
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
                      <div className={styles.display_name}>
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
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div className={styles.display_name}>
                        <p for="cheese">lives in</p>
                        <div>
                          <AutoComplete
                            errors={errors}
                            register={register}
                            showLabel={false}
                            isAddress={false}
                            UpdateCity={setLocation}
                            isRequired={false}
                            location={location}
                            setValue={setValue}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div className={styles.display_name}>
                        <p for="cheese">speak</p>
                        <select
                          className={classNames(
                            "form-select",
                            "form-customize"
                          )}
                          aria-label="Default select example"
                          name="language"
                          {...register("language", {
                            // value: true,
                            message: "This is a Required Field",
                          })}
                        >
                          <option defaultValue value="" hidden>
                            Select Language
                          </option>
                          <option value="english-US">
                            English <span>(United States)</span>
                          </option>
                          <option value="english-UK">
                            English <span>(United Kingdom)</span>
                          </option>
                          <option value="german">German</option>
                        </select>
                      </div>
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
                              // required: 'URL is required',
                              pattern: {
                                value:
                                  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i,
                                message: "Invalid URL format",
                              },
                            })}
                          />
                          {errors.website && (
                            <span
                              className="invalid-feedback"
                              style={{ color: "red" }}
                            >
                              {errors?.website?.message}
                            </span>
                          )}
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
                              // required: 'URL is required',
                              pattern: {
                                value:
                                  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i,
                                message: "Invalid URL format",
                              },
                            })}
                          />
                          {errors.facebook && (
                            <span
                              className="invalid-feedback"
                              style={{ color: "red" }}
                            >
                              {errors?.facebook?.message}
                            </span>
                          )}
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
                          {errors.twitter && (
                            <span
                              className="invalid-feedback"
                              style={{ color: "red" }}
                            >
                              {errors?.twitter?.message}
                            </span>
                          )}
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
                          {errors.instagram && (
                            <span
                              className="invalid-feedback"
                              style={{ color: "red" }}
                            >
                              {errors?.instagram?.message}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* <div className="col-lg-6 col-md-12 col-sm-12">
                        <div className={styles.display_name}>
                          <p for="cheese">twitter</p>
                          <div className={styles.twitter_verify}>
                            <div>
                              <span>@</span>
                            </div>
                            <input
                              type="text"
                              name="twitter"
                              // value=""
                              {...register("twitter", {
                                required: {
                                  message: "This is a Required Field",
                                },
                              })}
                              placeholder="twitter username"
                              className="form-control"
                            />
                            <button>Verify account</button>
                          </div>
                        </div>
                      </div> */}
                    </div>
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
                          "Update Profile"
                        )}
                      </button>
                      {/* <p
                        className="cursor-pointer"
                        onClick={() => {
                          setLocation(" ");
                          reset({
                            first_name: "",
                            last_name: "",
                            // email: "",
                            dob: "",
                            phone: "",
                            bio: "",
                            city: "",
                            language: "",
                            website: "",
                            twitter: "",
                          });
                        }}
                      >
                        <img
                          src="/images/SettingsImage/icons/cross.svg"
                          alt=""
                        />{" "}
                        Clear all
                      </p> */}
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
