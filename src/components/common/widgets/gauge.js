import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import GaugeStyling from "@/styles/components/common/widget/Gauge.module.css";

const GaugeComponent = ({ value }) => {
  return (
    <div className={GaugeStyling.container}>
      <CircularProgressbar
        value={value}
        strokeWidth={14}
        className={GaugeStyling.CircularProgressBarWrapper}
        styles={{
          svg: {
            padding: "10px",
          },
          path: {
            stroke: `#FFE1D7`,
            strokeLinecap: "butt",
          },
          trail: {
            strokeWidth: "10px",
            stroke: "rgba(56, 64, 70, 1)",
          },
          text: {
            margin: "20px",
            fill: "#4a4a4a",
            fontSize: "16px",
          },
        }}
      />
      <div
        className={GaugeStyling.gaugeNeedle}
        style={{ transform: `rotate(${value * 3.6}deg)` }}
      ></div>
      <div className={GaugeStyling.coverCircle}></div>
      <div className={GaugeStyling.centerCircle}></div>
    </div>
  );
};

export default GaugeComponent;
