import styles from "@/styles/Home.module.css";
import classNames from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

const ThankYou = () => {
  const router = useRouter();
  const heandleClick = () => {
    router.push("/professional/login");
  };
  return (
    <>
      <Head>
        <title>Psychix | Registration</title>
        <meta name="description" content="Psychix | Registration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={classNames(styles.main)}>
        <div className="container-fluid">
          <div className={styles.logoDiv}>
            <img className={styles.logo} src="/images/logo.svg" />
          </div>
          <hr className={classNames(styles.hrLine, "m-0")} />
          <div className="row">
            <div className={classNames(styles.leftDiv, "col-sm-6 p-0")}>
              <div className={classNames(styles.formWrapper, "w-100")}>
                <div
                  className={
                    styles.formDiv + " d-flex align-items-center " + " h-100"
                  }
                >
                  <div className={classNames(styles.thankyouContainer)}>
                    <div className={classNames(styles.thankyouTitle)}>
                      Thanks for signing up!
                    </div>
                    <div className={classNames(styles.thankyouDesc)}>
                      Psychix is nearing its launch and the moment it does you
                      will be the first to know. Verify your email to get first
                      dibs on our “Preferred Psychic” spots.
                    </div>
                    <div className="d-flex gap-5 mt-5 align-items-center">
                      <p className="m-0">I have verified take me to login</p>
                      <button
                        onClick={heandleClick}
                        className="btn btn-dark btn-block signupBtn rounded-2 w-25"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                styles.rightDiv,
                " d-flex align-items-center justify-content-end col-sm-6 p-0 "
              )}
            >
              <img
                src={"/images/Signuppage8.svg"}
                className={classNames(styles.pageImage)}
                alt=""
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ThankYou;
