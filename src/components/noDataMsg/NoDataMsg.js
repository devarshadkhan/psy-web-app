import React from "react";
import styles from "../../styles/components/noDataMsg/NoDataMsg.module.css";
const NoDataMsg = (props) => {
  return (
    <>
      <div
        className={
          styles.noChatHistory + " " + "col-lg-12 p-4 col-sm-12 col-md-12"
        }
      >
        <div className="text-center">
          <img
            src={props.img}
            className={styles.IMG}
            style={{
              height: props.message === "Coming Soon" ? "174px" : "200px",
              width: props.message === "Coming Soon" ? "157px" : "200px",
            }}
            alt=""
          />
        </div>
        <p className={styles.noChatHistorytext}>{props.message}</p>
      </div>
    </>
  );
};

export default NoDataMsg;
