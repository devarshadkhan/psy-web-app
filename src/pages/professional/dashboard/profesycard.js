import React, { useState } from "react";
import styles from "@/styles/professional/dashboard/ProfesyCard.module.css";
import { useRouter } from "next/router";
import ProfessionalTopSection from "@/components/professional/professionaltopsection";
import ProfessionalNavbar from "@/components/navbars/professionalnavbar";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import classNames from "classnames";
import PaymentCard from "@/components/common/paymentcard";
import { Modal } from "react-bootstrap" 


const Wallet = () => {
    const route = useRouter();

    const [show, setShow] = useState(false);
    const handleClose = (e) => {
        e.preventDefault();
        setShow(false)
    }

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
                <ProfessionalTopSection
                    tabsData={tabsData}
                    handleSelectTab={handleSelectTab}
                    activeTab={"wallet"}
                    title={"Manage Profesy Card"}
                />
                <div className={styles.walletContainer}>
                    <div className={styles.erningInfoContainer}>
                        <div className={styles.chartWrapper}>
                            <div className={styles.chartTopSection}>
                                <div className={styles.tbtitleContainerChart}>
                                    <p className={classNames("mb-0", styles.tbtitle)}>
                                        Update Card Details
                                    </p>
                                    <AiOutlineExclamationCircle
                                        className={classNames(styles.tbtitleIcon)}
                                    />
                                </div>
                            </div>

                            <form>
                                <div className="mb-4">
                                    <label for="exampleFormControlInput1" className={"form-label " + styles.formLabel}>Name on Card</label>
                                    <input type="text" className={"form-control " + styles.formInput} id="exampleFormControlInput1" />
                                </div>

                                <div className="mb-4">
                                    <label for="exampleFormControlInput2" className={"form-label " + styles.formLabel}>Email Address</label>
                                    <input type="email" className={"form-control " + styles.formInput} id="exampleFormControlInput2" />
                                </div>

                                <div className="mb-4">
                                    <label for="exampleFormControlInput3" className={"form-label " + styles.formLabel}>Address 1</label>
                                    <input type="text" className={"form-control " + styles.formInput} id="exampleFormControlInput3" />
                                </div>

                                <div className={"d-flex justify-content-between " + styles.fieldContainer}>
                                    <div className=" mb-4">
                                        <label for="exampleFormControlInput4" className={"form-label " + styles.formLabel}>State</label>
                                        <select className={"form-select " + styles.formInput} aria-label="Default select example">
                                            <option selected>Florida</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                    </div>
                                    <div className=" mb-4">
                                        <label for="exampleFormControlInput1" className={"form-label " + styles.formLabel}>City</label>
                                        <select className={"form-select " + styles.formInput} aria-label="Default select example">
                                            <option selected>Palm Beach</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                    </div>
                                    <div className=" mb-4">
                                        <label for="exampleFormControlInput1" className={"form-label " + styles.formLabel}>Zip Code</label>
                                        <input type="number" className={"form-control " + styles.formInput} id="exampleFormControlInput1" />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label for="exampleFormControlInput1" className={"form-label " + styles.formLabel}>Country</label>
                                    <select className={"form-select " + styles.formInput} aria-label="Default select example">
                                        <option selected>United States</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>
                                <hr />
                                <div className={"my-4 d-flex gap-4 " + styles.btnContainer}>
                                    <button>Cancel</button>
                                    <button>Yes</button>
                                </div>
                            </form>

                        </div>

                    </div>
                    <div className={styles.paymentInfoContainer}>

                        <div className={styles.profesyContainer}>
                            <div className={styles.tbtitleContainer}>
                                <p className={classNames("mb-0", styles.tbtitle)}>
                                    Your Profesy Card
                                </p>
                                <AiOutlineExclamationCircle
                                    className={classNames(styles.tbtitleIcon)}
                                />
                            </div>
                            <div className={styles.profesyIconatiner}>
                                <PaymentCard
                                    bgtype="bgtype1"
                                    cardName="Tina Williams"
                                    cardNumber="****  ***** **** 3456"
                                    provider="profesy"
                                    expDate="11/26"
                                    cardType="visa"
                                />
                                <div>
                                    <div className={styles.outlinedBtn}>Cancel Card</div>
                                    <div className={styles.outlinedBtn} onClick={() => setShow(true)}>Update Pin Number</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop='static'
                    className="updatepin"
                    keyboard={false}
                >
                    <div className={styles.updatePinContainer}>
                        <button onClick={handleClose} className={styles.closeBtn}>X</button>
                        <div className="d-flex flex-column align-items-center">
                            <h3>Update Pin Number</h3>
                            <p>Please enter a new pin number below</p>
                            <div className={`${styles.inputGroup} d-flex justify-content-between my-2`}>
                                <input type="text" maxlength="1" />
                                <input type="text" maxlength="1" />
                                <input type="text" maxlength="1" />
                                <input type="text" maxlength="1" />
                            </div>
                            <button className="mt-4">Confirm update</button>
                        </div>
                    </div>

                </Modal>
            </div>
        </main>
    );
};

export default Wallet;
