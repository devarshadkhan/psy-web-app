import React, { useState } from "react";
import {
  useStripe,
  useElements,
  AuBankAccountElement,
  CardElement,
} from "@stripe/react-stripe-js";
import styles from "@/styles/professional/dashboard/PayoutHistory.module.css";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";

const index = ({ setAddBankAccount }) => {
  const stripe = useStripe();
  const [name, setName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));

      const bankAccountData = {
        country: "US",
        currency: "USD",
        account_holder_name: name,
        account_holder_type: "individual",
        routing_number: routingNumber,
        account_number: accountNumber,
      };

      const { error, token } = await stripe.createToken(
        "bank_account",
        bankAccountData
      );

      if (error) {
        console.error(error);
      } else {
        const Parameters = {
          // ...bankAccountData,
          routing_number: routingNumber,
          account_number: accountNumber,
          amount: "2000",
          bankAccountToken: token?.id,
          save_bank: true,
        };
        axiosInstance
          .post(API.walletPayout, Parameters)
          .then((res) => {
            return;
          })
          .catch((err) => console.log(err));

        // Send the token to your server to create a bank account
      }
    }
  };
  return (
    <>
      <div className="mb-4">
        <label
          for="FormControlInput1"
          className={"form-label " + styles.formlabel}
        >
          Name
        </label>
        <div className={"input-group mb-3 "}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={"form-control " + styles.formInput}
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>
      </div>
      <div className="mb-4">
        <label
          for="FormControlInput1"
          className={"form-label " + styles.formlabel}
        >
          Account Number
        </label>
        <div className={"input-group mb-3 "}>
          <input
            type="text"
            value={accountNumber}
            onChange={(event) => setAccountNumber(event.target.value)}
            name="accountNumber"
            className={"form-control " + styles.formInput}
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          for="FormControlInput1"
          className={"form-label " + styles.formlabel}
        >
          Routing Number
        </label>
        <div className={"input-group mb-3 "}>
          <input
            type="text"
            id="routingNumber"
            name="routingNumber"
            value={routingNumber}
            onChange={(event) => setRoutingNumber(event.target.value)}
            className={"form-control " + styles.formInput}
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>
      </div>

      {error && <div>{error}</div>}
      <div className={styles.btnContainer}>
        <button className={styles.formbtn} role="button" onClick={handleSubmit}>
          Submit
        </button>
        <button
          onClick={() => setAddBankAccount(false)}
          className={styles.formbtn}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default index;
