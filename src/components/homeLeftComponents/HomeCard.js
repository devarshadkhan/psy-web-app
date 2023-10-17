import styles from "@/styles/components/homecard/HomeCard.module.css";
import RightArrow from "../icons/RightArrow";
import Link from "next/link";
import classNames from "classnames";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function HomeCards({
  cardHeading,
  cardContent,
  isClient = false,
  cardSubContent,
  cardBtn,
  helperText,
  userInfo,
  tooltip,
  link,
}) {
  return (
    <div className={"card " + styles.cardSize}>
      <div className={"card-header " + styles.cardHeader}>{cardHeading}</div>
      <div className="card-body text-center w-100 p-0 mt-3 d-flex align-items-center justify-content-end flex-column">
        <h5 className={"card-title " + styles.cardContent}>{cardContent}</h5>
        <p className={"card-text " + styles.cardSubContent}>{cardSubContent}</p>
        <hr className={`${styles.cardLine} w-100`} />
        <OverlayTrigger
          trigger={["hover"]}
          placement="left"
          overlay={
            !userInfo?.isEmailVerified ? (
              tooltip
            ) : !isClient && !userInfo?.is_stripe_setup ? (
              <Tooltip id="tooltip">
                <strong>Please Setup your account</strong>
              </Tooltip>
            ) : (
              <></>
            )
          }
        >
          <Link
            href={
              (isClient && userInfo?.isEmailVerified) ||
              (!isClient &&
                userInfo?.isEmailVerified &&
                userInfo?.is_stripe_setup)
                ? link
                : "#"
            }
            className={classNames(
              "btn btn-primary py-2 ",
              (isClient && userInfo?.isEmailVerified) ||
                (!isClient &&
                  userInfo?.isEmailVerified &&
                  userInfo?.is_stripe_setup)
                ? ""
                : styles.diabledBtn,
              styles.cardBtn
            )}
          >
            {cardBtn} &nbsp; &nbsp; <RightArrow />
          </Link>
        </OverlayTrigger>
      </div>
    </div>
  );
}

export default HomeCards;
