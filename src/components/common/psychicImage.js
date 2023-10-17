import styles from "@/styles/Category.module.css";

const PsychicImage = ({ image, btn }) => {
  return (
    <div className={"p-3 " + styles.ImageC}>
      <img className={styles.pImage + " w-100"} src={image} />
      <img className={styles.pLogo} src="images/logo2.svg" />
      {btn ? <button className={"btn " + styles.imageBtn}>{btn}</button> : null}
    </div>
  );
};

export default PsychicImage;
