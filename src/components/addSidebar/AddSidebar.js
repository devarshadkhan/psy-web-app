import Card from "../icons/Card"
import DollarCircle from "../icons/DollarCircle"
import Global from "../icons/Global"
import SidebarSetting from "../icons/SidebarSetting"
import styles from '@/styles/components/addSidebar/AddSidebar.module.css';


const AddSidebar = () => {
    const sidebarData = [
        {
            id: 1,
            icon: <SidebarSetting />,
            heading: 'Choose ad type',
            para: 'How are you advertising?',
        },
        {
            id: 2,
            icon: <Card />,
            heading: 'Placement',
            para: 'Where will your ad be placed?',
        },
        {
            id: 3,
            icon: <DollarCircle />,
            heading: 'Payments & Billing',
            para: 'How will you pay for your clicks?',
        },
        {
            id: 4,
            icon: <Global />,
            heading: 'Location',
            para: 'Where should your ads appear?',
        },
    ]
    return (
        <div className={styles.sidebar}>

            {
                sidebarData?.map((ele) => {
                    return (
                        <div className="d-flex gap-3">
                            <span className={styles.iconContainer}>{ele.icon}</span>
                            <div>
                                <h6>{ele.heading}</h6>
                                <p>{ele.para}</p>
                            </div>
                        </div>
                    )
                })
            }



        </div>
    )
}

export default AddSidebar
