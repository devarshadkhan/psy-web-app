import React from "react";
import styles from "@/styles/components/professional/ProfessionalTopSection.module.css";
import { BsChevronRight } from "react-icons/bs";
import classNames from "classnames";
import { Tab, Tabs } from "react-bootstrap";

const ProfessionalTopSection = ({
  title,
  activeTab,
  tabsData,
  handleSelectTab,
  btn1,
  routedata = [],
  isHideTab = false,
  btn2,
}) => {
  return (
    <>
      <div className={styles.HeaderContainer}>
        <div className={styles.sctionTitleContainer}>
          {title && <p className={styles.sectionTitle}>{title}</p>}
        </div>
        <div
          className={
            "d-flex justify-content-between " + styles.sectionContainer
          }
        >
          <div className={styles.currentLocationContainer}>
            {routedata?.map((item, index) => {
              return (
                <>
                  {index > 0 && (
                    <BsChevronRight
                      className={classNames(
                        styles.locationIcon,
                        styles.selectionLocationIcons
                      )}
                    />
                  )}
                  <p
                    className={classNames(
                      styles.locations,
                      styles.selectedLocation
                    )}
                  >
                    {item}
                  </p>
                </>
              );
            })}
          </div>
          {btn1 && btn2 && (
            <div className={styles.btnContainer}>
              <button className={`${styles.btn1} ${styles.btn}`}>{btn1}</button>
              <button className={`${styles.btn2} ${styles.btn}`}>{btn2}</button>
            </div>
          )}
        </div>
      </div>
      {!isHideTab && (
        <div>
          <Tabs
            onSelect={(value) => handleSelectTab(value)}
            activeKey={activeTab}
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className={classNames(styles.tabsContainer, "mb-3")}
          >
            {tabsData?.map((items) => {
              return (
                <Tab
                  tabClassName={classNames(
                    activeTab === items.id && styles.activeTab,
                    styles.tabs, items?.isDisabled && styles.tabDisable
                  )}
                  disabled={items?.isDisabled || false}
                  key={items.id}
                  eventKey={items.id}
                  title={items.label}
                ></Tab>
              );
            })}
          </Tabs>
        </div>
      )}
    </>
  );
};

export default ProfessionalTopSection;
