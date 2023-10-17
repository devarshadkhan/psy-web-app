import React from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/Home.module.css";
import { useEffect } from "react";
const Loader = () => {
  const isLoading = useSelector((state) => state.loader.loader);
  //   const isLoading = false; //useSelector((state) => state.loader);
  useEffect(() => {
    if (isLoading) {
      document.body.classList.add(styles["blur-background"]);
    } else {
      document.body.classList.remove(styles["blur-background"]);
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <div className={styles.loaderComp}>
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
