import styles from "@/styles/components/homerightside/JoinProfesy.module.css";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

function JoinProfesy({ productInfo, userData }) {
  const [isCopied, setIsCopies] = useState(false);
  const [profId, setProId] = useState("");
  const handleClick = () => {
    setIsCopies(true);
    setTimeout(() => {
      setIsCopies(false);
    }, 2000);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const value = JSON.parse(localStorage.getItem("userInfo"));
      setProId(value.id);
    }
  }, []);
  return (
    // <div className={styles.refferCard}>
    //   <div>
    //     <p className={styles.RCHeader}>Join Profesy+</p>
    //     <p className={styles.RCContent}>
    //     Share your link so that others can find you easily on Psychix!
    //     </p>
    //     <Link
    //       href={`/professional/settingspayment/subscribeconfirm?price=${productInfo?.prices[0]?.unit_amount}&recuring=${productInfo?.prices[0]?.recurring?.interval}&priceId=${productInfo?.prices[0]?.id}`}
    //       className={"btn " + styles.RCBtn}
    //     >
    //       <AiOutlinePlus /> Join Profesy+
    //     </Link>
    //   </div>
    // </div>
    <div className={styles.refferCard}>
      <div>
        <p className={styles.RCHeader}>Share Your Psychix Link</p>
        <p className={styles.RCContent}>
          Share your link so that others can find you easily on Psychix!
        </p>
        <a
          // href={`/professional/settingspayment/subscribeconfirm?price=${productInfo?.prices[0]?.unit_amount}&recuring=${productInfo?.prices[0]?.recurring?.interval}&priceId=${productInfo?.prices[0]?.id}`}
          // target="_blank"
          className={"btn " + styles.RCBtn}
          onClick={() => {
            navigator.clipboard.writeText(
              `${location.origin}/client/dashboard/explorepsychicdetails/${profId}`
            );
            // navigator.clipboard.writeText(`${location.href}/professional/settingspayment/subscribeconfirm?price=${productInfo?.prices[0]?.unit_amount}&recuring=${productInfo?.prices[0]?.recurring?.interval}&priceId=${productInfo?.prices[0]?.id}`);
            handleClick();
          }}
        >
          <AiOutlinePlus /> {isCopied ? "Copied" : "Copy Link"}
          {/* <AiOutlinePlus /> Copy Link */}
        </a>
      </div>
    </div>
  );
}

export default JoinProfesy;
