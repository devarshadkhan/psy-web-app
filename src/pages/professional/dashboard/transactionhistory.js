import React, { useState } from "react";
import styles from "@/styles/professional/dashboard/TransactionHistory.module.css";
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
const TransactionHistory = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
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
        />
        <div className={styles.dataTableContainer}>
          <div className={styles.optionContainer}>
            <div className={styles.optionsWrapper}>
              <div className={styles.searchInputWrapper}>
                <FiSearch className={styles.navSearchIcon} />
                <input
                  className={styles.searchInput}
                  placeholder="Search messages & appointments"
                />
              </div>
              <span className={styles.rightSectionContainer}>
                <div
                  className={
                    styles.searchInputWrapper + " " + styles.filterContainer
                  }
                >
                  <Filter />
                  <span className={styles.labelStyle}>Filter</span>
                </div>
                <div
                  className={
                    styles.searchInputWrapper + " " + styles.exportContainer
                  }
                >
                  <Export />
                  <span className={styles.labelStyle}>Export</span>
                </div>
              </span>
            </div>
            <div className={styles.filterOptions}>
              <span className={styles.dropWrapper}>
                <div className={styles.filterWraapper}>
                  <select
                    className={classNames(styles.customSelect, "form-select")}
                    aria-label="Default select example"
                  >
                    <option selected>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
                <div className={styles.filterWraapper}>
                  <select
                    className={classNames(styles.customSelect, "form-select")}
                    aria-label="Default select example"
                  >
                    <option selected>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
              </span>
              <span className={styles.dropWrapper}>
                <div
                  className={classNames(
                    styles.filterWraapper,
                    "position-relative"
                  )}
                >
                  <ReactDatePicker
                    selected={startDate}
                    onChange={onChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    popperClassName="custom-calenderPopper-transatction"
                    calendarClassName="custom-professionalDatePicker-history"
                    wrapperClassName={styles.customWrapperClass}
                    customInput={
                      <div
                        className={styles.CustomDatePickerInput}
                        onClick={() => {}}
                      >
                        <span className={styles.CustomDatePickerInputText}>
                          {startDate.toLocaleDateString()}{" "}
                          {endDate && <>-{endDate.toLocaleDateString()}</>}
                        </span>
                        <img
                          src="/images/calendar-dark.svg"
                          className={styles.CustomDatePickerInputIcon}
                          alt="Calendar"
                        />
                      </div>
                    }
                  />
                </div>
                <div className={styles.filterWraapper}>
                  <select
                    className={classNames(styles.customSelect, "form-select")}
                    aria-label="Default select example"
                  >
                    <option selected>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
              </span>
            </div>
          </div>
          <TableComponent isHistory={true} bodydata={walletMock} />
          <hr className={styles.divider} />
          <div className={styles.footerContainer}>
            <Pagination className={styles.custompagination}>
              <Pagination.Item
                className={classNames(
                  styles.paginationData,
                  styles.paginationprev
                )}
              >
                <MdArrowBackIosNew />
              </Pagination.Item>
              <Pagination.Item className={styles.paginationData}>
                {1}
              </Pagination.Item>
              <Pagination.Item className={styles.paginationData}>
                {2}
              </Pagination.Item>
              <Pagination.Item className={styles.paginationData}>
                {3}
              </Pagination.Item>
              <Pagination.Ellipsis className={styles.paginationData} />
              <Pagination.Item className={styles.paginationData}>
                {99}
              </Pagination.Item>
              <Pagination.Item
                className={classNames(
                  styles.paginationData,
                  styles.paginationnext
                )}
              >
                <MdArrowForwardIos />
              </Pagination.Item>
            </Pagination>
            <div className={styles.footerLeftContainer}>
              <div className={styles.limitText}>Showing 6 of 50 entries</div>
              <div className={styles.limitSelectorContainer}>
                <select
                  className={classNames(styles.limitSelector, "form-select")}
                  aria-label="Default select example"
                >
                  <option value="5" selected>
                    Show 5
                  </option>
                  <option value="10">Show 10</option>
                  <option value="25">Show 25</option>
                  <option value="50">Show 50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TransactionHistory;
