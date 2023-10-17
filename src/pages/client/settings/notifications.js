import UserNavbar from "@/components/navbars/UserNavbar";
import React, { useEffect, useState } from "react";
import styles from "@/styles/client/settings/Notifications.module.css";
import EditProfileSidebar from "@/components/editprofilesidebar/EditProfileSidebar";
import classNames from "classnames";
import { updateProfile } from "@/store/client/updateProfile";
import { useDispatch } from "react-redux";
import Head from "next/head";
import { ToastContainer } from "react-toastify";

const notifications = () => {
  const dispatch = useDispatch();
  const [apiData, setApiData] = useState({
    is_email_allow: false,
    is_sms_allow: false,
    is_webpush_allow: false,
    is_promo_email_allow: false,
    is_promo_sms_allow: false,
    is_promo_webpush_allow: false,
    is_reminder_email_allow: false,
    is_reminder_sms_allow: false,
    is_reminder_webpush_allow: false,
  });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setApiData({
      is_email_allow: userInfo.is_email_allow,
      is_sms_allow: userInfo.is_sms_allow,
      is_webpush_allow: userInfo.is_webpush_allow,
      is_promo_email_allow: userInfo.is_promo_email_allow,
      is_promo_sms_allow: userInfo.is_promo_sms_allow,
      is_promo_webpush_allow: userInfo.is_promo_webpush_allow,
      is_reminder_email_allow: userInfo.is_reminder_email_allow,
      is_reminder_sms_allow: userInfo.is_reminder_sms_allow,
      is_reminder_webpush_allow: userInfo.is_reminder_webpush_allow,
    });
  }, []);

  const handleNotification = (e) => {
    let param = { ...apiData };
    param[e.target.name] = e.target.checked;
    dispatch(updateProfile(param)).then((res) => {
      if (!res.error) {
        setApiData(param);
        localStorage.setItem("userInfo", JSON.stringify(res.payload));
      }
    });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Head>
        <title>Notifications | Psychix</title>
        <meta name="description" content="Notifications | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserNavbar />

      <div className={styles.wrapper_notifications}>
        <div className={classNames(styles.cntr_main, "container-fluid")}>
          <div className="row">
            <div className="col-lg-3 col-sm-12 col-md-12">
              <EditProfileSidebar />
            </div>

            <div className="col-lg-9 col-sm-12 col-md-12">
              <div className={styles.main_notifications_bnr}>
                <h2>Notifications</h2>

                <div className={styles.messages}>
                  <h4>Messages</h4>
                  <div>
                    <div className={styles.messages_veiw}>
                      <div>
                        <h6>Email</h6>
                        <p>Receive notifications via email</p>
                      </div>

                      {/* <label className={styles.switch}>
                        <input type="checkbox"  />
                        <span
                          className={classNames(styles.slider, styles.round)}
                        ></span>
                      </label> */}
                      <div className={styles.toggle_button_cover}>
                        <div className={styles.button_cover}>
                          <div
                            className={classNames(styles.button, styles.r)}
                            id={styles.button_1}
                          >
                            <input
                              type="checkbox"
                              checked={apiData?.is_email_allow}
                              className={styles.checkbox}
                              name="is_email_allow"
                              onChange={handleNotification}
                            />
                            <div className={styles.knobs}></div>
                            <div className={styles.layer}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <img
                        src="/images/SettingsImage/Divider.png"
                        alt=""
                        width="100%"
                      />
                    </div>
                  </div>
                  <div>
                    <div className={styles.messages_veiw}>
                      <div>
                        <h6>Text messages</h6>
                        <p>Receive notifications via SMS</p>
                      </div>
                      {/* <label className={styles.switch}>
                        <input type="checkbox" />
                        <span
                          className={classNames(styles.slider, styles.round)}
                        ></span>
                      </label> */}
                      <div className={styles.toggle_button_cover}>
                        <div className={styles.button_cover}>
                          <div
                            className={classNames(styles.button, styles.r)}
                            id={styles.button_1}
                          >
                            <input
                              type="checkbox"
                              disabled
                              className={styles.checkbox}
                              // checked={apiData?.is_reminder_sms_allow || false}
                              name="is_reminder_sms_allow"
                              onChange={handleNotification}
                            />
                            <div
                              className={classNames(
                                styles.knobsDisabled,
                                styles.knobs
                              )}
                            ></div>
                            <div className={styles.layer}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <img
                        src="/images/SettingsImage/Divider.png"
                        alt=""
                        width="100%"
                      />
                    </div>
                  </div>
                  <div>
                    <div className={styles.messages_veiw}>
                      <div>
                        <h6>Browser notifications</h6>
                        <p>Receive notifications of your browser</p>
                      </div>
                      {/* <label className={styles.switch}>
                        <input type="checkbox" />
                        <span
                          className={classNames(styles.slider, styles.round)}
                        ></span>
                      </label> */}
                      <div className={styles.toggle_button_cover}>
                        <div className={styles.button_cover}>
                          <div
                            className={classNames(styles.button, styles.r)}
                            id={styles.button_1}
                          >
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={apiData?.is_webpush_allow}
                              name="is_webpush_allow"
                              onChange={handleNotification}
                            />
                            <div className={classNames(styles.knobs)}></div>
                            <div className={styles.layer}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <img
                        src="/images/SettingsImage/Divider.png"
                        alt=""
                        width="100%"
                        className={styles.botttom_Image}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.messages}>
                  <h4>Promotions</h4>
                  <div>
                    <div className={styles.messages_veiw}>
                      <div>
                        <h6>Email</h6>
                        <p>Receive notifications via email</p>
                      </div>
                      {/* <label className={styles.switch}>
                        <input type="checkbox" />
                        <span
                          className={classNames(styles.slider, styles.round)}
                        ></span>
                      </label> */}
                      <div className={styles.toggle_button_cover}>
                        <div className={styles.button_cover}>
                          <div
                            className={classNames(styles.button, styles.r)}
                            id={styles.button_1}
                          >
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={apiData?.is_promo_email_allow || false}
                              name="is_promo_email_allow"
                              onChange={handleNotification}
                            />
                            <div className={styles.knobs}></div>
                            <div className={styles.layer}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <img
                        src="/images/SettingsImage/Divider.png"
                        alt=""
                        width="100%"
                      />
                    </div>
                  </div>
                  <div>
                    <div className={styles.messages_veiw}>
                      <div>
                        <h6>Text messages</h6>
                        <p>Receive notifications via SMS</p>
                      </div>
                      {/* <label className={styles.switch}>
                        <input type="checkbox" />
                        <span
                          className={classNames(styles.slider, styles.round)}
                        ></span>
                      </label> */}
                      <div className={styles.toggle_button_cover}>
                        <div className={styles.button_cover}>
                          <div
                            className={classNames(styles.button, styles.r)}
                            id={styles.button_1}
                          >
                            <input
                              type="checkbox"
                              disabled
                              className={styles.checkbox}
                              // checked={apiData?.is_reminder_sms_allow || false}
                              name="is_reminder_sms_allow"
                              onChange={handleNotification}
                            />
                            <div
                              className={classNames(
                                styles.knobsDisabled,
                                styles.knobs
                              )}
                            ></div>
                            <div className={styles.layer}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <img
                        src="/images/SettingsImage/Divider.png"
                        alt=""
                        width="100%"
                      />
                    </div>
                  </div>
                  <div>
                    <div className={styles.messages_veiw}>
                      <div>
                        <h6>Browser notifications</h6>
                        <p>Receive notifications of your browser</p>
                      </div>
                      {/* <label className={styles.switch}>
                        <input type="checkbox" />
                        <span
                          className={classNames(styles.slider, styles.round)}
                        ></span>
                      </label> */}
                      <div className={styles.toggle_button_cover}>
                        <div className={styles.button_cover}>
                          <div
                            className={classNames(styles.button, styles.r)}
                            id={styles.button_1}
                          >
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={apiData?.is_promo_webpush_allow}
                              name="is_promo_webpush_allow"
                              onChange={handleNotification}
                            />
                            <div className={classNames(styles.knobs)}></div>
                            <div className={styles.layer}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <img
                        src="/images/SettingsImage/Divider.png"
                        alt=""
                        width="100%"
                        className={styles.botttom_Image}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.messages}>
                  <h4>Reminders</h4>
                  <div>
                    <div className={styles.messages_veiw}>
                      <div>
                        <h6>Email</h6>
                        <p>Receive notifications via email</p>
                      </div>
                      {/* <label className={styles.switch}>
                        <input type="checkbox" />
                        <span
                          className={classNames(styles.slider, styles.round)}
                        ></span>
                      </label> */}
                      <div className={styles.toggle_button_cover}>
                        <div className={styles.button_cover}>
                          <div
                            className={classNames(styles.button, styles.r)}
                            id={styles.button_1}
                          >
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={
                                apiData?.is_reminder_email_allow || false
                              }
                              name="is_reminder_email_allow"
                              onChange={handleNotification}
                            />
                            <div className={styles.knobs}></div>
                            <div className={styles.layer}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <img
                        src="/images/SettingsImage/Divider.png"
                        alt=""
                        width="100%"
                      />
                    </div>
                  </div>
                  <div>
                    <div className={styles.messages_veiw}>
                      <div>
                        <h6>Text messages</h6>
                        <p>Receive notifications via SMS</p>
                      </div>
                      {/* <label className={styles.switch}>
                        <input type="checkbox" />
                        <span
                          className={classNames(styles.slider, styles.round)}
                        ></span>
                      </label> */}
                      <div className={styles.toggle_button_cover}>
                        <div className={styles.button_cover}>
                          <div
                            className={classNames(styles.button, styles.r)}
                            id={styles.button_1}
                          >
                            <input
                              type="checkbox"
                              disabled
                              className={styles.checkbox}
                              // checked={apiData?.is_reminder_sms_allow || false}
                              name="is_reminder_sms_allow"
                              onChange={handleNotification}
                            />
                            <div
                              className={classNames(
                                styles.knobsDisabled,
                                styles.knobs
                              )}
                            ></div>
                            <div className={styles.layer}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <img
                        src="/images/SettingsImage/Divider.png"
                        alt=""
                        width="100%"
                      />
                    </div>
                  </div>
                  <div>
                    <div className={styles.messages_veiw}>
                      <div>
                        <h6>Browser notifications</h6>
                        <p>Receive notifications of your browser</p>
                      </div>
                      {/* <label className={styles.switch}>
                        <input type="checkbox" />
                        <span
                          className={classNames(styles.slider, styles.round)}
                        ></span>
                      </label> */}
                      <div className={styles.toggle_button_cover}>
                        <div className={styles.button_cover}>
                          <div
                            className={classNames(styles.button, styles.r)}
                            id={styles.button_1}
                          >
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={apiData?.is_reminder_webpush_allow}
                              name="is_reminder_webpush_allow"
                              onChange={handleNotification}
                            />
                            <div className={classNames(styles.knobs)}></div>
                            <div className={styles.layer}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* <img
                        src="/images/SettingsImage/Divider.png"
                        alt=""
                        width="100%"
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default notifications;
