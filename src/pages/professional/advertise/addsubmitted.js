import React, { useState } from "react";
import styles from "@/styles/professional/advertise/AddSubmitted.module.css";
import { useRouter } from "next/router";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import "react-datepicker/dist/react-datepicker.css";
import { useDropzone } from "react-dropzone";

const AddSubmitted = () => {
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
          activeTab={"wallet"}
          isHideTab={true}
          title={"Wallet"}
          btn1={"Create an advertisement"}
          btn2={"Manage advertisements"}
        />
        <div className={styles.Container}>
          <div className={styles.containerHeading}>
            <h2>Advertisement submitted</h2>
          </div>
          <div className={"d-flex " + styles.pageContainer}>
            <div className={styles.thankyouText}>
              <p>
                Thank you for submitted an ad on the Profesy network. Your ad
                has been submitted to our team for approval. Once your ad is
                approved, you will receive an email and it will go live.
              </p>
              <button className={styles.finalize}>Finalize Ad</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddSubmitted;
