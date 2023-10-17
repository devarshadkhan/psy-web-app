import React, { useState } from "react";
import styles from "@/styles/professional/advertise/AddType.module.css";
import { useRouter } from "next/router";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import "react-datepicker/dist/react-datepicker.css";
import AddSidebar from "@/components/addSidebar/AddSidebar";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import classNames from "classnames";
import { useDropzone } from "react-dropzone";

const BlogAdd = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [yourImage, setImage] = useState([]);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setImage(
        acceptedFiles.map((upFile) =>
          Object.assign(upFile, {
            preview: URL.createObjectURL(upFile),
          })
        )
      );
    },
  });

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
      <div className={styles.bodyContainer + " mt-1"}>
        <ProfessionalTopSection
          tabsData={tabsData}
          handleSelectTab={handleSelectTab}
          isHideTab={true}
          activeTab={"wallet"}
          title={"Wallet"}
          btn1={"Create an advertisement"}
          btn2={"Manage advertisements"}
        />

        <div className={styles.Container}>
          <div className={styles.containerHeading}>
            <h2>Create an advertisement</h2>
          </div>
          <div className={"d-flex " + styles.pageContainer}>
            <div className={styles.sidebarContainer}>
              <AddSidebar />
            </div>
            <div className={styles.mainContainer}>
              <div>
                <div className={styles.mainContainerHeading}>
                  <h3>Choose ad type</h3>
                </div>
                <p>Pick an advertising type below:</p>

                <div className={"d-flex gap-3 my-3 " + styles.midContainers}>
                  <div>
                    <h6>Featured Psychic Ad</h6>
                    <p>
                      We will feature you on our category pages via the Psychix
                      Marketplace.
                    </p>
                  </div>
                  <div>
                    <h6>Blog Ads</h6>
                    <p>We will feature your ad on our blog pages.</p>
                  </div>
                </div>

                <div className={styles.bottomContainer}>
                  <h6>Profesy Network Ads</h6>
                  <p>
                    We will feature you across our growing network of websites,
                    tools and other material.
                  </p>
                </div>

                <button className={styles.nextBtn}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogAdd;
