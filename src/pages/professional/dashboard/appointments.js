import Head from "next/head";
import styles from "@/styles/professional/dashboard/Appointment.module.css";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import "react-datepicker/dist/react-datepicker.css";
import classNames from "classnames";
import Professionaltopsection from "@/components/professional/professionaltopsection";
import { useRouter } from "next/router";
import ReactDatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import RightArrow from "@/components/icons/RightArrow";
import { ProgressBar } from "react-bootstrap";
import { AiOutlineClockCircle, AiOutlineHeart } from "react-icons/ai";
import CareerDrawer from "@/components/icons/CareerDrawer";
import Money from "@/components/icons/Money";
import { BarChartOption } from "@/utils/chartoptions";
import GaugeComponent from "@/components/common/widgets/gauge";
import ChartComponent from "@/components/common/widgets/charts";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import moment from "moment";
import { convertToCurrentTimeZone } from "@/utils/common";

function Apointments() {
  const [startDate, setStartDate] = useState(new Date());
  const route = useRouter();
  const [data, setData] = useState({
    day: [],
    value: [],
  });
  const [totalTime, setTotalTime] = useState(0);
  const [totalHour, setTotalHour] = useState(0);
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

  const [appointmentData, SetAppointmentData] = useState(null);
  const [totalEarning, setTotalEarning] = useState(0);
  const getDashboadData = async (id) => {
    if (startDate) {
      const dataValue = new Date(startDate);
      const appointmentUrl = `${
        API.appointmentManagement
      }/${id}?date=${convertToCurrentTimeZone(dataValue.toISOString())}`;

      await axiosInstance
        .get(appointmentUrl)
        .then((res) => {
          SetAppointmentData(res[0]);
          setTotalEarning(res[0].total_earnings);
          // console.log("wetdrfhgb",res[0].total_earnings)
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const getAppointmentOulookData = async (id) => {
    const dataValue = new Date(startDate);
    const appointmentUrl = `${
      API.appointmentManagement
    }/${id}?date=${convertToCurrentTimeZone(dataValue.toISOString())}`;
    axiosInstance
      .get(appointmentUrl)
      .then((res) => {
        res[0]?.hourCount[1].forEach((item) => {
          let currentValue = { ...data };
          let dt = moment(new Date(item.date), "YYYY-MM-DD HH:mm:ss");
          if (!currentValue.day.includes(dt.format("dd"))) {
            currentValue.day.push(dt.format("dd"));
            currentValue.value.push(item?.minute / 60);
            setTotalHour(Math.floor(item?.minute / 60));
            setTotalTime(item?.minute % 60);

            // setTotalHour(Math.floor((totalHour + item?.minute) / 60));
            // if (item?.minute > 60) {
            //   setTotalTime(
            //     Math.floor((totalHour + item?.minute) / 60) -
            //       (totalTime + item?.minute)
            //   );
            // } else {
            //   setTotalTime(totalTime + item?.minute);
            // }
          }
          setData(currentValue);
        });
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
    }
    if (startDate) {
      getDashboadData(item.id);
      getAppointmentOulookData(item.id);
    }
  }, [startDate]);

  const getDate = () => {
    const dataValue = new Date(startDate);
    return convertToCurrentTimeZone(dataValue.toISOString());
  };

  return (
    <>
      <Head>
        <title>Appointments | psychicx</title>
        <meta name="description" content="Appointments | psychicx" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={"container-fluid p-0 professionalNav"}>
          <ProfessionalNavbar image="/images/avatar.png" />
        </div>
        <div className={styles.bodyContainer}>
          <Professionaltopsection
            tabsData={tabsData}
            handleSelectTab={handleSelectTab}
            routedata={["Dashboard", "Appointments"]}
            activeTab={"appointments"}
            title={"Appointment Management"}
          />

          <div className={classNames(styles.appointmentmain)}>
            <div className={classNames(styles.dateCalanderContainer)}>
              <ReactDatePicker
                selected={startDate}
                popperClassName="custom-calenderPopper-dashboard"
                calendarClassName="custom-professionalDatePicker-dashboard"
                onChange={(date) => setStartDate(date)}
                customInput={
                  <button onClick={() => {}}>
                    {startDate.toLocaleDateString()}
                  </button>
                }
                inline
              />
            </div>
            <div className={classNames(styles.rightWrapper)}>
              <div className={classNames(styles.cardWrapper, "d-flex gap")}>
                <div className={"card " + styles.cardSize}>
                  <div className={"card-header " + styles.cardHeader}>
                    Appointment's History
                  </div>
                  <div className="card-body text-center w-100 p-0 mt-3">
                    <h5 className={"card-title " + styles.cardContent}>
                      {appointmentData?.completed_appointment_count || 0}
                    </h5>
                    <Link
                      href={`/professional/dashboard/appointmentcompleted?date=${getDate()}`}
                      className={"btn btn-primary py-2 " + styles.cardBtn}
                    >
                      View all &nbsp; &nbsp; <RightArrow />
                    </Link>
                  </div>
                </div>
                <div className={"card " + styles.cardSize}>
                  <div className={"card-header " + styles.cardHeader}>
                    Pending Appointments
                  </div>
                  <div className="card-body text-center w-100 p-0 mt-3">
                    <h5 className={"card-title " + styles.cardContent}>
                      {appointmentData?.pending_appointment_count || 0}
                    </h5>
                    <Link
                      href={`/professional/dashboard/appointmentpending?date=${getDate()}`}
                      className={"btn btn-primary py-2 " + styles.cardBtn}
                    >
                      View all &nbsp; &nbsp; <RightArrow />
                    </Link>
                  </div>
                </div>
                <div className={"card " + styles.cardSize}>
                  <div className={"card-header " + styles.cardHeader}>
                    Total Earnings
                  </div>
                  <div className="card-body text-center w-100 p-0 mt-3">
                    <h5 className={"card-title " + styles.cardContent}>
                      {totalEarning}
                    </h5>

                    <Link
                      href="/professional/dashboard/wallet"
                      className={"btn btn-primary py-2 " + styles.cardBtn}
                    >
                      View all &nbsp; &nbsp; <RightArrow />
                    </Link>
                  </div>
                </div>
              </div>

              {appointmentData?.counts?.length > 0 && (
                <div className={styles.Sectiontitle}>
                  {/* Today's appointments by {appointmentData?.counts?.Inspirational} */}
                  Today's appointments by type
                </div>
              )}

              <div className={styles.appointmentProgressContainer}>
                {appointmentData?.counts?.map((item) => {
                  return (
                    <>
                      <div className={styles.progressCardContainer}>
                        <div className={styles.cardTitle}>
                          <AiOutlineHeart />
                          {item.name}
                        </div>
                        <div className={styles.progressValue}>
                          <div className={styles.progressDataValue}>
                            {item.count}{" "}
                          </div>
                          <div className={styles.progressDataTotal}>
                            / {appointmentData?.total_appointments_today}{" "}
                            appointments
                          </div>
                          {/* <div className={styles.progressDataValueAvg}>50%</div> */}
                        </div>
                        {/* <div className={styles.barContainer}>
                    <ProgressBar now={60} />
                  </div> */}
                      </div>
                    </>
                  );
                })}
                {/* <div className={styles.progressCardContainer}>
                  <div className={styles.cardTitle}>
                    <CareerDrawer />
                    Career & Work
                  </div>
                  <div className={styles.progressValue}>
                    <div className={styles.progressDataValue}>2 </div>
                    <div className={styles.progressDataTotal}>
                      / 8 appointments
                    </div>
                    <div className={styles.progressDataValueAvg}>25%</div>
                  </div>
                  <div className={styles.barContainer}>
                    <ProgressBar now={60} />
                  </div>
                </div>
                <div className={styles.progressCardContainer}>
                  <div className={styles.cardTitle}>
                    <Money />
                    Money
                  </div>
                  <div className={styles.progressValue}>
                    <div className={styles.progressDataValue}>4 </div>
                    <div className={styles.progressDataTotal}>
                      / 8 appointments
                    </div>
                    <div className={styles.progressDataValueAvg}>50%</div>
                  </div>
                  <div className={styles.barContainer}>
                    <ProgressBar now={60} />
                  </div>
                </div>
                <div className={styles.progressCardContainer}>
                  <div className={styles.cardTitle}>
                    <CareerDrawer />
                    Career & Work
                  </div>
                  <div className={styles.progressValue}>
                    <div className={styles.progressDataValue}>2 </div>
                    <div className={styles.progressDataTotal}>
                      / 8 appointments
                    </div>
                    <div className={styles.progressDataValueAvg}>25%</div>
                  </div>
                  <div className={styles.barContainer}>
                    <ProgressBar now={60} />
                  </div>
                </div>
                <div className={styles.progressCardContainer}>
                  <div className={styles.cardTitle}>
                    <Money />
                    Money
                  </div>
                  <div className={styles.progressValue}>
                    <div className={styles.progressDataValue}>4 </div>
                    <div className={styles.progressDataTotal}>
                      / 8 appointments
                    </div>
                    <div className={styles.progressDataValueAvg}>50%</div>
                  </div>
                  <div className={styles.barContainer}>
                    <ProgressBar now={60} />
                  </div>
                </div> */}
              </div>

              {data.value.length > 0 && (
                <div className={classNames(styles.sleepContainer)}>
                  <div
                    className={classNames(styles.sleepTotalSectionContainer)}
                  >
                    <div className={styles.sleepTotalTitleSection}>
                      <p className={styles.sleepTotalTitle + " mb-0"}>
                        Appointment Outlook
                      </p>

                      {/* <div className={styles.categorySelector}>
                      <FiChevronLeft className={styles.categoryIcon} />
                      <p className={classNames(styles.category, "mb-0")}>
                        Weekly
                      </p>
                      <FiChevronRight className={styles.categoryIcon} />
                    </div> */}
                    </div>
                    <div className={styles.duration}>
                      <AiOutlineClockCircle className={styles.durationIcon} />
                      <div className={styles.durationValue}>
                        <span className={styles.durationWrapperStyling}>
                          {totalHour}
                          <span className={classNames(styles.durationUnit)}>
                            h
                          </span>
                        </span>
                        <span className={styles.durationWrapperStyling}>
                          {totalTime}
                          <span className={styles.durationUnit}>m</span>
                        </span>
                      </div>
                    </div>
                    <ChartComponent
                      option={BarChartOption(data.day, data.value)}
                    />
                  </div>
                  {/* <div className={classNames(styles.sleepScoreContainer)}>
                  <div
                    className={classNames(
                      styles.sleepTotalTitleSection,
                      "text-light"
                    )}
                  >
                    <p className={styles.sleepTotalTitle + " mb-0"}>
                      Client Score
                    </p>
                  </div>
                  <div className={styles.scoreGaugeWrapper}>
                    <GaugeComponent value={(9.4 / 10) * 100} />
                    <div className={styles.scoreValueWrapper}>
                      <div className={styles.value}>9.4</div>
                      <div className={styles.totaltarget}> / 10</div>
                    </div>
                  </div>
                  <div className={classNames(styles.speedScoreSuggestion)}>
                    <div className={classNames(styles.SuggestionTextContainer)}>
                      <div className={classNames(styles.SuggestionTitle)}>
                        Suggestion
                      </div>
                      <div className={styles.SuggestionBody}>
                        Try and be more _________
                      </div>
                    </div>
                    <div className={classNames(styles.suggestionIconContainer)}>
                      <img
                        src="/images/NoMobileIcon.svg"
                        alt="NoMobileIcon"
                        className={styles.suggestionIcon}
                      />
                    </div>
                  </div>
                </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Apointments;
