import React, { useState } from "react";
import styles from "@/styles/professional/advertise/AddLocation.module.css";
import { useRouter } from "next/router";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import "react-datepicker/dist/react-datepicker.css";
import AddSidebar from "@/components/addSidebar/AddSidebar";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import classNames from "classnames";
import { useDropzone } from "react-dropzone";
import Tick from "@/components/icons/Tick";
import Head from "next/head";

const BlogAdd = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [yourImage, setImage] = useState([]);

  const [countries, setCountries] = useState([]);
  const countryArr = [
    "United States of America",
    "United Kingdom",
    "France",
    "Spain",
    "Italy",
    "Greece",
    "Singapore",
    "Netherlands",
    "India",
  ];

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

  const selectCountry = (ele) => {
    let arr = [];
    let place = countries.indexOf(ele);
    place >= 0
      ? setCountries(countries.filter((ele) => ele !== countries[place]))
      : setCountries([...countries, ele]);
  };

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
          <Head>
        <title>Appointments | Psychix</title>
        <meta name="description" content="Appointments | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={"container-fluid p-0 professionalNav"}>
        <ProfessionalNavbar image="/images/avatar.png" />
      </div>
      <div className={styles.bodyContainer + " mt-1"}>
        <ProfessionalTopSection
          tabsData={tabsData}
          handleSelectTab={handleSelectTab}
          activeTab={"wallet"}
          title={"Wallet"}
          isHideTab={true}
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
                <h6>Location</h6>
                <p>Where should your ads appear?</p>
                <div className={styles.formInput}>
                  {countries?.map((ele) => {
                    return (
                      <span className={styles.selectedCountry}>{ele}</span>
                    );
                  })}
                </div>

                <div className={styles.countryContainer}>
                  {countryArr?.map((ele) => {
                    return (
                      <div
                        className={`${
                          countries.includes(ele) ? styles.active : ""
                        } ${styles.country}`}
                        onClick={() => selectCountry(ele)}
                      >
                        <img src="/images/flagg.png" />
                        &nbsp;
                        {ele}
                        <span
                          className={`${
                            countries.includes(ele)
                              ? styles.showIcon
                              : styles.hide
                          } ${styles.icon}`}
                        >
                          <Tick />
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button className={styles.finalizeADD}>Finalize Ad</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogAdd;
