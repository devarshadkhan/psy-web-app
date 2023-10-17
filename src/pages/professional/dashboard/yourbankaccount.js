import React, { useState } from "react";
import styles from "@/styles/professional/dashboard/YourBankAccount.module.css";
import { useRouter } from "next/router";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import classNames from "classnames";
const YourBankAccount = () => {
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
          title={"Your Bank Accounts"}
        />
        <div role="button" className={styles.addANewAccountButton}>
          Add new bank account
        </div>

        <div className={styles.mainBodyContainer}>
          <div className={classNames(styles.cardContainer)}>
            <div className={classNames(styles.topSection)}>
              Wells Fargo Business Account
              <img src="/images/Edit.svg" alt="Edit" />
            </div>
            <div className={classNames(styles.midSection)}>
              <img src="/images/companyLogo.svg" alt="companyLogo" />
            </div>
            <div className={classNames(styles.bottomSection)}>
              <div className={classNames(styles.rmvBtn)}>
                Remove Bank Account
              </div>
            </div>
          </div>
          <div className={classNames(styles.cardContainer)}>
            <div className={classNames(styles.topSection)}>
              BofA Personal
              <img src="/images/Edit.svg" alt="Edit" />
            </div>
            <div className={classNames(styles.midSection)}>
              <img src="/images/companyLogo2.svg" alt="companyLogo" />
            </div>
            <div className={classNames(styles.bottomSection)}>
              <div className={classNames(styles.rmvBtn)}>
                Remove Bank Account
              </div>
            </div>
          </div>
          <div className={classNames(styles.cardContainer)}>
            <div className={classNames(styles.topSection)}>
              Fidelity Personal
              <img src="/images/Edit.svg" alt="Edit" />
            </div>
            <div className={classNames(styles.midSection)}>
              <img src="/images/companyLogo3.svg" alt="companyLogo" />
            </div>
            <div className={classNames(styles.bottomSection)}>
              <div className={classNames(styles.rmvBtn)}>
                Remove Bank Account
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default YourBankAccount;
