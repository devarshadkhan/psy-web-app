import UserNavbar from "@/components/navbars/UserNavbar"
import Head from "next/head"
import styles from '@/styles/client/present-appointment-successful/PresentAppSuccess.module.css'
import CompleteAppointment from "@/components/appointmentCompleted/AppointmentCompleted"

 
const Index = () => {

    return (
        <>
            <Head>
                <title>Present Appointment  | Psychix</title>
                <meta name="description" content="Present Appointment | Psychix" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={"container-fluid p-0 "}>
                    <div>
                        <UserNavbar image='/images/avatar.png' />
                    </div>

                    <div>
                        <div className={"d-flex " + styles.wrapper}>
                            <div className={"col-lg-6 col-md-12 col-sm-12 "}>
                                <CompleteAppointment btnText='Join Meeting' />
                            </div>

                            <div className={"col-lg-6 col-md-12 col-sm-12 "}>
                                <div className={styles.imgWrapper}>
                                    <img src="/images/appointment.png" className={styles.BGImage} />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </main >
        </>
    )
}

export default Index