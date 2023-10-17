import React, { useState } from "react";
import styles from "@/styles/client/settings/Wallet.module.css";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import { toast } from "react-toastify";

const CardRow = ({
  items,
  amount,
  walletDetails,
  getWalletDetails,
  setAmount,
  setHelper,
}) => {
  const [removeLoader, setRemoveLoader] = useState("");
  const [loader, setLoader] = useState(false);
  const [paylaoder, setPayloader] = useState(false);
  const RemoveCard = (card_id) => {
    setLoader(true);
    setRemoveLoader(card_id);
    axiosInstance
      .delete(
        `${API.walletRemoveCard}?walletId=${walletDetails.id}&cardId=${card_id}`
      )
      .then((res) => {
        setLoader(false);
        setRemoveLoader("");
        setHelper("");
        getWalletDetails();
      })
      .catch((err) => {
        setLoader(false);
        setRemoveLoader("");
      });
  };

  const walletPay = (card_id) => {
    if (parseInt(amount) >= 10 && parseInt(amount) <= 10000) {
      const params = {
        token: "",
        save_card: false,
        amount: String(amount),
        desc: "Added to wallet",
      };
      setPayloader(true);
      // Send the token to your server.
      // This function does not exist yet; we will define it in the next step.
      params.token = " ";
      params.card_id = card_id;
      axiosInstance
        .post(API.stripePayout, params)
        .then((res) => {
          setAmount("");
          setHelper("");
          setPayloader(false);
          getWalletDetails();
        })
        .catch((err) => {
          setPayloader(false);
          toast.error(err.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        });
    } else {
      toast.error("Minimum top up amount should be $10", {
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

  return (
    <>
      <div className={styles.card_added}>
        <div>
          <h5>
            {items?.brand} ••••••{items?.last4}
          </h5>
          <p>
            Expiration: {items?.exp_month}/{items?.exp_year}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            role="button"
            onClick={() => !paylaoder && walletPay(items?.id)}
          >
            {paylaoder ? (
              <>
                <span
                  className="spinner-border me-2 spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Adding Amount...
              </>
            ) : (
              "Add Amount"
            )}
          </button>
          <button
            role="button"
            disabled={removeLoader === items.id}
            onClick={() => !loader && RemoveCard(items?.id)}
          >
            {loader ? (
              <>
                <span
                  className="spinner-border me-2 spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Removing...
              </>
            ) : (
              "Remove "
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default CardRow;
