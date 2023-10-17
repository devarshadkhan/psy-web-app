import React, { useEffect, useState } from "react";
import styles from "@/styles/professional/dashboard/PayoutHistory.module.css";
import { useRouter } from "next/router";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import TableComponent from "@/components/common/tables";
import { walletMock } from "@/mockdata/walletmock";
import { FiSearch } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";
import { Export } from "@/components/icons/Export";
import Filter from "@/components/icons/Filter";
import classNames from "classnames";
import ReactDatePicker from "react-datepicker";
import { Pagination } from "react-bootstrap";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { Modal } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import BankForm from "@/components/accountPayment";
import { walletDetailsFetch } from "@/store/common/walletDatafetch";
import { useDispatch } from "react-redux";
import axiosInstance from "@/utils/axios";
import { ToastContainer, toast } from "react-toastify";
import { API } from "@/utils/apiendpoints";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const PayoutHistory = () => {
  const stripePromise = loadStripe(process.env.STRIPE_KEY);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [addBankAccount, setAddBankAccount] = useState();
  const [show, setShow] = useState(false);
  const [walletDetails, setWalletDetails] = useState(null);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState();
  const [stripeBalanceData, setStripeBalanceData] = useState(0);
  const [loader, setLoader] = useState(false);
  const [amountValidation, setAmountValidation] = useState(false);

  const handleClose = (e) => {
    e.preventDefault();
    setShow(false);
  };

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
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

  const getWalletDetails = () => {
    dispatch(walletDetailsFetch())
      .then((res) => {
        !res?.error && setWalletDetails({ ...res?.payload });
        getStripeBalanceDetails({ ...res?.payload });
      })
      .catch((err) => console.log(err));
  };

  const getStripeBalanceDetails = (walletData) => {
    axiosInstance
      .get(API.walletRetrieveBalance)
      .then((res) => {
        if (res?.balance?.amount < walletData?.balance) {
          setWalletDetails({ ...walletData, balance: res?.balance.amount });
        }
        setStripeBalanceData({ ...res?.balance });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getWalletDetails();
  }, []);

  const handleChange = (e) => {
    if (e.target.value < 10) {
      setAmountValidation(true);
      setAmount(e.target.value);
    } else if (e.target.value > stripeBalanceData?.amount) {
      setAmount(stripeBalanceData?.amount);
      setAmountValidation(false);
    } else {
      setAmount(e.target.value);
      setAmountValidation(false);
    }
  };

  const handlePayout = (e) => {
    setLoader(true);
    e.preventDefault();
    axiosInstance
      .post(`${API.walletPayout}?amount=${amount}`)
      .then((res) => {
        setLoader(false);
        route.push("/professional/dashboard/wallet");
        toast.success(res?.message, {
          position: "top-right",
          autoClose: 100,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((err) => {
        setLoader(false);
        console.error(err);
      });
  };

  return (
    <main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className={"container-fluid p-0 professionalNav"}>
        <ProfessionalNavbar image="/images/avatar.png" />
      </div>
      <div className={styles.bodyContainer}>
        <ProfessionalTopSection
          tabsData={tabsData}
          handleSelectTab={handleSelectTab}
          activeTab={"wallet"}
          routedata={["Dashboard", "Wallet", "Payout"]}
          title={"Payout History"}
        />
        <div
          role="button"
          onClick={() => setShow(true)}
          className={styles.addANewAccountButton}
        >
          Initiate new payout
        </div>
        <div className={styles.dataTableContainer}>
          <TableComponent isPayoutHistory={true} bodydata={walletMock} />

          <hr className={styles.divider} />
        </div>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          className="payout"
          keyboard={false}
        >
          <div className={styles.newCardPopup}>
            <button onClick={handleClose} className={styles.closeBtn}>
              X
            </button>
            <div className={styles.cardContainer}>
              <div className={styles.cardHeader}>
                <h3>Initiate new payout</h3>
                <p>Send some or all of your balance to your bank account.</p>
                <div className="d-flex gap-1">
                  <h4>Balance:</h4>
                  <span className="d-flex">
                    <p className="mb-0 font-20px">
                      {" "}
                      ${walletDetails?.balance ? walletDetails?.balance : 0}
                    </p>
                    {walletDetails?.balance > stripeBalanceData?.amount && (
                      <OverlayTrigger
                        key="right"
                        placement="right"
                        overlay={
                          <Tooltip
                            id="tooltip-disabled"
                            className={styles.ToolTipMakeCSS}
                          >
                            <p className="font-nexabold mb-0 font-16px">
                              This will be available in 4-7 business working
                              days
                            </p>
                          </Tooltip>
                        }
                      >
                        <span className="info-icon-container">
                          {" "}
                          <AiOutlineInfoCircle className="info-icon" />
                        </span>
                      </OverlayTrigger>
                    )}
                  </span>
                </div>
                <div className={styles.payoutBalance}>
                  <p>
                    Available Payout Balance :{" "}
                    <span>
                      $
                      {stripeBalanceData?.amount
                        ? stripeBalanceData?.amount
                        : 0}
                    </span>
                  </p>
                </div>
              </div>

              <form className="mt-4">
                <div className="mb-4">
                  <label
                    for="FormControlInput1"
                    className={"form-label " + styles.formlabel}
                  >
                    Amount to send:
                  </label>
                  <div className={"input-group mb-3 "}>
                    <span
                      className={"input-group-text " + styles.spanText}
                      id="basic-addon1"
                    >
                      $
                    </span>
                    <input
                      style={{ borderLeft: "none" }}
                      type="number"
                      value={amount}
                      disabled={walletDetails?.balance === 0}
                      onChange={(e) => handleChange(e)}
                      className={"form-control " + styles.formInput}
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </div>
                  {amountValidation && (
                    <div
                      className={classNames(
                        amountValidation && "error-text",
                        "input-helper text-normal "
                      )}
                    >
                      Minimum amount Should be $10
                    </div>
                  )}
                </div>

                <button
                  disabled={walletDetails?.balance === 0}
                  onClick={(e) => amount && handlePayout(e)}
                  className={classNames(
                    walletDetails?.balance === 0 ? "button-diabled" : "",
                    styles.addBtn,
                    " mt-2"
                  )}
                >
                  {loader ? (
                    <>
                      <span
                        className={`spinner-border me-2 spinner-border-sm ${styles.SearchIcon}`}
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </>
                  ) : (
                    "Withdraw Amount"
                  )}
                </button>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
};

export default PayoutHistory;
