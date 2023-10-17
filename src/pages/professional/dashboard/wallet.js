import React, { useEffect, useState } from "react";
import styles from "@/styles/professional/dashboard/Wallet.module.css";
import { useRouter } from "next/router";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import {
  AiOutlineExclamationCircle,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import classNames from "classnames";
import { BsArrowUpRight } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import PaymentCard from "@/components/common/paymentcard";
import ChartComponent from "@/components/common/widgets/charts";
import { LineChartOptions } from "@/utils/chartoptions";
import { Table } from "react-bootstrap";
import TableComponent from "@/components/common/tables";
import { walletMock } from "@/mockdata/walletmock";
import { useDispatch } from "react-redux";
import { walletDetailsFetch } from "@/store/common/walletDatafetch";
import Head from "next/head";
import axiosInstance from "@/utils/axios";
import moment from "moment";
import { API } from "@/utils/apiendpoints";
import NoDataMsg from "@/components/noDataMsg/NoDataMsg";

const Wallet = () => {
  const route = useRouter();
  const [walletBalance, setWalletBalance] = useState(0);
  const dispatch = useDispatch();
  const [walletDetails, setWalletDetails] = useState(null);
  const [card, setcard] = useState();
  const [accountDetails, setAccountDetails] = useState(null);

  let isCalled = false;
  const [graphData, setGraphData] = useState({
    date: [],
    price: [],
  });
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

  const getWalletDetails = () => {
    dispatch(walletDetailsFetch())
      .then((res) => {
        if (!res?.error) {
          let currentData = graphData;

          res?.payload?.Payments?.forEach((item) => {
            currentData?.date?.push(
              moment(item.updatedAt).format("MM/DD/YYYY")
            );
            currentData.price?.push(item?.amount || item?.base_amount);
            setGraphData(currentData);
          });
          setWalletBalance(res?.payload?.balance);
          setWalletDetails(res?.payload);
          setcard(res?.payload);
        }
      })
      .catch((err) => console.log(err));
  };

  const getAccountDetails = () => {
    axiosInstance
      .get(API.walletRetrieveAccount)
      .then((res) => setAccountDetails(res?.data?.data[0]))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!isCalled) {
      isCalled = true;
      getWalletDetails();
    }
    getAccountDetails();
  }, []);

  const handleSelectTab = (value) => {
    if (value !== "overview") {
      route.push(`/professional/dashboard/${value}`);
    } else {
      route.push(`/professional/dashboard/`);
    }
  };

  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <main>
      <Head>
        <title>Wallet | Psychix</title>
        <meta name="description" content="Wallet | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={"container-fluid p-0 professionalNav"}>
        <ProfessionalNavbar image="/images/avatar.png" />
      </div>
      <div className={styles.bodyContainer}>
        <ProfessionalTopSection
          tabsData={tabsData}
          handleSelectTab={handleSelectTab}
          activeTab={"wallet"}
          routedata={["Dashboard", "Wallet"]}
          title={"Wallet"}
        />
        <div className={styles.walletContainer}>
          <div className={styles.paymentInfoContainer}>
            <div className={styles.tbContainer}>
              <div className={styles.tbTop}>
                <div className={styles.tbtitleContainer}>
                  <p className={classNames("mb-0", styles.tbtitle)}>
                    Total Balance
                  </p>
                  <AiOutlineExclamationCircle
                    className={classNames(styles.tbtitleIcon)}
                  />
                  <div className={classNames(styles.cardDetailsContainer)}>
                    <img
                      className={classNames(styles.cardDetailsImage)}
                      src={
                        accountDetails?.object === "bank_account"
                          ? "/images/bank-icon.png"
                          : accountDetails?.brand === "Visa"
                          ? "/images/Visa-icon.svg"
                          : "/images/mastercard.svg"
                      }
                      alt="mastercard"
                    />
                    <p className={classNames(styles.cardDetailsNumber)}>
                      **** {accountDetails?.last4}
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.tbValueContainer}>
                <p className={classNames("mb-0", styles.tbValue)}>
                  ${!isVisible ? <>{walletBalance || 0}</> : "******"}
                </p>
                <span className={classNames(styles.iconContaier)}>
                  {!isVisible ? (
                    <AiOutlineEye
                      className={styles.eyeIcon}
                      onClick={toggleVisibility}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      onClick={toggleVisibility}
                      className={styles.eyeIcon}
                    />
                  )}
                </span>
              </div>

              {/* <img src="/images/verticaltopeye.svg" alt="verticaltopeye" /> eye image  */}

              {/* <div className={styles.tbincrease}>
                <div className={classNames(styles.tbincereasepercent)}>
                  <BsArrowUpRight
                    className={classNames(styles.tbincereasepercenticon)}
                  />
                  <p
                    className={classNames(
                      "mb-0",
                      styles.tbincereasepercentvalue
                    )}
                  >
                    +3.1%
                  </p>
                </div>
                <p
                  className={classNames("mb-0", styles.tbincereasepercenttext)}
                >
                  Increase this Month
                </p>
              </div> */}
              <div className={styles.tbactions}>
                <div
                  onClick={() =>
                    route.push(`/professional/dashboard/payouthistory`)
                  }
                  className={styles.tbButton1 + " cursor-pointer"}
                >
                  <img src="/images/payout.svg" alt="payoutIcon" />
                  <span>Payouts</span>
                </div>
                <div className={styles.tbButton1 + " opacity-4"}>
                  <img src="/images/spending.svg" alt="spending" />
                  <span>Spending</span>
                </div>
              </div>
            </div>
            {/* <div className={styles.profesyContainer}>
              <div className={styles.tbtitleContainer}>
                <p className={classNames("mb-0", styles.tbtitle)}>
                  Your Profesy Card
                </p>
                <AiOutlineExclamationCircle
                  className={classNames(styles.tbtitleIcon)}
                />
              </div>

              <PaymentCard
                bgtype="bgtype1"
                cardName="Tina Williams"
                cardNumber="****  ***** **** 3456"
                provider="profesy"
                expDate="11/26"
                cardType="visa"
              />
              <div className={styles.manageProfesy}>Manage Profesy card</div>
            </div> */}

            <div className={styles.profesyContainer}>
              <div className={styles.tbtitleContainer}>
                <p className={classNames("mb-0", styles.tbtitle)}>
                  Your Personal Cards
                </p>
                <AiOutlineExclamationCircle
                  className={classNames(styles.tbtitleIcon)}
                />
              </div>
              <span className={styles.cardContainer}>
                <div className={styles.comingSoon}>Coming Soon</div>
                <div className={styles.cardsWrapper}>
                  {/* {card?.length === 0 ? ( */}
                  <>
                    {" "}
                    <PaymentCard
                      bgtype="bgtype2"
                      cardName="Your Name"
                      cardNumber="****  ***** **** XXXX"
                      expDate="XX/XX"
                      cardType="visa"
                    />
                  </>
                  {/* ) : (
                    <>
                      <p>You haven’t added a card yet</p>
                    </>
                  )} */}
                </div>
              </span>
              {/* <div className={styles.manageProfesy}>Add new card</div> */}
            </div>
          </div>
          <div className={styles.erningInfoContainer}>
            <div className={styles.chartWrapper}>
              {graphData?.price?.length > 0 && graphData?.date?.length > 0 ? (
                <>
                  <div className={styles.chartTopSection}>
                    <div className={styles.tbtitleContainerChart}>
                      <p className={classNames("mb-0", styles.tbtitle)}>
                        Your Transactions
                      </p>
                      <AiOutlineExclamationCircle
                        className={classNames(styles.tbtitleIcon)}
                      />
                    </div>
                    <div className={styles.chartChecksContainer}>
                      {/* <div className="form-check form-switch">
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
                  <div className="form-check form-switch">
                    <input
                      className={"form-check-input " + styles.toggleBtn}
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                    />
                    <label
                      className={"form-check-label " + styles.checkboxLabel}
                      htmlFor="flexSwitchCheckDefault"
                    >
                      Card Spending
                    </label>
                  </div> */}
                    </div>
                  </div>

                  <div>
                    <ChartComponent
                      option={LineChartOptions(
                        graphData?.price,
                        graphData?.date
                      )}
                    />
                  </div>
                </>
              ) : (
                <NoDataMsg
                  message="No transactions found"
                  img="/images/transactions.png"
                />
              )}
            </div>
            {walletDetails?.Payments?.length > 0 && (
              <div className={styles.dataTableContainer}>
                {/* {graphData?.price?.length > 0 && ( */}
                <TableComponent bodydata={walletDetails} />
                {/* )} */}
                {/* <div
                className={styles.manageProfesy + " " + styles.allTransactions}
              >
                View all transactions
              </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Wallet;
