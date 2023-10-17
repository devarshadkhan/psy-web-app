import React, { useState } from "react";
import styles from "@/styles/professional/advertise/CreateAd.module.css";
import { useRouter } from "next/router";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import classNames from "classnames";
import AddSidebar from "@/components/addSidebar/AddSidebar";

const CreateAd = () => {
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
      <div className={styles.bodyContainer + " mt-1"}>
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
              <div className={styles.mainContainerHeading}>
                <h3>Featured Psychic - Ad Placement</h3>
                <AiOutlineExclamationCircle
                  className={classNames(styles.tbtitleIcon)}
                />
                <form className={styles.formContainer}>
                  <div className="mb-4">
                    <label className={styles.formLabel}>Category</label>
                    <select
                      className={"form-select " + styles.formInput}
                      aria-label="Default select example"
                    >
                      <option selected>Reading</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className={styles.formLabel}>Type</label>
                    <select
                      className={"form-select " + styles.formInput}
                      aria-label="Default select example"
                    >
                      <option selected>Career</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div>

                  <div>
                    <label
                      for="exampleFormControlInput1"
                      className={styles.formLabel}
                    >
                      Your Bid &nbsp; &nbsp;
                      <span>[Bid Average: $15.94/click]</span>
                    </label>
                    <input
                      type="text"
                      className={"form-control " + styles.formInput}
                      id="exampleFormControlInput1"
                    />
                  </div>
                </form>

                <button className={styles.nextBtn}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateAd;
