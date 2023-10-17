

import React from "react";
import styles from "@/styles/client/settings/EditProfile.module.css";
import classNames from "classnames";
import { useRouter } from "next/router";
import Link from "next/link";

const Data = [
  {
    id: 1,
    icon: "/images/SettingsImage/icons/user-edit.svg",
    label: "Edit Psychic Profile",
    path: "/professional/settings",
  },
  {
    id: 2,
    icon: "/images/SettingsImage/icons/security.svg",
    label: "Security",
    path: "/professional/settings/security",
  },
  // {
  //   id: 3,
  //   icon: "/images/SettingsImage/icons/card.svg",
  //   label: "Payments",
  //   // path: "/professional/settings/wallet",
  //   path: "/professional/settingspayment/subscribeprofesy",
  // },
  {
    id: 4,
    icon: "/images/SettingsImage/icons/bell.svg",
    label: "Notifications",
    path: "/professional/settings/notifications",
  },
  {
    id: 5,
    icon: "/images/SettingsImage/icons/plus.svg",
    label: "Profesy+",
    path: "/professional/settings/profesy",
  },
];

const ProfessionalSidebar = () => {
  const router = useRouter();
  return (
    <>
      <section className={styles.edit_sidebar}>
        {Data.map((ele) => {
          return (
            <>
              <Link
                href={ele.path}
                className={classNames(
                  styles.edit_profile_name,
                  router.pathname === ele.path ? styles.active : "" )}
                key={ele.id}
              >
                <img src={ele.icon} alt="" />
                <p
                  className={classNames(
                    styles.edit_profile_name,
                    router.pathname === ele.path
                      ? styles.active
                      : ""
                  )}
                >
                  {ele.label}
                </p>
              </Link>
            </>
          );
        })}
      </section>
    </>
  );
};

export default ProfessionalSidebar;