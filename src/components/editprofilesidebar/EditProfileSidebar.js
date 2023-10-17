import React, { useEffect, useState } from "react";
import styles from "@/styles/client/settings/EditProfile.module.css";
import classNames from "classnames";
import { useRouter } from "next/router";
import Link from "next/link";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Data = [
  {
    id: 1,
    icon: "/images/SettingsImage/icons/user-edit.svg",
    label: "Edit Profile",
    path: "/client/settings",
  },
  {
    id: 2,
    icon: "/images/SettingsImage/icons/security.svg",
    label: "Security",
    path: "/client/settings/security",
  },
  {
    id: 3,
    icon: "/images/SettingsImage/icons/card.svg",
    label: "Wallet",
    path: "/client/settings/wallet",
  },
  {
    id: 4,
    icon: "/images/SettingsImage/icons/bell.svg",
    label: "Notifications",
    path: "/client/settings/notifications",
  },
];

const EditProfileSidebar = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userProfile = localStorage.getItem("userInfo");
    if (userProfile) {
      setUserData(JSON.parse(userProfile));
    }
  }, []);

  return (
    <>
      <section className={styles.edit_sidebar}>
        {Data.map((ele) => {
          return (
            <>
              <OverlayTrigger
                trigger={["hover"]}
                placement="left"
                overlay={
                  ele?.path === "/client/settings/wallet" &&
                  !userData?.isEmailVerified ? (
                    <Tooltip id="tooltip">
                      <strong>Please verify your email</strong>
                    </Tooltip>
                  ) : (
                    <></>
                  )
                }
              >
                <Link
                  href={
                    ele?.path === "/client/settings/wallet" &&
                    !userData?.isEmailVerified
                      ? "#"
                      : ele.path
                  }
                  className={classNames(
                    styles.edit_profile_name,

                    router.pathname === ele.path ? styles.active : ""
                  )}
                  key={ele.id}
                >
                  <img src={ele.icon} alt="" />
                  <p
                    className={classNames(
                      styles.edit_profile_name,
                      ele?.path === "/client/settings/wallet" &&
                        !userData?.isEmailVerified
                        ? "disabled-text"
                        : "",
                      router.pathname === ele.path ? styles.active : ""
                    )}
                  >
                    {ele.label}
                  </p>
                </Link>
              </OverlayTrigger>
            </>
          );
        })}

        {/* <Link
          href="/client/settings/security"
          className={classNames(
            styles.edit_profile_name,
            router.pathname === "/client/settings/security" ? styles.active : ""
          )}
        >
          <img src="/images/SettingsImage/icons/security.svg" alt="" />
          <p
            className={classNames(
              styles.edit_profile_name,
              router.pathname === "/client/settings/security"
                ? styles.active
                : ""
            )}
          >
            Security
          </p>
        </Link>

        <Link
          href="/client/settings/wallet"
          className={classNames(
            styles.edit_profile_name,
            router.pathname === "/client/settings/wallet" ? "active" : ""
          )}
        >
          <img src="/images/SettingsImage/icons/card.svg" alt="" />
          <p
            className={classNames(
              styles.edit_profile_name,
              router.pathname === "/client/settings/wallet" ? styles.active : ""
            )}
          >
            Wallet
          </p>
        </Link>

        <Link
          href="/client/settings/notifications"
          className={classNames(
            styles.edit_profile_name,
            router.pathname === "/client/settings/notifications" ? "active" : ""
          )}
        >
          <img src="/images/SettingsImage/icons/bell.svg" alt="" />
          <p
            className={classNames(
              styles.edit_profile_name,
              router.pathname === "/client/settings/notifications"
                ? styles.active
                : ""
            )}
          >
            Notifications
          </p>
        </Link> */}
      </section>
    </>
  );
};

export default EditProfileSidebar;
