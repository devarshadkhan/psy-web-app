import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import React from "react";
import styles from "@/styles/professional/subscribe/Subscribe.module.css";
import classNames from "classnames";
import { useRouter } from "next/router";

const Subscribe = () => {
  const router = useRouter();
  return (
    <>
      <ProfessionalNavbar />

      <div className={styles.wrapper_subscribe}>
        <div className={classNames(styles.cntr_main, "container-fluid")}>
          {/* <div className={"container"}> */}
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className={styles.sec_subscribed}>
                <h2>You are subscribed! 🎉</h2>
                <p>
                  Now you can get your money instantly and can spend it
                  instantly too!
                </p>
                <img src="/images/SettingsImage/Divider.png" alt="" />
              </div>

              <div className={styles.back_btn}>
                <button onClick={() => router.back(-1)}>
                  Back to dashboard
                </button>
              </div>
            </div>

            <div className="col-lg-6 col-md-12 col-sm-12">
              <img src="/images/SubscribeImg/illustartion.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscribe;