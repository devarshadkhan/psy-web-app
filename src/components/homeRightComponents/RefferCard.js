import styles from "@/styles/components/homerightside/RefferCard.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const RefferCard = ({ refLink }) => {
  const router = useRouter()
  const [isCopied, setIsCopies] = useState(false);
  const handleClick = () => {
    window.open("https://www.facebook.com/cheetahagencies", "_blank")
  };
  // const handleClick = () => {
  //   setIsCopies(true);
  //   setTimeout(() => {
  //     setIsCopies(false);
  //   }, 2000);
  // };
  return (
    <>
      <div className={styles.refferCard}>
        <div>
          <p className={styles.RCHeader}>Follow us on social media!</p>
          <p className={styles.RCContent}>
          Follow us to get the latest Psychix updates & more!






          </p>
          <button
            onClick={() => {
              // navigator.clipboard.writeText(refLink);
              handleClick();
            }}
            // disabled={isCopied}
            className={"btn " + styles.RCBtn}
          >Follow Us
            {/* {isCopied ? "Copied" : "Copy Link"} */}
          </button>
        </div>
        {/* <img className={styles.groupImg} src="/images/groupImg.png" /> */}
      </div>
    </>
  );
};

export default RefferCard;
