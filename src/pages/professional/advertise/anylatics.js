import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/professional/advertise/anylatics.module.css";
import { useRouter } from "next/router";
import Head from "next/head";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { barChart2Option, doghnutChart } from "@/utils/chartoptions";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Adspends from "@/components/icons/Adspends";
import { TbEye } from "react-icons/tb";
import classNames from "classnames";

const analtyicsDataValues = [
  {
    Icons: HiOutlineCurrencyDollar,
    Name: "Earnings",
    amount: "$2,245.00",
    difference: -0.5,
  },
  {
    Icons: AiOutlineShoppingCart,
    Name: "Conversions",
    amount: "1,256",
    difference: 1.5,
  },
  {
    Icons: Adspends,
    Name: "Ad Spend",
    amount: "$431.00",
    difference: -0.5,
  },
  {
    Icons: TbEye,
    Name: "Impressions",
    amount: "4,235",
    difference: -0.5,
  },
];

const Anyatics = () => {
  const route = useRouter();
  const chartRef = useRef(null);
  const [pieLabels, setPieLabels] = useState([]);

  useEffect(() => {
    chartRef.current.getEchartsInstance().resize();
  }, []);
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
      route.push(`/professional/advertise/${value}`);
    } else {
      route.push(`/professional/advertise/`);
    }
  };
  useEffect(() => {
    const chart = chartRef.current.getEchartsInstance();

    // Get sector name, value, and color
    const seriesData = chart.getOption().series[0].data;
    const sectorData = seriesData.map((item) => {
      return {
        name: item.name,
        value: item.value,
        color: item.color,
      };
    });

    setPieLabels(sectorData);
  }, []);
  return (
    <>
      {/* <Head>
        <title>Psychix | ProfessionlDashboard</title>
        <meta name="description" content="Psychix | Registration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <main className={styles.main}>
        <div className={"container-fluid p-0 professionalNav"}>
          <ProfessionalNavbar image="/images/avatar.png" />
        </div>
        <div className={styles.bodyContainer + " mt-1"}>
          <ProfessionalTopSection
            tabsData={tabsData}
            handleSelectTab={handleSelectTab}
            activeTab={"overview"}
            title={"Advertise"}
            isHideTab={true}
          />
          <div className={styles.Container}>
            {/* <div className={styles.containerHeading}>
                Create an advertisement
              </div> */}
            <div className={styles.advertiseContainer}>
              <div className={styles.advertiseleft}>
                <div className={styles.weeklyDataContainer}>
                  {analtyicsDataValues.map(
                    ({ Icons, Name, amount, difference }) => {
                      return (
                        <div className={styles.weeklyData}>
                          <div className={styles.headerSection}>
                            <Icons className={styles.headerIcon} />
                            <p className={styles.headertitle}>{Name}</p>
                          </div>
                          <hr />
                          <div className={styles.dataBodyContainer}>
                            <div className={styles.bodyLeftSection}>
                              <div className={styles.bodyAmount}>{amount}</div>
                              <div className={styles.anylatics}>
                                <span
                                  className={classNames(
                                    difference > 0
                                      ? styles.analyticsValueSuccess
                                      : styles.analyticsValueError
                                  )}
                                >
                                  {difference} %
                                </span>{" "}
                                from last week
                              </div>
                            </div>
                            <div className={styles.bodyRightSection}>
                              <ReactEcharts
                                autoResize={true}
                                style={{ height: "50px" }}
                                option={barChart2Option()}
                                echarts={echarts}
                                className="chart custom-chartClass"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
              <div className={styles.advertiseright}>
                <div className={styles.adOverViewContainer}>
                  <div className={styles.adOverViewTopSection}>
                    <div className={styles.adOverViewTitle}>Ad Overview</div>
                    <div className={styles.MonthSelectorContainer}>
                      <select
                        className={classNames(
                          styles.customSelect,
                          "form-select"
                        )}
                        aria-label="Default select example"
                      >
                        <option selected>month</option>
                        <option value="1">Jan</option>
                        <option value="2">Fab</option>
                        <option value="3">Mar</option>
                      </select>
                    </div>
                  </div>
                  <ReactEcharts
                    autoResize={true}
                    ref={chartRef}
                    option={doghnutChart()}
                    echarts={echarts}
                    className="chart custom-chartClass"
                  />
                  <div className={styles.dataContainer}>
                    {pieLabels.map((items) => {
                      return (
                        <div className={styles.data}>
                          <div
                            className={styles.symbol}
                            style={{ background: items.color }}
                          />
                          <div className={styles.dataname}>{items.name}</div>
                          <div className={styles.datavalue}>
                            {items.value} %
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Anyatics;
