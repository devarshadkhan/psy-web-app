import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "@/styles/professional/dashboard/AppointmentPending.module.css";
import AppointmentChecklist from "@/components/appointmentChecklist/AppointmentChecklist";
import AppointmentReason from "@/components/appointmentReason/AppointmentReason";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import { API } from "@/utils/apiendpoints";
import axiosInstance from "@/utils/axios";
import PendingAppointmentPsychix from "@/components/pendingAppointmentPsychica/pendingAppointmentPsychica";
import Head from "next/head";
import NoDataMsg from "@/components/noDataMsg/NoDataMsg";
import classNames from "classnames";
import { fetchToken, onMessageListener } from "@/utils/firebase";

const AppointmentPending = () => {
  const route = useRouter();
  const [startDate, setStartDate] = useState(new Date());
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

  const [data, setData] = useState();
  const [type, setType] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [uncheck, setUncheck] = useState(false);
  const { date } = route.query;
  useEffect(() => {}, [route.asPath]);

  // useEffect(() => {

  // }, [type]);

  const appointmentHistory = async () => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));
      const role = localStorage.getItem("role");
      // let baseUrl = `${API.appointmentsHisoryType}/${item.id}?role=${role}`
      let baseUrl = `${API.appointmentsHisoryType}/?role=${role}`;
      if (type?.length > 0 && !inputDisabled && !uncheck) {
        const typesString = type.map((item) => `'${item}'`).join(",");
        baseUrl = baseUrl + `&type=${typesString.toString()}`;
      }

      axiosInstance
        .get(baseUrl)
        .then((res) => {
          if (route.asPath) {
            if (route.asPath.includes("appointmentpending")) {
              setData(res[0].pendingAppointments);
            } else {
              setData(res[0].completedAppointments);
            }
          }
        })
        .catch((err) => console.warn(err));
    }
  };

  useEffect(() => {
    if (date) {
      appointmentHistory();
      setTimeout(
        () =>
          fetchToken().then(() => {
            onMessageListener().then((payload) => {
              appointmentHistory();
            });
          }),
        500
      );
    }
  }, [type, date, inputDisabled, uncheck]);

  return (
    <main className={styles.main}>
      <Head>
        <title>Appointment-history | Psychix</title>
        <meta name="description" content="Appointment-history | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={"container-fluid p-0 professionalNav"}>
        <ProfessionalNavbar image="/images/avatar.png" />
      </div>
      <div className={styles.bodyContainer}>
        <div className="position-relative">
          <ProfessionalTopSection
            tabsData={tabsData}
            handleSelectTab={handleSelectTab}
            activeTab={"appointments"}
            routedata={
              route.asPath.includes("appointmentpending")
                ? ["Dashboard", "Appointments", "Appointment Pending"]
                : ["Dashboard", "Appointments", "Appointment's History"]
            }
            title={
              route?.asPath === "/professional/dashboard/appointmentcompleted"
                ? "Appointment's History"
                : "Pending Appointments "
            }
          />
          {/* <div className={styles.calenderContainer}>
            <ReactDatePicker
              selected={startDate}
              popperClassName="custom-calenderPopper-appointment"
              calendarClassName="custom-professionalDatePicker-appointment"
              onChange={(date) => setStartDate(date)}
              customInput={
                <div
                  className={styles.CustomDatePickerInput}
                  onClick={() => {}}
                >
                  <img
                    src="/images/calendar-light.svg"
                    className={styles.CustomDatePickerInputIcon}
                    alt="Calendar"
                  />
                  <span className={styles.CustomDatePickerInputText}>
                    {startDate.toLocaleDateString()}
                  </span>
                </div>
              }
            />
          </div> */}
        </div>
        <div className={styles.bodyWrapper}>
          {/* {data?.length > 0 ? (
            <div className={styles.checkListContainer}>
              <PendingAppointmentPsychix
                inputDisabled={inputDisabled}
                setInputDisabled={setInputDisabled}
                setUncheck={setUncheck}
                uncheck={uncheck}
                setType={setType}
              />
              <AppointmentChecklist inputDisabled={inputDisabled} setInputDisabled={setInputDisabled} setUncheck={setUncheck} uncheck={uncheck} setType={setType} />
            </div>
          ) : (
            <></>
          )} */}
          <div className={styles.checkListContainer}>
            <PendingAppointmentPsychix
              inputDisabled={inputDisabled}
              setInputDisabled={setInputDisabled}
              setUncheck={setUncheck}
              uncheck={uncheck}
              setType={setType}
            />
            {/* <AppointmentChecklist inputDisabled={inputDisabled} setInputDisabled={setInputDisabled} setUncheck={setUncheck} uncheck={uncheck} setType={setType} /> */}
          </div>
          <div
            className={classNames(
              data?.length === 0 ? "w-80" : "",
              styles.dataBodyContainer
            )}
          >
            {data?.length === 0 ? (
              <>
                <div className="mt-5 pt-4">
                  {route.asPath.includes("appointmentpending") ? (
                    <>
                      {" "}
                      <NoDataMsg
                        message="You do not have an appointment."
                        img="/images/loadImg/calender.svg"
                      />
                    </>
                  ) : (
                    <>
                      <NoDataMsg
                        message="You do not have an appointment history."
                        img="/images/loadImg/calender.svg"
                      />
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {data?.map((ele) => {
                  return (
                    <AppointmentReason
                      key={ele?.id}
                      first_name={ele?.client?.first_name}
                      last_name={ele?.client?.last_name}
                      appointment_type={ele?.appointment_type}
                      time={`${ele?.duration}`}
                      endTime={ele?.end_time}
                      id={ele?.id}
                      appointmentHistory={appointmentHistory}
                      hideHourRate={true}
                      hourlyRate={ele?.client?.actual_rate}
                      paid={ele?.amount_paid}
                      timming={ele?.start_time}
                      image={ele?.client?.picture}
                      clientId={ele?.client?.id}
                      type={ele?.appointment_type}
                      amount_paid={ele?.amount_paid}
                      meetingId={ele?.meetingId}
                      meeting_type={ele?.meeting_type}
                      meetStatus={ele?.status}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AppointmentPending;
