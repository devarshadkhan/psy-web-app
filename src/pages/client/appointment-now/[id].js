import UserNavbar from "@/components/navbars/UserNavbar";
import Head from "next/head";
import styles from "@/styles/client/appointment-now/AppointmentNow.module.css";
import Back from "@/components/icons/Back";
import BookAppointment from "@/components/bookAppointment/BookAppointment";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

const Index = () => {
  const [width, setWidth] = useState(0);
  const handleResize = () => setWidth(window.innerWidth);

  const router = useRouter();
  const { name, timezone } = router.query;

  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <>
       <Head>
        <title>Appointment-now | Psychix</title>
        <meta name="description" content="Appointment-now | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={"container-fluid p-0 "}>
          <div>
            <UserNavbar image="/images/avatar.png" />
          </div>

          <div>
            <div className={styles.appointmentHeader}>
              <span onClick={() => router.back()} className="cursor-pointer">
                {/* <Back /> &nbsp;Back to Schedule {name} Now */}
                <Back /> &nbsp;Back to Schedule Now
              </span>
            </div>

            <div className={styles.backgroundPadding}>
              <div className={styles.nowBG}>
                <div className={styles.BGContent}>
                  <h1>The Time Is Today.</h1>
                  <p className="mb-0">Book an appointment with {name} Today.</p>
                  <span className={styles.bookTimeZone}>{ name}'s Timezone : {timezone}</span>

                </div>
                {width > 1024 ? (
                  <div className={styles.BAContainer}>
                    <BookAppointment sceduleType="today"  />
                  </div>
                ) : null}
              </div>
            </div>
            {width <= 1024 ? (
              <div className={styles.BAContainer}>
                <BookAppointment sceduleType="today" />
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;
