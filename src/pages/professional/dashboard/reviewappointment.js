import React, { useState } from "react";
import styles from "@/styles/professional/dashboard/ReviewAppointment.module.css";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import { useRouter } from "next/router";
import VideoPlayer from "@/components/common/videoplayer";

const ReviewAppointment = () => {
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
    <main>
      <div className={"container-fluid p-0 professionalNav"}>
        <ProfessionalNavbar image="/images/avatar.png" />
      </div>
      <div className={styles.bodyContainer}>
        <div className="position-relative">
          <ProfessionalTopSection
            tabsData={tabsData}
            handleSelectTab={handleSelectTab}
            activeTab={"appointments"}
            title={"Appointment w/ Michael on 12/21/22"}
          />
          <div className={styles.reviewContainer}>
            <VideoPlayer src={"/images/sampleVideo.mp4"} />
            <div className={styles.reviewDetailsContainer}>
              Appointment with Michael on 12/4/2022
              <div className={styles.audioButton}>AUDIO</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReviewAppointment;
