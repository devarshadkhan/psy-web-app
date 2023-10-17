import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import styles from "@/styles/client/future-payment/FuturePayment.module.css";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { createSchedule } from "@/store/client/createSchedule";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

export default function Payment({
  getWalletDetails,
  walletDetails,
  selectedCard,
  setHelper,
  amount,
  profRateInfo,
  from,
  amountValueCheck,
  setAmount,
  setAmountValue,
}) {
  const stripe = useStripe();
  const router = useRouter();
  const [Name, setName] = useState("");
  const expDate = useRef("");
  const Number = useRef("");
  const cvv = useRef("");
  const [isSavedCard, setIsSavedCard] = useState(false);
  const dispatch = useDispatch();
  const {
    id,
    type,
    price,
    appointment_type,
    schedule_type,
    picture,
    slotId,
    name,
    is_now,
    duration,
    priceId,
    start_time,
  } = router.query;
  const elements = useElements();
  const [loader, setLoader] = useState(false);
  const [validation, setValidation] = useState({
    cardNumber: false,
    cardHolder: false,
    cardExpiredate: false,
    cardCVC: false,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardNumberElement);
    if (router.asPath.includes("subscribeconfirm")) {
      if (window !== undefined) {
        try {
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          if (
            validation?.cardCVC &&
            validation.cardExpiredate &&
            validation.cardHolder &&
            validation.cardNumber
          ) {
            setLoader(true);
            const paymentMethod = await stripe?.createPaymentMethod({
              type: "card",
              card: card,
              billing_details: {
                name: `${userInfo?.first_name} ${userInfo?.last_name}`,
                email: `${userInfo?.email}`,
              },
            });
            if (paymentMethod?.error) {
              toast.error(paymentMethod?.error?.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
              setLoader(false);
            } else {
              const subcriptionData = await axiosInstance
                .post(API.subscriptionPayment, {
                  paymentMethod: paymentMethod?.paymentMethod?.id,
                  priceId: priceId,
                  save_card: isSavedCard,
                })
                .then((res) => res)
                .catch((err) => {
                  setLoader(false);
                });
              if (subcriptionData) {
                const confirmPayment = await stripe?.confirmCardPayment(
                  subcriptionData.clientSecret
                );
                if (confirmPayment?.error) {
                  alert(confirmPayment.error.message);
                } else {
                  setLoader(false);
                  axiosInstance
                    .post(API.subscriptionUpgrade, {
                      id: paymentMethod?.paymentMethod?.id,
                    })
                    .then((res) => {
                      Swal.fire({
                        title: "You have subscribed successfully",
                        icon: "success",
                        confirmButtonText: "OK",
                      }).then((result) => {
                        router.push("/professional/dashboard");
                      });
                      localStorage.setItem("userInfo", JSON.stringify(res));
                    })
                    .catch((err) => setLoader(false));
                }
              }
            }
          } else {
            toast.error("Please fill all the required fields", {
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
        } catch (error) {
          setLoader(false);
          console.log(error);
        }
      }
    } else {
      if (
        validation?.cardCVC &&
        validation.cardExpiredate &&
        validation.cardHolder &&
        validation.cardNumber
      ) {
        setLoader(true);
        amount < 10 && setLoader(false);

        const result = await stripe.createToken(card);

        if (result.error) {
          toast.error(result?.error?.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setLoader(false);
          // Show error to your customer.
        } else {
          if (from !== "settings-wallet") {
            if (is_now === "true") {
              const params = {
                meeting_type: appointment_type,
                category: type,
                professional: id,
                desc: "Added to wallet",
                save_card: isSavedCard,
                card_id: result?.token?.card?.id,
                token: result?.token?.id,
              };
              axiosInstance
                .post("/schedules/now", params)
                .then((res) => {
                  setLoader(false);
                  elements?.getElement(CardNumberElement).clear();
                  elements?.getElement(CardExpiryElement).clear();
                  elements?.getElement(CardCvcElement).clear();

                  setName("");
                  if (from === "settings-wallet") {
                    setAmount("");
                    setHelper("");
                    setIsSavedCard(false);
                    setAmountValue(false);
                  }
                  if (appointment_type === "telephone") {
                    router.push(
                      `/client/audioappointmentphone?id=${res?.id}&meetingId=${res?.meetingId}&pin=${res?.pin}&total_amount=${res?.amount_paid}&type=${type}&schedule_type=${schedule_type}&picture=${picture}&appointment_type=${appointment_type}&duration=${duration}&name=${name}&date=${start_time}`
                    );
                  } else {
                    router.push(
                      `/client/appointment-successful?id=${res?.id}&total_amount=${res?.amount_paid}&type=${type}&schedule_type=${schedule_type}&picture=${picture}&appointment_type=${appointment_type}&duration=${duration}&name=${name}&date=${start_time}`
                    );
                  }
                })
                .catch((err) => {
                  setLoader(false);
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
            } else {
              const params = {
                meeting_type: appointment_type,
                category: type,
                slotId: slotId,
                desc: "Added to wallet",
                save_card: isSavedCard,
                card_id: result?.token?.card?.id,
                token: result?.token?.id,
              };
              dispatch(createSchedule(params)).then((res) => {
                setLoader(false);
                if (!res.error) {
                  setLoader(false);
                  elements?.getElement(CardNumberElement).clear();
                  elements?.getElement(CardExpiryElement).clear();
                  elements?.getElement(CardCvcElement).clear();

                  setName("");
                  if (from === "settings-wallet") {
                    setAmount("");
                    setHelper("");
                    setIsSavedCard(false);
                    setAmountValue(false);
                  }
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
            }
          } else {
            const params = {
              token: "",
              save_card: isSavedCard,
              amount: String(amount),
              desc: "Add Money To Wallet",
            };

            // Send the token to your server.
            // This function does not exist yet; we will define it in the next step.
            params.token = result?.token?.id;
            params.card_id = result?.token?.card?.id;
            axiosInstance
              .post(API.stripePayout, params)
              .then((res) => {
                setLoader(false);
                elements?.getElement(CardNumberElement).clear();
                elements?.getElement(CardExpiryElement).clear();
                elements?.getElement(CardCvcElement).clear();
                getWalletDetails();
                const reset = {
                  cardCVC: false,
                  cardExpiredate: false,
                  cardHolder: false,
                  cardNumber: false,
                };
                setValidation({ ...reset });
                setName("");
                if (from === "settings-wallet") {
                  setAmount("");
                  setIsSavedCard(false);
                  setHelper("");
                  setAmountValue(false);
                }
              })
              .catch((err) => {
                setLoader(false);
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
          }
        }
      } else {
        toast.error("Please fill all the required fields", {
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
    }
  };

  const handleCardNumberChange = (event) => {
    if (event.empty) {
      setValidation({ ...validation, cardNumber: false });
    }
    if (event.complete) {
      setValidation({ ...validation, cardNumber: true });
    } else if (event.error) {
      setValidation({ ...validation, cardNumber: false });
    }
  };

  const handleCardExpireDate = (event) => {
    if (event.empty) {
      setValidation({ ...validation, cardExpiredate: false });
    }
    if (event.complete) {
      setValidation({ ...validation, cardExpiredate: true });
    }
  };

  const handleCardCVC = (event) => {
    if (event.empty) {
      setValidation({ ...validation, cardCVC: false });
    }
    if (event.complete) {
      setValidation({ ...validation, cardCVC: true });
    }
  };
  return (
    <>
      <form className={styles.paymentForm} onSubmit={handleSubmit}>
        <label className={styles.formLabel}>
          Card Number
          <CardNumberElement
            required
            name="cardNumber"
            options={{
              disabled: !amountValueCheck && from === "settings-wallet",
            }}
            onReady={(element) => (Number.current = element)}
            onChange={handleCardNumberChange}
            className={`${styles.inputField} ${
              validation.cardNumber && styles.valid
            } ${styles.inputField}`}
          />
        </label>
        <label className={styles.formLabel}>
          Card Holder
          <input
            disabled={!amountValueCheck && from === "settings-wallet"}
            name="name"
            value={Name}
            onChange={(e) => {
              setValidation({
                ...validation,
                cardHolder: e.target.value ? true : false,
              });
              setName(e.target.value);
            }}
            className={`${
              !amountValueCheck && from === "settings-wallet"
                ? styles.disabledField
                : styles.normalField
            }
            ${styles.inputNameField} ${validation.cardHolder && styles.valid} ${
              styles.inputNameField
            }`}
            placeholder="Jone Doe"
            type="text"
            required
          />
        </label>

        <div className={styles.expirationCvc}>
          <label className={styles.formLabel}>
            Expiration date
            <CardExpiryElement
              options={{
                disabled: !amountValueCheck && from === "settings-wallet",
              }}
              className={classNames(
                `${validation.cardExpiredate && styles.valid} ${
                  styles.inputField
                }`,
                styles.inputField
              )}
              onReady={(element) => (expDate.current = element)}
              onChange={handleCardExpireDate}
            />
          </label>
          <label className={styles.formLabel}>
            CVC
            <CardCvcElement
              options={{
                disabled: !amountValueCheck && from === "settings-wallet",
              }}
              className={classNames(
                `${validation.cardCVC && styles.valid} ${styles.inputField}`,
                styles.inputField
              )}
              onReady={(element) => (cvv.current = element)}
              onChange={handleCardCVC}
            />
          </label>
        </div>

        {!router.asPath.includes("subscribeconfirm") && (
          <div className={"form-check " + styles.checkboxField}>
            <input
              className={"form-check-input " + styles.checkbox}
              type="checkbox"
              checked={isSavedCard}
              onChange={(event) => setIsSavedCard(event.target.checked)}
              id="flexCheckDefault"
            />
            <label className="form-check-label" for="flexCheckDefault">
              Save Card
            </label>
          </div>
        )}
        <button
          type="submit"
          disabled={(!stripe && !selectedCard) || loader}
          className={styles.payBtn}
        >
          {loader ? (
            <>
              <span
                className="spinner-border me-2 spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              {from === "settings-wallet" ? "Adding Card" : "Adding and Paying"}
            </>
          ) : (
            <>{from === "settings-wallet" ? "Add Card" : "Add and Pay"}</>
          )}
        </button>
      </form>
    </>
  );
}
