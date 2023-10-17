import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";

const ChartComponent = ({ option }) => {
  const [chartOptions, setChartOptions] = useState({});
  useEffect(() => {
    setChartOptions(option);
  }, [option]);

  return (
    <div className="chartContainer">
      <ReactEcharts
        option={chartOptions}
        echarts={echarts}
        className="chart custom-chartClass"
      />
    </div>
  );
};

export default ChartComponent;
