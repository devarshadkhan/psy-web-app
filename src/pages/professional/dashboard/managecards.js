import React, { useState, useRef } from "react";
import styles from "@/styles/professional/dashboard/ManageCards.module.css";
import { useRouter } from "next/router";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import PaymentCard from "@/components/common/paymentcard";
import classNames from "classnames";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Modal } from "react-bootstrap"
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";


const ManageCards = () => {
  const [expDate, setExpDate] = useState(new Date());
  const route = useRouter();

  const [show, setShow] = useState(false); 
  const handleClose = (e) => {
    e.preventDefault();
    setShow(false)
  }


  const tabsData = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "appointments",
      label: "Appointments",
    },
    {
      id: "wallet",
      label: "Wallet",
    },
  ];
  const handleSelectTab = (value) => {
    if (value !== "overview") {
      route.push(`/professional/dashboard/${value}`);
    } else {
      route.push(`/professional/dashboard/`);
    }
  };
  return (
    <main>
      <div className={"container-fluid p-0 professionalNav"}>
        <ProfessionalNavbar image="/images/avatar.png" />
      </div>
      <div className={styles.bodyContainer}>
        <ProfessionalTopSection
          tabsData={tabsData}
          handleSelectTab={handleSelectTab}
          activeTab={"wallet"}
          title={"Manage Personal Cards"}
        />
        <div role="button" onClick={() => setShow(true)} className={styles.addANewAccountButton}>
          Add new bank account
        </div>
        <div className={styles.cardscontainer}>
          <div className={styles.profesyContainer}>
            <div className={styles.tbtitleContainer}>
              <p className={classNames("mb-0", styles.tbtitle)}>
                Your Profesy Card
              </p>
              <AiOutlineExclamationCircle
                className={classNames(styles.tbtitleIcon)}
              />
            </div>

            <PaymentCard
              bgtype="bgtype3"
              cardName="Tina Williams"
              cardNumber="****  ***** **** 3456"
              expDate="11/26"
              cardType="visa"
            />
            <div className={styles.manageProfesy}>Update Card</div>
            <div className={styles.manageProfesy + " " + styles.secondarybtn}>
              Remove Card
            </div>
            <div className={"form-check form-switch"}>
              <input
                className={"form-check-input " + styles.toggleBtn}
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
              <label
                className={"form-check-label " + styles.checkboxLabel}
                htmlFor="flexSwitchCheckDefault"
              >
                Earnings
              </label>
            </div>
          </div>
          <div className={styles.profesyContainer}>
            <div className={styles.tbtitleContainer}>
              <p className={classNames("mb-0", styles.tbtitle)}>
                Your Profesy Card
              </p>
              <AiOutlineExclamationCircle
                className={classNames(styles.tbtitleIcon)}
              />
            </div>

            <PaymentCard
              bgtype="bgtype3"
              cardName="Tina Williams"
              cardNumber="****  ***** **** 3456"
              expDate="11/26"
              cardType="visa"
            />
            <div className={styles.manageProfesy}>Update Card</div>
            <div className={styles.manageProfesy + " " + styles.secondarybtn}>
              Remove Card
            </div>
            <div className={"form-check form-switch"}>
              <input
                className={"form-check-input " + styles.toggleBtn}
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
              <label
                className={"form-check-label " + styles.checkboxLabel}
                htmlFor="flexSwitchCheckDefault"
              >
                Earnings
              </label>
            </div>
          </div>
          <div className={styles.profesyContainer}>
            <div className={styles.tbtitleContainer}>
              <p className={classNames("mb-0", styles.tbtitle)}>
                Your Profesy Card
              </p>
              <AiOutlineExclamationCircle
                className={classNames(styles.tbtitleIcon)}
              />
            </div>

            <PaymentCard
              bgtype="bgtype3"
              cardName="Tina Williams"
              cardNumber="****  ***** **** 3456"
              expDate="11/26"
              cardType="visa"
            />
            <div className={styles.manageProfesy}>Update Card</div>
            <div className={styles.manageProfesy + " " + styles.secondarybtn}>
              Remove Card
            </div>
            <div className={"form-check form-switch"}>
              <input
                className={"form-check-input " + styles.toggleBtn}
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
              <label
                className={"form-check-label " + styles.checkboxLabel}
                htmlFor="flexSwitchCheckDefault"
              >
                Earnings
              </label>
            </div>
          </div>
        </div>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop='static'
          className="newcard"
          keyboard={false}
        >
          <div className={styles.newCardPopup}>
            <button onClick={handleClose} className={styles.closeBtn}>X</button>
            <div className={styles.cardContainer}>
              <div className={styles.cardHeader}>
                <h3>Add New Card</h3>
                <p>Fill out the details below to add a new card.</p>

                <PaymentCard
                  bgtype="bgtype3"
                  cardName="Tina Williams"
                  cardNumber="****  ***** **** 3456"
                  expDate="11/26"
                  cardType="visa"
                  className={styles.cardOpacity}
                />
              </div>

              <form className="mt-4">
                <div className="mb-4">
                  <label for="FormControlInput1" className={"form-label " + styles.formlabel}>Card Holder Name</label>
                  <input type="text" className={"form-control " + styles.formInput} id="FormControlInput1" />
                </div>

                <div className="mb-4">
                  <label for="FormControlInput1" className={"form-label " + styles.formlabel}>Card Holder Name</label>
                  <input type="text" className={"form-control " + styles.formInput} id="FormControlInput1" />
                </div>

                <div className={`${styles.fieldContainer} d-flex gap-4`}>
                  <div className="mb-4">
                    <label for="FormControlInput1" className={"form-label " + styles.formlabel}>Expiration Date</label>
                    <div className={styles.formDate}>
                      <ReactDatePicker
                        selected={expDate}
                        onChange={(e) => setExpDate(e)}
                        dateFormat="MM/yy"
                        showMonthYearPicker
                        customInput={
                          <div className={styles.calendarIcon}><img src="/images/calendar-dark.svg" /></div>
                        }
                      />
                      {moment(expDate).format("MM/YY")}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label for="FormControlInput1" className={"form-label " + styles.formlabel}>CVC/CVV</label>
                    <input type="text" className={"form-control " + styles.formInput} id="FormControlInput1" />
                  </div>
                </div>

                <button className={styles.addBtn}>Add card</button>
              </form>
            </div>
          </div>

        </Modal>
      </div>
    </main>
  );
};

export default ManageCards;
