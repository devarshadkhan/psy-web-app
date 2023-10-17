import UserNavbar from "@/components/navbars/UserNavbar";
import Head from "next/head";
import styles from "@/styles/client/appointment-history/AppointmentHistory.module.css";
import Back from "@/components/icons/Back";
import AppointmentReason from "@/components/appointmentReason/AppointmentReason";
import AppointmentChecklist from "@/components/appointmentChecklist/AppointmentChecklist";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import { useRouter } from "next/router";
import { historyData } from "@/mockdata/appointmenthistory";
import NoDataMsg from "@/components/noDataMsg/NoDataMsg";

function Index() {
  const router = useRouter();
  const [data, setData] = useState();
  const [type, setType] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [uncheck, setUncheck] = useState(false);

  const appointmentHistory = async () => {
    if (typeof window !== "undefined") {
      var item = JSON.parse(localStorage.getItem("userInfo"));

      // let baseUrl = `${API.appointmentsHisoryType}/${item.id}?role=${role}`
      let baseUrl = `${API.appointmentsHisoryType}/?role=${item.role}`;
      if (type?.length > 0 && !inputDisabled && !uncheck) {
        const typesString = type.map((item) => `'${item}'`).join(",");
        baseUrl = baseUrl + `&type=${typesString.toString()}`;
      }
      axiosInstance
        .get(baseUrl)
        .then((res) => {
          setData(res);
        })
        .catch((err) => console.warn(err));
    }
  };

  useEffect(() => {
    appointmentHistory();
  }, [type, inputDisabled, uncheck]);


  return (
    <>
      <Head>
        <title>Appointment-history | Psychix</title>
        <meta name="description" content="Appointment-history | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={"container-fluid p-0 "}>
          <div>
            <UserNavbar image="/images/avatar.png" />
          </div>
          <div className={"d-flex flex-wrap " + styles.AHMainCont}>
            <div className={styles.appointmentHistory}>
              <span onClick={() => router.back(-1)}>
                <Back /> Back to Appointments
              </span>

              <div className={styles.mobileCenter}>
                <h2 className="my-3">Appointment History</h2>
                {/* {data?.length ? (
                  <AppointmentChecklist
                    inputDisabled={inputDisabled}
                    setInputDisabled={setInputDisabled}
                    setUncheck={setUncheck}
                    uncheck={uncheck}
                    setType={setType}
                  />
                ) : (
                  <></>
                )} */}
                <AppointmentChecklist
                  inputDisabled={inputDisabled}
                  setInputDisabled={setInputDisabled}
                  setUncheck={setUncheck}
                  uncheck={uncheck}
                  setType={setType}
                />
              </div>
            </div>

            {data?.length === 0 ? (
              <>
                <div className={styles.NoMsgCss}>
                  <NoDataMsg
                    message="You do not have an appointment history."
                    img="/images/loadImg/calender.svg"
                  />
                </div>
              </>
            ) : (
              <div className={styles.appointmentHistoryRight}>
                <div className={styles.appointmentRS}>
                  {data?.map((ele) => {
                    return (
                      <AppointmentReason
                        key={ele?.id}
                        first_name={ele?.professional?.nickName}
                        reason={ele?.reason}
                        time={`${ele?.duration}`}
                        clientId={ele?.professional?.id}
                        id={ele?.id}
                        hourlyRate={ele?.professional?.actual_rate}
                        paid={ele?.amount_paid / 100}
                        timming={ele?.start_time}
                        endTime={ele?.end_time}
                        image={ele?.professional?.picture}
                        appointment_type={ele?.appointment_type}
                        meetStatus={ele?.status}
                        appointmentHistory={appointmentHistory}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
export default Index;
