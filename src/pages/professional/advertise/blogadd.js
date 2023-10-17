import React, { useState } from "react";
import styles from "@/styles/professional/advertise/BlogAdd.module.css";
import { useRouter } from "next/router";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import classNames from "classnames";
import { useDropzone } from "react-dropzone";
import AddSidebar from "@/components/addSidebar/AddSidebar";

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
                <div className={styles.mainContainerHeading}>
                  <h3>Blog - Ad Placement</h3>
                  <AiOutlineExclamationCircle
                    className={classNames(styles.tbtitleIcon)}
                  />
                </div>
                <p>
                  Upload your advertisement following the specific instructions
                  listed below.
                </p>

                <div
                  className={
                    "d-flex align-items-center gap-3 " + styles.dropzoneSection
                  }
                >
                  <div className={styles.imgContainer}>
                    {yourImage.map((upFile) => {
                      return (
                        <div>
                          <img src={upFile.preview} />
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className={"form-floating mb-3 " + styles.dropBox}
                    {...getRootProps()}
                  >
                    <input
                      type="text"
                      className={`form-control `}
                      id="floatingInput"
                      {...getInputProps()}
                    />

                    <div className={`${styles.dropDown} ${styles.dotted}`}>
                      <img src="/images/gallery.svg" />
                      <div>
                        <p>
                          Drop your image here, or select{" "}
                          <span>Click to browse</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p>
                  The image format must be .gif or .webp and must be 728x90
                  pixels.
                </p>
                <form className={styles.formContainer}>
                  <div>
                    <label
                      for="exampleFormControlInput1"
                      className={styles.formLabel}
                    >
                      Your Bid &nbsp; &nbsp;
                      <span>[Bid Average: $15.94/click]</span>
                    </label>
                    <input
                      type="text"
                      className={"form-control " + styles.formInput}
                      id="exampleFormControlInput1"
                    />
                  </div>
                </form>

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
