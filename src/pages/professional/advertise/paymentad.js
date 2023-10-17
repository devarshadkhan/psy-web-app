import React, { useState } from "react";
import styles from "@/styles/professional/advertise/Payment.module.css";
import { useRouter } from "next/router";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import "react-datepicker/dist/react-datepicker.css";
import AddSidebar from "@/components/addSidebar/AddSidebar";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import classNames from "classnames";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { Modal } from "react-bootstrap";

const PaymentAd = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [yourImage, setImage] = useState([]);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setImage(
        acceptedFiles.map((upFile) =>
          Object.assign(upFile, {
            preview: URL.createObjectURL(upFile),
          })
        )
      );
    },
  });

  const route = useRouter();
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

  const [show, setShow] = useState(false);
  const handleClose = (e) => {
    // e.preventDefault();
    setShow(false);
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
          title={"Wallet"}
          isHideTab={true}
          btn1={"Create an advertisement"}
          btn2={"Manage advertisements"}
        />

        <div className={styles.Container}>
          <div className={styles.containerHeading}>
            <h2>Create an advertisement</h2>
          </div>
          <div className={"d-flex " + styles.pageContainer}>
            <div className={styles.sidebarContainer}>
              <AddSidebar />
            </div>
            <div className={styles.mainContainer}>
              {/* <div>
                                <div className={styles.mainContainerHeading}>
                                    <h3>Choose ad type</h3>
                                </div>
                                <p>Pick an advertising type below:</p>

                                <div className={"d-flex gap-3 my-3 " + styles.midContainers}>
                                    <div>
                                        <h6>Featured Psychic Ad</h6>
                                        <p>We will feature you on our category pages via the Psychix Marketplace.</p>
                                    </div>
                                    <div>
                                        <h6>Blog Ads</h6>
                                        <p>We will feature your ad on our blog pages.</p>
                                    </div>
                                </div>

                                <div className={styles.bottomContainer}>
                                    <h6>Profesy Network Ads</h6>
                                    <p>We will feature you across our growing network of websites, tools and other material.</p>
                                </div>

                                <button className={styles.nextBtn}>Next</button>
                            </div> */}

              <div>
                <div className={"" + styles.paymentWrapper}>
                  {/* <div
                className={
                  "col-lg-6 col-md-12 col-sm-12 " + 
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

                  <div
                    className={`${styles.btnContainer} d-flex flex-column gap-3`}
                  >
                    <select
                      className={
                        "form-select form-select-md mb-3 " + styles.selectBox
                      }
                      aria-label=".form-select-lg example"
                    >
                      <option selected>x8888 (Visa)</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>

                    <button
                      className={styles.diffCard}
                      onClick={() => setShow(true)}
                    >
                      Add a Different Card
                    </button>
                    {/* <Link href="/professional/settingspayment/subscribeconfirm" className={styles.payBtn}>Confirm and Pay</Link> */}
                    <Link href="" className={styles.payBtn}>
                      Confirm and Pay
                    </Link>
                  </div>
                 
                </div>
              </div>
              <div className={styles.btndiv}>
              <Link
                    href="/professional/advertise/paymentconfirm"
                    className={styles.nextBtn}
                  >
                    Next
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
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
              <div>
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
              <div>
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
    </main>
  );
};

export default PaymentAd;