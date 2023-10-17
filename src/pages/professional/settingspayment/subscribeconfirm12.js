import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import React from "react";
import styles from "@/styles/professional/settingspayment/SubscribeConfirm.module.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import PaymentProfile from "@/components/paymentProfile/PaymentProfile";
import SubscriptionDetail from "../../../components/subscriptionDetail/SubscriptionDetail";
import Link from "next/link";
const Subscribeprofesy = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const handleClose = (e) => {
    // e.preventDefault();
    setShow(false);
  };
  return (
    <>
      <ProfessionalNavbar />

      <div className={styles.wrapper_payment}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-sm-12 col-lg-12">
              <div className={styles.back_btn} onClick={() => router.back(-1)}>
                <AiOutlineArrowLeft /> <span>Back to Settings</span>
              </div>
            </div>

            <div
              className={"col-lg-6 col-sm-12 col-md-12" + styles.leftContainer}
            >
              {/* <div className={"d-flex " + styles.paymentWrapper}> */}
              <div className={" " + styles.paymentWrapper}>
                {/* <div
                  className={
                    "col-lg-6 col-md-12 col-sm-12 " + styles.leftContainer
                  }
                > */}
                <h1 className={styles.pageHeading}>Confirm and pay</h1>
                <hr className={styles.line} />

                <div className="d-flex flex-column gap-3">
                  <div
                    className={
                      "d-flex justify-content-between " + styles.paymentOption
                    }
                  >
                    <p>Pay with</p>
                    <div>
                      <span>Paypal</span>
                      <button>Credit Card</button>
                    </div>
                  </div>

                  <div
                    className={
                      "d-flex justify-content-between " + styles.creditCard
                    }
                  >
                    <p>Credit Card</p>
                    <div>
                      <span>
                        <img src="/images/visa.png" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`d-flex flex-column gap-3`}>
                  <form className={"col-sm-12 " + styles.formContainer}>
                    <div className="mb-4">
                      <label
                        for="FormControlInput1"
                        className={"form-label " + styles.formLabel}
                      >
                        CARD NUMBER
                      </label>
                      <input
                        type="number"
                        className={"form-control " + styles.formInp}
                        id="FormControlInput1"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        for="FormControlInput2"
                        className={"form-label " + styles.formLabel}
                      >
                        CARD HOLDER
                      </label>
                      <input
                        type="number"
                        className={"form-control " + styles.formInp}
                        id="FormControlInput2"
                      />
                    </div>
                    <div className={"mb-4 d-flex gap-3 " + styles.twoFields}>
                      <div className="w-100">
                        <label
                          for="FormControlInput3"
                          className={"form-label " + styles.formLabel}
                        >
                          EXPIRATION DATE
                        </label>
                        <input
                          type="number"
                          className={"form-control " + styles.formInp}
                          id="FormControlInput3"
                        />
                      </div>
                      <div className="w-100">
                        <label
                          for="FormControlInput4"
                          className={"form-label " + styles.formLabel}
                        >
                          CVC
                        </label>
                        <input
                          type="number"
                          className={"form-control " + styles.formInp}
                          id="FormControlInput4"
                        />
                      </div>
                    </div>
                    <div className={"form-check " + styles.checkboxField}>
                      <input
                        className={"form-check-input " + styles.checkbox}
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label
                        className="form-check-label"
                        for="flexCheckDefault"
                      >
                        Save Card
                      </label>
                    </div>

                    <Link href="/professional/subscribe/subscribe" className={`${styles.submitBtn}`}>
                      Confirm and Pay
                    </Link>
                  </form>
                </div>
              </div>
            </div>
            {/* </div> */}

            <div
              className={"col-lg-6 col-sm-12 col-md-12" + styles.leftContainer}
            >
              <SubscriptionDetail />
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}

      {/* modal Open  */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop={true}
        className={"paymentModal" + styles.paymentModal}
        keyboard={false}
      >
        <div className={styles.paymentCard}>
          <h2>Add New Card</h2>
          <form className={"col-sm-12 " + styles.formContainer}>
            <div className="mb-4">
              <label
                for="FormControlInput1"
                className={"form-label " + styles.formLabel}
              >
                CARD NUMBER
              </label>
              <input
                type="number"
                className={"form-control " + styles.formInp}
                id="FormControlInput1"
              />
            </div>
            <div className="mb-4">
              <label
                for="FormControlInput2"
                className={"form-label " + styles.formLabel}
              >
                CARD HOLDER
              </label>
              <input
                type="text"
                className={"form-control " + styles.formInp}
                id="FormControlInput2"
              />
            </div>
            <div className="mb-4 d-flex gap-3">
              <div className="w-100">
                <label
                  for="FormControlInput3"
                  className={"form-label " + styles.formLabel}
                >
                  EXPIRATION DATE
                </label>
                <input
                  type="number"
                  className={"form-control " + styles.formInp}
                  id="FormControlInput3"
                />
              </div>
              <div className="w-100">
                <label
                  for="FormControlInput4"
                  className={"form-label " + styles.formLabel}
                >
                  CVC
                </label>
                <input
                  type="number"
                  className={"form-control " + styles.formInp}
                  id="FormControlInput4"
                />
              </div>
            </div>
            <div className={"form-check " + styles.checkboxField}>
              <input
                className={"form-check-input " + styles.checkbox}
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label className="form-check-label" for="flexCheckDefault">
                Save Card
              </label>
            </div>

            <button
              className={`${styles.submitBtn} mt-4`}
              onClick={handleClose}
            >
              Continue
            </button>
          </form>
          <span className={styles.crossBtn} onClick={handleClose}>
            X
          </span>
        </div>
      </Modal>
    </>
  );
};

export default Subscribeprofesy;