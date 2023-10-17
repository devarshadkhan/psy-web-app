import UserNavbar from "@/components/navbars/UserNavbar";
import Head from "next/head";
import styles from "@/styles/client/future-payment/FuturePayment.module.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Back from "@/components/icons/Back";
import PaymentProfile from "@/components/paymentProfile/PaymentProfile";
import { useEffect, useState } from "react";
import Payment from "@/components/stripepayment/Payment";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import { useDispatch } from "react-redux";
import { createSchedule } from "@/store/client/createSchedule";
import { walletDetailsFetch } from "@/store/common/walletDatafetch";
import { ToastContainer, toast } from "react-toastify";
import SubscriptionDetail from "@/components/subscriptionDetail/SubscriptionDetail";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";

const Index = () => {
  const [selectPaymentMethod, setSelectPaymentMethod] = useState("");
  const [walletDetails, setWalletDetails] = useState(null);
  const [selectedCard, setSelectedCards] = useState("");
  const [isNewCardAdd, setIsNewCardAdd] = useState(false);
  const [loader, setLoader] = useState(false);
  const [walletLoader, setwalletLoader] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [profRateInfo, setPaymentRefInfo] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();
  const {
    id,
    type,
    price,
    priceId,
    picture,
    appointment_type,
    name,
    recuring,
    date,
    slotId,
    start_time,
    schedule_type,
    end_time,
    duration,
  } = router.query;
  const getWalletDetails = () => {
    dispatch(walletDetailsFetch())
      .then((res) => {
        !res?.error && setWalletDetails(res?.payload);
        setWalletBalance(res?.payload?.balance);
      })
      .catch((err) => console.log(err));
  };
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedCard) {
      setLoader(true);
      // We don't want to let default form submission happen here,
      // which would refresh the page.

      // Send the token to your server.
      // This function does not exist yet; we will define it in the next step.

      const params = {
        meeting_type: appointment_type,
        slotId: slotId,
        category: type,
        desc: "Added to wallet",
        token: "",
        save_card: false,
        card_id: JSON.parse(selectedCard)?.id,
      };
      dispatch(createSchedule(params)).then((res) => {
        setLoader(false);
        if (!res?.error) {
          if (appointment_type === "telephone") {
            router.push(
              `/client/audioappointmentphone?id=${res?.payload?.id}&meetingId=${res?.payload?.meetingId}&pin=${res?.payload?.pin}&total_amount=${res?.payload?.amount_paid}&type=${type}&schedule_type=${schedule_type}&picture=${picture}&appointment_type=${appointment_type}&duration=${duration}&name=${name}&date=${start_time}`
            );
          } else {
            // console.log(res);
            router.push(
              `/client/appointment-successful?id=${res?.payload?.id}&total_amount=${res?.payload?.amount_paid}&type=${type}&schedule_type=${schedule_type}&picture=${picture}&appointment_type=${appointment_type}&duration=${duration}&name=${name}&date=${start_time}`
            );
          }
        }
      });
    } else {
      toast.error("please select a card", {
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
      setUserProfile(item);
    }
  }, []);

  const getProfRateInfo = async () => {
    await axiosInstance
      .get(`${API.walletScheduleDetail}/${slotId}?userId=${userProfile?.id}`)
      .then((res) => {
        setPaymentRefInfo(res);
      });
  };

  useEffect(() => {
    if (slotId && userProfile?.id) {
      getProfRateInfo();
    }
  }, [slotId, userProfile]);

  const walletPay = () => {
    setwalletLoader(true);
    const params = {
      meeting_type: appointment_type,
      category: type,
      slotId: slotId,
      save_card: false,
      card_id: "",
    };
    dispatch(createSchedule(params)).then((res) => {
      setwalletLoader(false);
      if (!res?.error) {
        if (appointment_type === "telephone") {
          router.push(
            `/client/audioappointmentphone?id=${res?.payload?.id}&meetingId=${res?.payload?.meetingId}&pin=${res?.payload?.pin}&total_amount=${res?.payload?.amount_paid}&type=${type}&schedule_type=${schedule_type}&picture=${picture}&appointment_type=${appointment_type}&duration=${duration}&name=${name}&date=${start_time}`
          );
        } else {
          router.push(
            `/client/appointment-successful?id=${res?.payload?.id}&total_amount=${res?.payload?.amount_paid}&type=${type}&schedule_type=${schedule_type}&picture=${picture}&appointment_type=${appointment_type}&duration=${duration}&name=${name}&date=${start_time}`
          );
        }
      }
    });
  };

  useEffect(() => {
    getWalletDetails();
    createSchedule();
  }, []);

  const stripePromise = loadStripe(process.env.STRIPE_KEY);
  return (
    <>
      <Head>
        <title>Payment | Psychix</title>
        <meta name="description" content="Payment | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={"container-fluid p-0 "}>
          <div>
            {router.asPath.includes("professional") ? (
              <ProfessionalNavbar />
            ) : (
              <UserNavbar image="/images/avatar.png" />
            )}
          </div>

          <div>
            {!router.asPath.includes("subscribeconfirm") && (
              <div
                onClick={() => router.back(-1)}
                className={"cursor-pointer " + styles.backHeader}
              >
                <Back /> &nbsp;Back to Set Appointment
              </div>
            )}

            <div className={"d-flex " + styles.paymentWrapper}>
              <div
                className={
                  "col-lg-6 col-md-12 col-sm-12 " + styles.leftContainer
                }
              >
                <h1 className={styles.pageHeading}>Confirm and pay</h1>
                <hr className={styles.line} />

                <div className="d-flex flex-column gap-5">
                  <div
                    className={
                      "d-flex justify-content-between " + styles.paymentOption
                    }
                  >
                    <p>Pay with</p>
                  </div>
                  {!router.asPath.includes("subscribeconfirm") && (
                    <div
                      className={
                        "d-flex justify-content-between " + styles.creditCard
                      }
                    >
                      <div className="d-flex mb-0 gap-2">
                        <p className={`mb-0 ${styles.checkName}`}>Wallet</p>
                      </div>
                      <div>
                        <span className={styles.walletAmount}>
                          ${walletBalance}
                        </span>
                      </div>
                    </div>
                  )}

                  {walletDetails?.saved_cards?.length > 0 && (
                    <>
                      {(parseFloat(profRateInfo?.total_amount) > 0 ||
                        router.asPath.includes("subscribeconfirm")) && (
                        <>
                          <select
                            disabled={
                              isNewCardAdd ||
                              walletDetails?.saved_cards?.length === 0
                            }
                            onChange={(event) =>
                              setSelectedCards(event.target.value)
                            }
                            className={
                              "form-select form-select-md mb-3 w-100 " +
                              styles.selectBox
                            }
                            aria-label=".form-select-lg example"
                          >
                            <option selected defaultValue hidden>
                              Select Card
                            </option>
                            {walletDetails?.saved_cards?.map((items, index) => {
                              return (
                                <option value={JSON.stringify(items)}>
                                  x{items.last4} ({items.brand})
                                </option>
                              );
                            })}
                          </select>
                          <div className="w-100 d-flex gap-3">
                            <button
                              onClick={(event) => {
                                if (!loader) {
                                  handleSubmit(event);
                                }
                              }}
                              disabled={isNewCardAdd}
                              className={styles.payBtn + " mt-2"}
                            >
                              {loader ? (
                                <>
                                  <span
                                    className="spinner-border me-2 spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  Paying...
                                </>
                              ) : (
                                "Confirm and Pay"
                              )}
                            </button>
                            <button
                              onClick={() => setIsNewCardAdd(!isNewCardAdd)}
                              className={styles.payBtn + " mt-2"}
                            >
                              {isNewCardAdd ? "Close Add Card" : "Add Card"}
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {(isNewCardAdd || walletDetails?.saved_cards?.length === 0) &&
                    (parseFloat(profRateInfo?.total_amount) > 0 ||
                      router.asPath.includes("subscribeconfirm")) && (
                      <div
                        className={
                          "d-flex justify-content-between " + styles.creditCard
                        }
                      >
                        <div className="d-flex mb-0 gap-2">
                          <p className={`mb-0 ${styles.checkName}`}>
                            Add Credit Card
                          </p>
                        </div>
                        <div>
                          <span>
                            <img src="/images/visa.png" />
                          </span>
                        </div>
                      </div>
                    )}
                </div>

                {(((isNewCardAdd || walletDetails?.saved_cards?.length === 0) &&
                  parseFloat(profRateInfo?.total_amount) > 0) ||
                  router.asPath.includes("subscribeconfirm")) && (
                  <div className={`d-flex flex-column gap-3`}>
                    <Elements stripe={stripePromise}>
                      <Payment
                        walletDetails={walletDetails}
                        profRateInfo={profRateInfo}
                        getWalletDetails={getWalletDetails}
                        selectedCard={selectedCard}
                        selectPaymentMethod={selectPaymentMethod}
                      />
                    </Elements>
                  </div>
                )}

                {parseFloat(profRateInfo?.total_amount) <= 0 &&
                  !router.asPath.includes("subscribeconfirm") && (
                    <button
                      disabled={walletLoader}
                      onClick={!walletLoader && walletPay}
                      className={styles.payBtn}
                    >
                      {walletLoader ? (
                        <>
                          <span
                            className="spinner-border me-2 spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Paying...
                        </>
                      ) : (
                        "Confirm and pay"
                      )}
                    </button>
                  )}
              </div>

              {router.asPath.includes("subscribeconfirm") ? (
                <div
                  className={
                    "col-lg-6 col-sm-12 col-md-12" + styles.leftContainer
                  }
                >
                  <SubscriptionDetail
                    subscribeconfirm={router.asPath.includes(
                      "subscribeconfirm"
                    )}
                    recuring={recuring}
                    price={price}
                    priceId={priceId}
                  />
                </div>
              ) : (
                <div className={"col-lg-6 col-md-12 col-sm-12 "}>
                  <PaymentProfile profRateInfo={profRateInfo} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;
