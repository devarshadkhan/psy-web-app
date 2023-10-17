import React from "react";
import styles from "@/styles/components/common/PaymentCard.module.css";
import classNames from "classnames";

const PaymentCard = ({
  bgtype,
  provider,
  cardType,
  cardNumber,
  cardName,
  expDate,
}) => {
  return (
    <div className={classNames(styles[bgtype], styles.mainCardContainer)}>
      <div className={styles.topSection}>
        {provider && <div className={styles.cardProvider}>{provider}</div>}
        <div className={styles.cardType}>
          <img
            src={
              cardType === "visa"
                ? "/images/PaymentCards/Visa.svg"
                : "/images/PaymentCards/Mastercard.png"
            }
            alt="paymentCards"
          />
        </div>
      </div>
      <div className={styles.middleSection}>{cardNumber}</div>
      <div className={styles.bottomSection}>
        <div className={styles.nameContainer}>
          <p className={styles.nameLabel}>Name</p>
          <p className={styles.name}>{cardName}</p>
        </div>
        <div className={styles.expDate}>{expDate}</div>
      </div>
    </div>
  );
};

export default PaymentCard;
