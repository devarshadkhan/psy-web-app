import React, { useState } from "react";
import styles from "@/styles/professional/advertise/ManageAdvertise.module.css";
import { useRouter } from "next/router";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import "react-datepicker/dist/react-datepicker.css";
import classNames from "classnames";
import Table from "react-bootstrap/Table";

const ManageAdvertisement = () => {
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
          activeTab={""}
          isHideTab={true}
          title={"Advertise"}
          btn1={"Create an advertisement"}
          btn2={"Manage advertisements"}
        />

        <div className={styles.Container}>
          <div className={styles.containerHeading}>
            <h2>Manage Advertisement</h2>
          </div>
          <div className={"d-flex " + styles.pageContainer}>
            <div className={styles.sidebarContainer}>
              {/* <AddSidebar /> */}

              <div className={styles.table_wrap}>
                <Table responsive>
                  <thead>
                    <tr>
                      <th className={styles.th_heading_name_one}>
                        <div className={styles.round}>
                          <input type="checkbox" id="checkbox1" />
                          <label for="checkbox1"></label>
                        </div>
                      </th>
                      <th className={styles.th_heading_name_sec}>
                        Add <img src="/images/exchange.svg" alt="exchange" />
                      </th>
                      <th className={styles.th_heading_name_thr}>
                        Bid <img src="/images/exchange.svg" alt="exchange" />
                      </th>
                      <th className={styles.th_heading_name_for}>
                        Performance{" "}
                        <img src="/images/exchange.svg" alt="exchange" />
                      </th>
                      <th className={styles.th_heading_name_five}>Active</th>
                      <th className={styles.th_heading_name_six}>Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.td_heading_name_one}>
                        <div className={styles.round}>
                          <input type="checkbox" id="checkbox" />
                          <label for="checkbox"></label>
                        </div>
                      </td>
                      <td className={styles.td_heading_name_sec}>
                        <p className={styles.highlight_name}>
                          Featured Ad <span>[“Reading” / “Love”]</span>
                        </p>
                        <p className={styles.Feature_id}>ID: 098134NN</p>
                      </td>
                      <td className={styles.bid}>$12.98</td>
                      <td>
                        <p className={styles.performance}>
                          Great <span>8.9% CR</span>
                        </p>
                        <div className={classNames("progress", "progress_pro")}>
                          <div
                            className={classNames(
                              "progress-bar",
                              "progress_bar"
                            )}
                            role="progressbar"
                            style={{ width: "50%" }}
                            aria-valuenow="25"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </td>
                      <td>
                        <label className={styles.switch}>
                          <input type="checkbox" />
                          <span
                            className={classNames(styles.slider, styles.round)}
                          ></span>
                        </label>
                      </td>
                      <td className={styles.manage_img}>
                        {/* <AiOutlineBarChart /> */}
                        <img src="/images/chart.svg" alt="exchange" />
                        <img src="/images/pencil.svg" alt="exchange" />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ManageAdvertisement;
