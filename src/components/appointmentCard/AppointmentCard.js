import Contact from "../icons/Contact"
import Video from "../icons/Video"
import styles from '@/styles/components/appointmentCard/AppointmentCard.module.css'

function AppointmentCard() {
  return (
    <div className={"d-flex flex-column card " + styles.cardSize}>
        <div className={styles.videoBox}>
            <button className={"btn btn-primary " + styles.dateBtn}>03/21/23</button>
        </div>
        <div>
            <div className="my-2 py-2 d-flex justify-content-between border-bottom">
                <img className={styles.footerImg} src="/images/avatar3.png"/>
                <button className={styles.videoBtn}>VIDEO</button>
            </div>
            <div className="my-2 py-2 d-flex justify-content-between ">
                <span className={styles.smallCont + ' d-flex align-items-center justify-content-center'}><Video className={styles.vIcons} />15:00</span>
                <span className={styles.smallCont + ' d-flex align-items-center justify-content-center'}><Contact color='#777E90' className={styles.vIcons}  />Tina W.</span>
            </div>
        </div>
    </div>
  )
}

export default AppointmentCard