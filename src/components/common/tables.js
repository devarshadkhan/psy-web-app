import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import styles from "@/styles/components/common/Tables.module.css";
import classNames from "classnames";
import { walletDetailsFetch } from "@/store/common/walletDatafetch";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import NoDataMsg from "../noDataMsg/NoDataMsg";

const TableComponent = ({ bodydata, isPayoutHistory, isHistory }) => {
  const route = useRouter();

  const [data, setData] = useState([]);

  const getHisoryDetails = () => {
    axiosInstance
      .get(API.walletPayoutDetails)
      .then((res) => {
        setData(res?.Payments);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (route?.asPath?.includes("payouthistory")) {
      getHisoryDetails();
    } else {
      setData(bodydata?.Payments);
    }
  }, []);

  const getFormatedDate = (date) => {
    const today = new Date(date);

    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };

    const formattedTime = today.toLocaleString("en-US", options);
    const formattedDate = `${today.getDate()} ${today.toLocaleString(
      "default",
      { month: "long" }
    )}, ${today.getFullYear()}`;

    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <>
      {data?.length ? (
        <Table responsive="xl">
          <thead className={styles.tableHeaderContainer}>
            <tr className={styles.headerTableRow}>
              <th className={styles.headerTableData + " " + styles.checkHeader}>
                {/* <input
              className={classNames(styles.customCheck, "form-check-input")}
              type="checkbox"
              value=""
              id="flexCheckChecked"
            /> */}
              </th>
              <th className={styles.headerTableData + " " + styles.idHeader}>
                {isPayoutHistory ? "Payout ID" : "Tx ID"}{" "}
                {/* <img src="/images/exchange.svg" alt="exchange" /> */}
              </th>
              {!isPayoutHistory && (
                <th className={styles.headerTableData}>
                  Business
                  {/* <img src="/images/exchange.svg" alt="exchange" /> */}
                </th>
              )}
              {!isPayoutHistory && (
                <th className={styles.headerTableData}>Type</th>
              )}
              <th className={styles.headerTableData}>
                Date
                {/* <img src="/images/exchange.svg" alt="exchange" /> */}
              </th>
              <th
                className={styles.headerTableData + " " + styles.amountheader}
              >
                Amount
                {/* <img src="/images/exchange.svg" alt="exchange" /> */}
              </th>
              {(isHistory || isPayoutHistory) && (
                <th
                  className={styles.headerTableData + " " + styles.statusHeader}
                >
                  Status{" "}
                </th>
              )}
              {(isHistory || isHistory) && (
                <th
                  className={styles.headerTableData + " " + styles.actionheader}
                >
                  Action{" "}
                </th>
              )}
            </tr>
          </thead>
          {data && data?.length > 0 && (
            <tbody className={styles.custombody}>
              {data?.map((item) => {
                return (
                  <tr className={styles.bodyTablerow}>
                    <td className={styles.bodyTableData}>
                      {/* <input
                  className={classNames(styles.customCheck, "form-check-input")}
                  type="checkbox"
                  value=""
                  id="flexCheckChecked"
                /> */}
                    </td>
                    <td className={styles.bodyTableData}>{item._id}</td>
                    {!isPayoutHistory && (
                      <td className={styles.bodyTableData}>
                        <div className={styles.nameContainer}>
                          {/* <div className={styles.buisnessLogoContainer}>
                      <img
                        src={item.buisnessLogo}
                        className={styles.buisnessLogo}
                        alt={item.buisnessname}
                      />
                    </div> */}
                          <div className={styles.buisnessNameWrapper}>
                            {/* <span className={styles.buisnessName}>
                        {item?.sender_id?.first_name}
                        {" "}
                        {item?.sender_id?.last_name}
                      </span>
                      <span className={styles.buisnessType}>
                        {item.buisnessType}
                      </span> */}
                            <span className={styles.buisnessName}>
                              {item?.type === "subscription"
                                ? "Profesy +"
                                : item?.type === "payout"
                                ? "Payout"
                                : "Appointment with"}
                            </span>
                            <span className={styles.buisnessType}>
                              {item?.sender_id?.nickName
                                ? item?.sender_id?.nickName
                                : `${item?.sender_id?.first_name} ${item?.sender_id?.last_name}`}
                            </span>
                          </div>
                        </div>
                      </td>
                    )}
                    {!isPayoutHistory && (
                      <td className={styles.bodyTableData}>
                        <div className={styles.transactionType}>
                          {item?.type?.charAt(0)?.toUpperCase() +
                            item?.type?.slice(1) || "Payment"}
                        </div>
                      </td>
                    )}
                    <td className={styles.bodyTableData}>
                      <div className={styles.buisnessNameWrapper}>
                        <span className={styles.buisnessName}>
                          {getFormatedDate(item.updatedAt)}
                        </span>
                        {/* <span className={styles.buisnessType}>{transactionTime}</span> */}
                      </div>
                    </td>
                    <td
                      className={classNames(
                        styles.bodyTableData,
                        item?.type === "subscription" || item?.type === "payout"
                          ? styles.paymentDeducted
                          : styles.paymentReceived,
                        isPayoutHistory ? "w-60" : ""
                      )}
                    >
                      ${item?.amount || item?.base_amount}
                    </td>
                    {(isHistory || isPayoutHistory) && (
                      <td className={styles.bodyTableData}>
                        <div className={styles.statusWrapper}>Success</div>
                      </td>
                    )}
                    {isHistory && (
                      <td className={styles.bodyTableData}>
                        <span className={styles.actionContainer}>
                          <img src="/images/eye.svg" alt="eye" />
                        </span>
                        <span className={styles.actionContainer}>
                          <img src="/images/trash.svg" alt="eye" />
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          )}
        </Table>
      ) : (
        <>
          <div className="">
            <NoDataMsg
              message="No transactions found"
              img="/images/transactions.png"
            />
          </div>
        </>
      )}
      {/* {data && data?.length <= 0 && (
        <span className={styles.cardContainer}>
          <div
            className={
              "NoDataFound d-flex align-items-center justify-content-center"
            }
          >
            No Availabe Data
          </div>{" "}
        </span>
      )} */}
    </>
  );
};

export default TableComponent;
