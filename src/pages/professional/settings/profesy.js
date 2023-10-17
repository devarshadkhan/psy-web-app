import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import React, { useEffect, useState } from "react";
import styles from "@/styles/professional/settings/Profesy.module.css";
// import ProfessionalSidebar from '@/components/professionalSidebar/professionalSidebar';
import classNames from "classnames";
import Link from "next/link";
import ProfessionalSidebar from "@/components/addSidebar/professionalSidebar";
import Head from "next/head";
import axiosInstance from "@/utils/axios";
import { API } from "@/utils/apiendpoints";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { convertUnixToHumanReadableDate } from "@/utils/common";
// import ProfessionalSidebar from '@/components/professionalSidebar/ProfessionalSidebar';

const profesy = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isInCancelation, setIsInCancelation] = useState(false);
  const [endDate, setEndDate] = useState("");
  const route = useRouter();
  const getproductData = async () => {
    axiosInstance.get(API.usersProducts).then((res) => {
      setProductInfo(res[0]);
    });
  };

  const getSubscriptionData = () => {
    setLoader(true);
    axiosInstance
      .get("users/subscription/details")
      .then((res) => {
        if (res?.data?.status === 1) {
          setIsMember(true);
        } else if (res?.data?.status === 0) {
          setIsInCancelation(true);
          setEndDate(convertUnixToHumanReadableDate(res?.data?.endDate));
        }
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        if (err?.message === "No subscription data found.") {
          setIsMember(false);
        } else {
          toast.error(err?.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      });
  };

  const handleConfirm = () => {
    axiosInstance
      .post("users/subscription/cancel")
      .then((res) => {
        setShow(false);
        getSubscriptionData();
        Swal.fire({
          title:
            "Your membership will end after the current subscription cycle.",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          route.push("/professional/dashboard");
        });
      })
      .catch((err) => {
        toast.error(err?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const handleClose = (e) => {
    e.preventDefault();
    setShow(false);
  };

  const handleCancelSubscription = () => {
    setShow(true);
  };

  useEffect(() => {
    if (window !== "undefined") {
      setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
      getproductData();
      getSubscriptionData();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Profesy | Psychix</title>
        <meta name="description" content="Profesy | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        className="updatepin"
        keyboard={false}
      >
        <div className={styles.cancelSubsWrapper}>
          <p className={classNames("mb-0", styles.modalText)}>
            Are you sure you want to cancel your subscription?
          </p>
          <div className="gap-2 w-fitContent d-flex ms-auto">
            <Button
              onClick={handleClose}
              className={styles.secondarybuttonContainer}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} className={styles.buttonContainer}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
      <ProfessionalNavbar />
      <section className={styles.wrapper_profesy}>
        <div className={classNames(styles.cntr_main, "container-fluid")}>
          <div className="row">
            <div className="col-md-3">
              <ProfessionalSidebar />
            </div>
            <div className="col-lg-9 col-sm-12 col-md-12">
              <div className={styles.banner_profesy}>
                <h2>Profesy+</h2>
                <div className={styles.profesy_status}>
                  <img src="/images/SettingsImage/Divider.png" alt="" />

                  <h3>Status:</h3>
                  <div className={styles.subscribe_section}>
                    <div>
                      <p>Your Profesy+ Subscription</p>
                      <span>
                        {userInfo?.is_subscription ? "Active" : "Not Active"}
                      </span>
                      {!userInfo?.isEmailVerified && (
                        <div className={styles.verifyEmailMsg}>
                          Please verify your email to subscribe.
                        </div>
                      )}
                    </div>
                    {loader ? (
                      <>
                        <span
                          className={`spinner-border me-2 spinner-border-sm ${styles.SearchIcon}`}
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </>
                    ) : (
                      <>
                        {isInCancelation ? (
                          <div
                            className={
                              styles.actionBtn +
                              " " +
                              "cursor-default border-none"
                            }
                          >
                            Subscription ending at {endDate}
                          </div>
                        ) : (
                          <>
                            {isMember ? (
                              <div
                                className={styles.actionBtn}
                                onClick={handleCancelSubscription}
                              >
                                Cancel subscription
                              </div>
                            ) : (
                              <Link
                                className={styles.actionBtn}
                                href={
                                  userInfo?.isEmailVerified
                                    ? `/professional/settingspayment/subscribeconfirm?price=${productInfo?.prices[0]?.unit_amount}&recuring=${productInfo?.prices[0]?.recurring?.interval}&priceId=${productInfo?.prices[0]?.id}`
                                    : "#"
                                }
                              >
                                Subscribe now
                              </Link>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default profesy;
