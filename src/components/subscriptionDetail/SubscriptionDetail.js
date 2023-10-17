import React from "react";
import styles from "@/styles/components/subscriptionDetail/SubscriptionDetail.module.css";
import { AiOutlineDollarCircle } from "react-icons/ai";
const subscriptionDetail = ({
  productInfo,
  subscribeconfirm,
  price,
  recuring,
}) => {
  return (
    <>
      <div className={"" + styles.subcriptionWrapper}>
        <h2>
          Profesy+ Subscription <span>[Monthly]</span>
        </h2>
        <hr className={styles.line} />

        <div className={styles.subscription_detail}>
          <h3 className="text-center">Subscription Details</h3>

          <div className={styles.subscription_total}>
            <p>Instant Daily Payouts</p>
            <p>Profesy+ Debit Card</p>
            <p>Save 10% On Ads </p>
          </div>
          <div className={styles.subscription_total_price}>
            <h3>Total</h3>
            <p>
              $
              {subscribeconfirm
                ? (price / 100).toFixed(2)
                : productInfo?.prices[0]?.unit_amount}
              /{" "}
              <span>
                {subscribeconfirm
                  ? recuring
                  : productInfo?.prices[0]?.recurring?.interval}
              </span>
            </p>
          </div>

          <div className={styles.subscription_footer}>
            <AiOutlineDollarCircle />
            <p>Payments for Profesy+ subscriptions are non-refundable</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default subscriptionDetail;
