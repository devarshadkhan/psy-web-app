import React, { useEffect, useState } from "react";
import styles from "@/styles/components/paymentHistory/paymenthistory.module.css";
import {
  BsCaretDownFill,
  BsCaretUpFill,
  BsFillCheckCircleFill,
} from "react-icons/bs";
import classNames from "classnames";
import { convertTolocalTime } from "@/utils/common";
import { walletDetailsFetch } from "@/store/common/walletDatafetch";
import { useDispatch } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { AiOutlineInfoCircle } from "react-icons/ai";

const PaymentHistory = ({ walletDetails }) => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (walletDetails) {
      setPaymentHistory([...walletDetails?.Payments]);
    }
  }, [walletDetails]);

  const filterByType = (type) => {
    setLoader(true);
    dispatch(walletDetailsFetch(type))
      .then((res) => {
        setLoader(false);
        if (!res?.error) {
          setPaymentHistory(res?.payload?.Payments);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {paymentHistory?.length > 0 ? (
        <>
          <div className={styles.payment_history}>
            <div className={classNames(styles.cntr_main, "container-fluid")}>
              <div className="row">
                <div className="col-md-12">
                  <h2>Payment History</h2>

                  <div className={styles.payment_history_table}>
                    <div className="table-responsive">
                      <table class="table">
                        {paymentHistory?.length > 0 ? (
                          <>
                            {loader ? (
                              <>
                                <div className="d-flex justify-content-center">
                                  <span
                                    className="spinner-border me-2 spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                </div>
                              </>
                            ) : (
                              <>
                                <thead className={styles.thead}>
                                  <tr className={styles.thead}>
                                    {/* <th scope="col"></th> */}
                                    <th scope="col" className={styles.heading}>
                                      Invoice #.
                                    </th>
                                    <th scope="col">
                                      <div className={styles.sorting_icons}>
                                        Type
                                        {/* <div
                              onClick={() => filterByType("name")}
                              className={
                                "d-flex flex-column " + styles.filterBtn
                              }
                            >
                              <BsCaretUpFill /> <BsCaretDownFill />
                            </div> */}
                                      </div>
                                    </th>
                                    <th scope="col">
                                      <div className={styles.sorting_icons}>
                                        Amount
                                        <div
                                          onClick={() => filterByType("amount")}
                                          className={
                                            "d-flex flex-column " +
                                            styles.filterBtn
                                          }
                                        >
                                          <BsCaretUpFill /> <BsCaretDownFill />
                                        </div>
                                      </div>
                                    </th>
                                    <th scope="col">
                                      <div className={styles.sorting_icons}>
                                        Status
                                      </div>
                                    </th>
                                    <th scope="col">
                                      <div className={styles.sorting_icons}>
                                        Date
                                        <div
                                          onClick={() => filterByType("date")}
                                          className={
                                            "d-flex flex-column " +
                                            styles.filterBtn
                                          }
                                        >
                                          <BsCaretUpFill /> <BsCaretDownFill />
                                        </div>
                                      </div>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className={styles.tbody}>
                                  {paymentHistory?.map((ele) => {
                                    return (
                                      <tr>
                                        <td
                                          scope="row"
                                          className={styles.blackfont}
                                        >
                                          {ele?._id?.slice(-6).toUpperCase()}
                                        </td>
                                        <td className={styles.blackfont}>
                                          {ele?.type === "rollback"
                                            ? "Refunded"
                                            : ele?.reciever_id
                                            ? "Appointment with " +
                                              ele?.reciever_id?.nickName
                                            : ele?.type === "addMoney"
                                            ? "Money added to wallet"
                                            : "Wallet Transaction"}
                                        </td>
                                        <td
                                          className={classNames(
                                            ele?.type === "rollback" &&
                                              styles.greenfont,
                                            ele?.reciever_id &&
                                              !(ele?.type === "rollback") &&
                                              styles.paymentDeduction,
                                            styles.greenfont
                                          )}
                                        >
                                          $ {ele?.actual_amount}
                                          <OverlayTrigger
                                            key="top"
                                            placement="top"
                                            overlay={
                                              <Tooltip
                                                id="tooltip-disabled"
                                                className={
                                                  styles.ToolTipMakeCSS
                                                }
                                              >
                                                <div
                                                  className={
                                                    styles.ToolTipMakeCSS
                                                  }
                                                >
                                                  {ele.type === "payment" ? (
                                                    <>
                                                      <p>
                                                        Base amount: $
                                                        {ele?.base_amount}
                                                      </p>
                                                      <p>
                                                        Processing amount: $
                                                        {ele?.processing_amount}
                                                      </p>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <p>
                                                        Processing amount: $
                                                        {ele?.processing_amount}
                                                      </p>
                                                    </>
                                                  )}
                                                </div>
                                              </Tooltip>
                                            }
                                          >
                                            <span>
                                              {" "}
                                              <AiOutlineInfoCircle
                                                className={styles.EyeText}
                                              />
                                            </span>
                                          </OverlayTrigger>
                                          {/* <span className={styles.EyeText}>i</span> */}
                                        </td>
                                        <td>
                                          <p className={styles.confirm}>
                                            <BsFillCheckCircleFill />{" "}
                                            {ele?.status === 1
                                              ? "Confirmed"
                                              : "Pending"}
                                          </p>
                                        </td>
                                        <td className={styles.date}>
                                          {convertTolocalTime(
                                            ele?.updatedAt,
                                            "HH:mm AM/PM, MM/DD/YY"
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <div className={styles.nodata}>
                              <div>
                                <img
                                  src="/images/transactions.png"
                                  alt=""
                                  width={"10%"}
                                />
                              </div>
                              No transactions found
                            </div>
                          </>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default PaymentHistory;
