import React from "react";
import styles from "@/styles/professional/dashboard/ConnectAccount.module.css";
import { useRouter } from "next/router";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import { connectBankData } from "@/mockdata/accountmock";

const ConnectAccount = () => {
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
          title={"Connect Your Bank Account"}
        />
        <div className={styles.acountscontainer}>
          {connectBankData.map((item) => {
            return (
              <div key={item.id} className={styles.cardContainer}>
                <div className={styles.topContainer}>
                  <img src={item.logo} alt="companyLogo" />
                </div>
                <div className={styles.middleContainer}>{item.label}</div>
                <div role="button" className={styles.buttomContainer}>
                  Connect
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.footerContainer}>
          <div className={styles.footerWrapper}>
            <div className={styles.footercontent}>
              <div className={styles.footerHeader}>Don’t see your bank?</div>
              <div className={styles.footerbody}>
                If you don’t see your bank listed above, please click the button
                below to browse our entire integration list.
              </div>
              <div role="button" className={styles.footerbtn}>
                View integrated banks
              </div>
            </div>
            <img
              src={"/images/StoneImage.svg"}
              alt="stoneimage"
              className={styles.footerImage}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConnectAccount;
