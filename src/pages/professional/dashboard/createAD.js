import React from 'react'
import styles from "@/styles/professional/dashboard/CreateAD.module.css";
import ProfessionalNavbar from '@/components/navbars/professionalnavbar';
import { useRouter } from "next/router";
import ProfessionalTopSection from '@/components/professional/professionaltopsection';
// import ProfessionalSidebar from '@/components/professionalSidebar/professionalSidebar';
const CreateAD = () => {
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
    <>
          <main>
            <div className={"container-fluid p-0 professionalNav"}>
                <ProfessionalNavbar image="/images/avatar.png" />
            </div>
            <div className={styles.bodyContainer}>
                <ProfessionalTopSection
                    tabsData={tabsData}
                    handleSelectTab={handleSelectTab}
                    activeTab={"wallet"}
                    title={"Wallet"}
                />
                <div className={styles.Container}>
                    <div className={styles.containerHeading}>
                        <h2>Create an advertisement</h2>
                    </div>
                    <div>
                        {/* <div className={styles.sidebarContainer}><ProfessionalSidebar /></div> */}
                        <div className={styles.mainConatiner}>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>
  )
}

export default CreateAD