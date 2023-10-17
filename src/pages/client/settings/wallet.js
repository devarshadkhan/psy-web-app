import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/client/settings/Wallet.module.css";
import UserNavbar from "@/components/navbars/UserNavbar";
import EditProfileSidebar from "@/components/editprofilesidebar/EditProfileSidebar";
import PaymentHistory from "@/components/paymenthistory/PaymentHistory";
import classNames from "classnames";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "@/components/stripepayment/Payment";
import axiosInstance from "@/utils/axios";
import { walletDetailsFetch } from "@/store/common/walletDatafetch";
import { useDispatch } from "react-redux";
import { API } from "@/utils/apiendpoints";
import { ToastContainer } from "react-toastify";
import CardRow from "@/components/cardRow/CardRow";
import Head from "next/head";
import { _debounce } from "@/utils/common";
import { debounce } from "lodash";

const Wallet = () => {
  const dispatch = useDispatch();
  const [time, setTime] = useState(0.0);
  const inputRef = useRef(null);
  const [helper, setHelper] = useState("");
  const stripePromise = loadStripe(process.env.STRIPE_KEY);
  const [walletDetails, setWalletDetails] = useState(null);
  const [amount, setAmount] = useState("");
  const [AmountValidation, setAmountValidation] = useState(false);
  const [amountValue, setAmountValue] = useState(false);
const [stateValue, setStateValue] = useState()
  const getWalletDetails = () => {
    dispatch(walletDetailsFetch())
      .then((res) => {
        if (!res?.error) {
          setWalletDetails(res?.payload);
          setTime(res?.payload?.balance);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleAmountChange = (event) => {
    const value = parseInt(event.target.value);
    if (value < 10) {
      setHelper("Minimum amount Should be $10");
      setAmountValidation(false);
      setAmountValue(false);
    } else if (value > 10000) {
      setHelper("Maximum amount Should be $10,000");
    }
    if (value >= 10 && value <= 10000) {
      setHelper("");
      getBillingDetails(value);
      setAmountValidation(true);
      setAmountValue(true);
    }
    setAmount(value);
    const isValid = /^[1-9][0-9]*$/.test(value); // Check if value matches the pattern

    if (isValid) {
      // Update the state or perform any other desired action
      setStateValue(value);
    }
  
  };

  const getBillingDetails = (value) => {
    axiosInstance
      .get(`${API.walletAddMoneyDetails}?amount=${value}`)
      .then((res) => {
        setHelper(
          `To add $${res?.amount}, psychia would charge you : $${res?.actual_amount} (${res?.processing_rate}% + ${res?.extra_cents}¢) is the processing fee`
        );
      })
      .catch((err) => console.log(err));
  };

  const handleInput = (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (newValue > 10000) {
      event.target.value = 10000;
    }
    event.target.value =
    event.target.value.match(/^[1-9][0-9]*$/)
  };

  const RemoveCard = (card_id) => {
    setRemoveLoader(card_id);
    axiosInstance
      .delete(
        `${API.walletRemoveCard}?walletId=${walletDetails.id}&cardId=${card_id}`
      )
      .then((res) => {
        setLoader(true);
        setRemoveLoader("");
        getWalletDetails();
      })
      .catch((err) => {
        setLoader(false);
        setRemoveLoader("");
      });
  };

  useEffect(() => {
    getWalletDetails();
  }, []);

  const handleWheel = (e) => {
    e.currentTarget.blur();
  };

  const handleFocus = (e) => {
    e.currentTarget.addEventListener("wheel", handleWheel, { passive: false });
  };

  const handleBlur = (e) => {
    e.currentTarget.removeEventListener("wheel", handleWheel);
  };

  return (
    <>
      <Head>
        <title>Wallet | Psychix</title>
        <meta name="description" content="Wallet | Psychix" />
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

      <div className={styles.wrapper_security}>
        <div className={classNames(styles.cntr_main, "container-fluid")}>
          <div className="row">
            <div className="col-lg-3 col-md-12 col-sm-12">
              <EditProfileSidebar />
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12">
              <div className={styles.wallet}>
                <h2>Wallet</h2>
                <div className={styles.card_name}>
                  <h4>Current Balance : ${time}</h4>
                </div>

                <label className={styles.formLabel}>
                  Add Amount
                  <input
                    value={amount}
                    onChange={handleAmountChange}
                    className={`${AmountValidation && styles.valid} ${
                      styles.inputNameField
                    } mb-2`}
                    type="number"
                    pattern="[1-9]{1}[0-9]{9}"
                    // type="text"
                    ref={inputRef}
                    max={10000}
                    onInput={handleInput}
                    onWheel={handleWheel}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                  />
                  <span
                    className={classNames(
                      !AmountValidation && "error-text",
                      "input-helper mt-3"
                    )}
                  >
                    {helper}
                    {/* To add $10, psychia would charge you : $10.59 (2.9% + 30 cents) is the processing fee */}
                  </span>
                </label>

                <div className={styles.card_name}>
                  <h4>Credit card</h4>
                </div>

                {walletDetails?.saved_cards?.map((items) => {
                  return (
                    <CardRow
                      amount={amount}
                      setAmount={setAmount}
                      items={items}
                      setHelper={setHelper}
                      walletDetails={walletDetails}
                      getWalletDetails={getWalletDetails}
                    />
                  );
                })}
                <div className={styles.new_card_added}>
                  <h4>Add new credit card</h4>
                  {/* <div className={styles.card_image}> */}
                  <img
                    src="/images/SettingsImage/walletImage/Visa-master-img.png"
                    alt=""
                  />
                  {/* </div> */}
                </div>

                <div className="row">
                  <Elements stripe={stripePromise}>
                    <Payment
                      amount={amount}
                      setHelper={setHelper}
                      setAmount={setAmount}
                      getWalletDetails={getWalletDetails}
                      from="settings-wallet"
                      setAmountValue={setAmountValue}
                      amountValueCheck={amountValue}
                    />
                  </Elements>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* payment history table start */}
      {walletDetails?.Payments?.length > 0 && (
        <PaymentHistory RemoveCard={RemoveCard} walletDetails={walletDetails} />
      )}
      {/* payment history table end */}
    </>
  );
};

export default Wallet;
