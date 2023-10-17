import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { useRouter } from "next/router";
import Image from "next/image";
import ReactDatePicker from "react-datepicker";
import AutoComplete from "@/components/common/autocomplete";
import { addSignupData } from "@/store/professional/signup";
import { explorePsychicData } from "@/store/client/explorepsychic";
import MaskedInput from "react-input-mask";
import moment from "moment";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";

const Index = () => {
  const router = useRouter();
  const dobRef = useRef();
  const [showWarning, setShowWarning] = useState(false);
  const [isEmailExist, setIsEmailExist] = useState(false);
  
  const openDatePicker = () => {
    dobRef.current.setOpen(true);
  };
  
  const { refId } = router.query;
  
  const explorepsychic = useSelector((state) => state.explorePsychic);
  const dispatch = useDispatch();
  useEffect(() => {
    if (explorepsychic?.data?.length === 0) {
      dispatch(explorePsychicData());
    }
  }, [explorepsychic]);

  const onDateSelect = (date) => {
    setStartDate(date);
  };

  const [startDate, setStartDate] = useState("");
  const {
    register,
    setValue,
    getValues,
    setError,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onChange", reValidateMode: "onChange" });

  useEffect(() => {
    if (startDate) {
      setValue(
        "dob",
        `${("0" + (startDate.getMonth() + 1)).slice(-2)}/${
          startDate.getDate() < 10
            ? "0" + startDate.getDate()
            : startDate.getDate()
        }/${startDate.getFullYear()}`,
        { shouldValidate: true }
      );
    }
  }, [startDate]);

  const updateAddress = (address) => {
    // setPlace(address);
    if (address) {
      for (const component of address.address_components) {
        const componentType = component.types[0];
        switch (componentType) {
          case "locality":
            setValue("city", component.long_name, { shouldValidate: true });
            break;
          case "administrative_area_level_1": {
            setValue("state", component.long_name, { shouldValidate: true });
            break;
          }
        }
      }
    }
  };

  const onSubmitHandeler = (event) => {
    event.preventDefault();
    if (!isEmailExist) {
      trigger()
        .then((res) => {
          if (res) {
            /**
             * Sending Data as a query param to next page
             */
            const fieldData = getValues();
            const currentFormData = { ...fieldData };
            if (refId) {
              currentData["refId"] = refId;
            }
            const queryParams = new URLSearchParams({
              ...currentFormData,
            }).toString();

            document.getElementById("main").classList.add("animate__fadeOut");
            setTimeout(
              () =>
                router.push(`/professional/signup/abilities?${queryParams}`),
              1000
            );
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const verifyEmail = (value) => {
    axiosInstance
      .get(`${API.userCheckEmail}?email=${value}`)
      .then((res) => {
        setIsEmailExist(false);
        delete errors?.email;
      })
      .catch((err) => {
        if (err?.code === 400) {
          setIsEmailExist(true);
          setError("email", { message: err?.message });
        }
      });
  };

  const handleEmailVerification = (e) => {
    const value = e.target.value;
    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      verifyEmail(value);
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
                      Psychic signup
                    </p>
                    <p className={classNames(styles.desc)}>
                      To get started, fill out the form below.
                    </p>
                  </div>

                  <form className={classNames(styles.formtag)}>
                    <>
                      <div className="row">
                        <div className="col">
                          <div className="form-floating mb-4">
                            <input
                              type="text"
                              className={`${styles.greyInputBg} fw-bolder ${
                                errors.first_name && styles.invalid
                              } form-control`}
                              id="floatingInputFirstName"
                              placeholder="First Name"
                              {...register("first_name", {
                                required: {
                                  value: true,
                                  message: "This is required",
                                },
                                pattern: {
                                  value: /^[a-zA-Z]+$/,
                                  // value: /^[a-zA-Z]+[a-zA-Z\s]*?[^0-9]$/,
                                  // value: /^([A-Za-z]!@#$%^&*().,<>{}[\]<>?_=+\-|;:\'\"\/])*[^\s]\+$/,
                                  // value:  /^[A-Za-z]+$/,
                                  // value:  /^[^\s][a-z\sA-Z\s0-9\s-()][^\s$]/,
                                  // message: "Only aphlabets are allowed",
                                  message:
                                    "Invalid characters. Only alphabetic characters are allowed.",
                                },
                                maxLength: {
                                  value: 20,
                                  message:
                                    "First name can only contain 20 characters",
                                },
                              })}
                            />
                            <label
                              htmlFor="floatingInputFirstName"
                              className={styles.floatingLabel}
                            >
                              First Name
                            </label>
                            {errors.first_name && (
                              <span className="invalid-feedback">
                                {errors?.first_name?.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-floating mb-4">
                            <input
                              type="text"
                              className={`${styles.greyInputBg} fw-bolder ${
                                errors.last_name && styles.invalid
                              } form-control`}
                              id="floatingInputLastName"
                              placeholder="Last Name"
                              {...register("last_name", {
                                required: {
                                  value: true,
                                  message: "This is required",
                                },
                                pattern: {
                                  value: /^[a-zA-Z]+$/,
                                  // value: /^[a-zA-Z]+[a-zA-Z\s]*?[^0-9]$/,
                                  // value: /^([A-Za-z]!@#$%^&*().,<>{}[\]<>?_=+\-|;:\'\"\/])*[^\s]\+$/,
                                  // value:  /^[A-Za-z]+$/,
                                  // value:  /^[^\s][a-z\sA-Z\s0-9\s-()][^\s$]/,
                                  // message: "Only aphlabets are allowed",
                                  message:
                                    "Invalid characters. Only alphabetic characters are allowed.",
                                },
                                maxLength: {
                                  value: 20,
                                  message:
                                    "Last name can only contain 20 characters",
                                },
                              })}
                            />
                            <label
                              htmlFor="floatingInputLastName"
                              className={styles.floatingLabel}
                            >
                              Last Name
                            </label>
                            {errors.last_name && (
                              <span className="invalid-feedback">
                                {errors?.last_name?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col">
                          <div className="form-floating mb-4">
                            <input
                              type="text"
                              className={`${styles.greyInputBg} ${
                                errors.nickName && styles.invalid
                              } form-control fw-bolder`}
                              id="nickName"
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
                                  message:
                                    "Moniker can only contain 20 characters",
                                },
                              })}
                            />
                            <label
                              htmlFor="floatingInputEmail"
                              className={styles.floatingLabel}
                            >
                              Moniker
                            </label>
                            {errors?.nickName && (
                              <span className="invalid-feedback">
                                {errors?.nickName?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <div className="form-floating mb-4">
                            <div className="input-group mb-3">
                              <ReactDatePicker
                                ref={dobRef}
                                popperClassName="custom-calenderPopper-login"
                                calendarClassName="custom-professionalDatePicker-login"
                                maxDate={new Date().setFullYear(
                                  new Date().getFullYear() - 18
                                )}
                                minDate={new Date().setFullYear(
                                  new Date().getFullYear() - 103
                                )}
                                className={styles.datePicker}
                                selected={startDate}
                                scrollableYearDropdown
                                showYearDropdown={true}
                                showMonthDropdown={true}
                                yearDropdownItemNumber={150}
                                dateFormatCalendar="MMMM"
                                onChange={(date) => onDateSelect(date)}
                              />
                              <div className="form-floating">
                                <MaskedInput
                                  mask="99/99/9999"
                                  alwaysShowMask
                                  type="text"
                                  onFocus={openDatePicker}
                                  className={`${styles.greyInputBg} fw-bolder ${
                                    errors.dob && styles.invalid
                                  } form-control`}
                                  id="floatingInputDob"
                                  placeholder="Date Of Birth"
                                  maskChar={null}
                                  onChange={(event) =>
                                    setValue("dob", event.target.value)
                                  }
                                  {...register("dob", {
                                    required: {
                                      value: true,
                                      message: "This is a required field",
                                    },
                                    validate: {
                                      isValidDate: (value) =>
                                        moment(value).isValid() ||
                                        "Please enter a valid date",
                                      isDateMore: (value) => {
                                        if (moment(value).isValid()) {
                                          const minimumYear = moment().subtract(
                                            18,
                                            "years"
                                          );
                                          const maximumYear = moment().subtract(
                                            103,
                                            "years"
                                          );
                                          const givenYear = moment(value);

                                          if (minimumYear.diff(givenYear) < 0) {
                                            return "Your age must be 18 years old";
                                          }
                                          if (givenYear.diff(maximumYear) < 0) {
                                            return "Your age must be 103 years old";
                                          }
                                        }
                                        return true;
                                      },
                                    },
                                  })}
                                  disableUnderline
                                />
                                <label
                                  htmlFor="floatingInputDob"
                                  className={styles.floatingLabel}
                                >
                                  Date of Birth
                                </label>
                              </div>
                              <button
                                className={classNames(
                                  errors.dob && styles.invalid,
                                  "btn btn-outline-secondary",
                                  styles.datepickerBtn
                                )}
                                onClick={openDatePicker}
                                type="button"
                                id="button-addon1"
                              >
                                <Image
                                  alt="c-icon"
                                  width={100}
                                  height={100}
                                  src={"/images/calendar-signup.svg"}
                                  className={styles.calenderIcon}
                                />
                              </button>
                              {errors.dob && (
                                <span className="invalid-feedback">
                                  {errors?.dob?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <div className="form-floating mb-4">
                            <input
                              type="text"
                              className={`${styles.greyInputBg} ${
                                errors.email && styles.invalid
                              } form-control fw-bolder`}
                              id="floatingInputEmail"
                              placeholder="Email Address"
                              {...register("email", {
                                required: {
                                  value: true,
                                  message: "This is required",
                                },
                                onChange: handleEmailVerification,
                                pattern: {
                                  value:
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                  message: "Please enter valid Email Address",
                                },
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
                                {errors?.email?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col">
                          <AutoComplete
                            updateAddress={updateAddress}
                            errors={errors}
                            register={register}
                            setValue={setValue}
                          />
                        </div>
                        <div className="col">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className={`${styles.greyInputBg} ${
                                errors.state && styles.invalid
                              } form-control fw-bolder`}
                              id="floatingInputState"
                              onChange={(event) =>
                                setValue("state", event.target.value)
                              }
                              placeholder="State"
                              {...register("state", { required: true })}
                            />
                            <label
                              htmlFor="floatingInputGen"
                              className={styles.floatingLabel}
                            >
                              State
                            </label>
                            {errors.state && (
                              <span className="invalid-feedback">
                                This is required.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <div className="form-floating mb-3">
                            <select
                              onChange={(event) =>
                                setValue("gender", event.target.value)
                              }
                              {...register("gender", {
                                required: true,
                                validate: (value) => {
                                  return (
                                    value !== "Select Gender" ||
                                    "This is A Required Field"
                                  );
                                },
                              })}
                              className={classNames(
                                "form-select fw-bolder",
                                errors.gender && styles.invalid,
                                styles.greyInputBg
                              )}
                              aria-label="Default select example"
                            >
                              <option defaultValue hidden>
                                Select Gender
                              </option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            <label
                              htmlFor="floatingInputGen"
                              className={styles.floatingLabel}
                            >
                              Gender
                            </label>
                            {errors.gender && (
                              <span className="invalid-feedback">
                                This is required.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <div className="form-floating mb-3">
                            <select
                              onChange={(event) =>
                                setValue("actual_rate", event.target.value)
                              }
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
                              <option defaultValue hidden>
                                Select Rate
                              </option>
                              <option value="5">$5</option>
                              <option value="8">$8</option>
                              <option value="10">$10</option>
                              <option value="15">$15</option>
                            </select>
                            <label
                              htmlFor="floatingInputGen"
                              className={styles.floatingLabel}
                            >
                              Rate{" "}
                            </label>
                            {errors.actual_rate && (
                              <span className="invalid-feedback">
                                This is required.
                              </span>
                            )}
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
                      <div
                        className={classNames(
                          styles.SignUpButtonContainer,
                          "row mt-3"
                        )}
                      >
                        <div
                          className={classNames(
                            styles.SignUpButtonWrapper,
                            "col d-grid gap-2"
                          )}
                        >
                          <button
                            onClick={onSubmitHandeler}
                            className={classNames(
                              "btn btn-dark btn-block signupBtn rounded-2"
                            )}
                            role="button"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                    <div className="row">
                      <div className={styles.loginDiv + " col"}>
                        <p>
                          Already have an account?{" "}
                          <a href="/professional/login" className="btn-link">
                            Login
                          </a>
                        </p>
                        <p className={styles.copyright + " mt-2"}>
                          © 2023 Psychix. All rights reserved.
                        </p>
                      </div>
                    </div>
                  </form>
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
                src={"/images/Signuppage1.svg"}
                className={classNames("pt-3", styles.pageImage)}
                alt=""
              />

              <div className={classNames(styles.vh25, styles.rightDivTitle)}>
                <h5 className={classNames(styles.heading)}>
                  We're dedicated to helping psychics realize & maximize their
                  value
                </h5>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;
