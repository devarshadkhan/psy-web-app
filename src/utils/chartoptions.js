/**
 * 
 * @param {Data on X axis of type array} xData 
 * @param {Data on Y axis of type array} data 
 * @returns It provides object for echart-for-react Bar Graph 
 *          option by applying dynamic data on x axis and y axis
 */

export const BarChartOption = (xData, data) => {
  return {
    title: {
      show: data.length > 0 && xData.length > 0 ? false: true,
      textStyle:{
        color:'#bcbcbc'
      },
      text: 'We dont have enough data to show',
      left: 'center',
      top: 'center'
    },
    grid: {
      top: 8,
      bottom: 20,
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      data: xData, //
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#e9e9e9",
        },
      },
      interval: 0.5,
      splitNumber: 5,
      axisLabel: {
        formatter: function (value, index) {
          if (value % 0.5 === 0) {
            return value;
          } else {
            return "";
          }
        },
      },
    },
    series: [
      {
        type: "bar",
        itemStyle: {
          color: "#3C72FE",
        },
        data: data,
        barWidth: 10,
      },
    ],
  };
};

/**
 * 
 * @param {Data on X axis of type array} data 
 * @param {Data on Y axis of type array} data2 
 * @returns It provides object for echart-for-react Line Graph 
 *          option by applying dynamic data on x axis and y axis
 */

export const LineChartOptions = (data, data2) => {
  const option = {
    title: {
      show: data.length > 0 && data2.length > 0 ? false: true,
      textStyle:{
        color:'#bcbcbc'
      },
      text: 'We dont have enough data to show',
      left: 'center',
      top: 'center'
    },
    grid: {
      left: 0,
      right: 0,
      top: "2%",
      bottom: "2%",
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: data2,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        alignWithLabel: true,
        lineStyle: {
          width: 1,
          color: "#DCE4E8",
          type: "dashed",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        interval: 0, // set interval to 0 to display all labels
        margin: 10, // set margin to adjust the distance between the label and split line
        formatter: function (value, index) {
          return " " + value;
        },
      },
      splitLine: {
        show: true,
        alignWithLabel: false,
        lineStyle: {
          width: 2,
          color: "#DCE4E8",
        },
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        axis: "x",
        snap: true,
      },
      position: (point, params, dom, rect, size) => {
        const offset = 60;
        const xPos = point[0] - offset + 10;
        const yPos = point[1] - offset;
        return [xPos, yPos];
      },
      className: "pointer-tooltip",
      formatter: (params) => {
        return `
          <div className="chart-tooltipLabel">Total Earnings</div>
          <div className="chart-tooltipCustom">$ ${params[0].value}</div>
      `;
      },
    },
    series: [
      {
        data: data,
        type: "line",
        showSymbol: true,
        lineStyle: {
          width: 4,
          color: "#217EFD",
        },
        smooth: true,
        emphasis: {
          itemStyle: {
            color: "white",
            borderWidth: 2,
            opacity: 1,
          },
        },
        itemStyle: {
          color: "#217EFD",
          opacity: 0,
        },
      },
    ],
  };
  return option;
};



export const barChart2Option = () => {
  const colors = ["#9EA3AE", "#9EA3AE", "#384046", "#9EA3AE"];
  return {
    grid: {
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      containLabel: true,
      height: "50px",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu"],
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    series: [
      {
        data: [20, 20, 50, 80],
        type: "bar",

        itemStyle: {
          barBorderRadius: [4, 4, 0, 0], // top-left and top-right corners are rounded
          color: (params) => colors[params.dataIndex],
        },
      },
    ],
  };
};

export const barLineChartOption = () => {
  const data1 = [1000, 2000, 3000, 4000, 5100, 4400, 3000];
  const data2 = [2000, 3000, 4000, 5000, 6100, 5100, 3000];
  const maxVal = Math.max(...[...data1, ...data2]);
  return {
    grid: {
      top: 10,
      bottom: 40,
      left: 40,
      right: 0,
    },
    xAxis: {
      type: "category",
      data: ["Jan", "Fab", "Mar", "Apr", "May", "Jun", "Jul"],
      dataZoom: [
        {
          type: "slider",
        },
      ],
      axisLabel: {
        show: true, // show the x-axis label
        fontSize: 14,
        color: "#384046",
        fontFamily: "Nexa-Bold",
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#ccc",
          width: 1,
          type: "solid",
        },
        emphasis: {
          lineStyle: {
            color: "#999",
            width: 2,
            type: "solid",
            borderRadius: 10, // set the border radius here
          },
        },
        alignWithLabel: true,
      },
      lineStyle: {
        color: "transparent", // set the line color to transparent
      },
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "#2196f3", // set the start color
            },
            {
              offset: 1,
              color: "#42a5f5", // set the end color
            },
          ],
        },
        borderColor: "blue", // set the border color of the bars
        shadowBlur: 10, // set the shadow blur radius
        shadowColor: "rgba(0, 0, 0, 0.3)", // set the shadow color
      },
      emphasis: {
        splitLine: {
          show: false,
        },
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#e53935", // set the start color on hover
              },
              {
                offset: 1,
                color: "#f44336", // set the end color on hover
              },
            ],
          },
          borderColor: "red", // set the border color of the bars on hover
          shadowBlur: 20, // set the shadow blur radius on hover
          shadowColor: "rgba(0, 0, 0, 0.5)", // set the shadow color on hover
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        show: true, // show the x-axis label
        fontSize: 14,
        color: "#384046",
        fontFamily: "Nexa-Bold",
        formatter: function (value) {
          let data = `${value}`;
          if (value > 999 && value < 100000) {
            data = value / 1000;
          }
          return `$${data}k`;
        },
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        return params[0].name + ": " + params[0].value;
      },
    },
    series: [
      {
        name: "Line 1",
        type: "line",
        data: data1,
        symbolSize: 12,
        smooth: true,
        emphasis: {
          itemStyle: {
            color: "white",
            borderWidth: 2,
            opacity: 1,
          },
        },
        itemStyle: {
          color: "black",
          opacity: 0,
        },
        lineStyle: {
          color: "black",
          width: 2,
        },
      },
      {
        name: "Line 2",
        type: "line",
        data: data2,
        symbolSize: 12,
        smooth: true,
        emphasis: {
          itemStyle: {
            color: "white",
            borderWidth: 2,
            opacity: 1,
          },
        },
        itemStyle: {
          color: "#217EFD",
          opacity: 0,
        },
        lineStyle: {
          color: "#217EFD",
          width: 2,
        },
      },
    ],
  };
};

export const doghnutChart = () => {
  return {
    graphic: [
      {
        type: "image",
        left: "center",
        top: "center",
        bounding: "raw",
        style: {
          image: "/images/GlassGlobe.png",
          width: 56,
          height: 56,
        },
      },
    ],
    grid: {
      top: "60%",
    },

    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
        },
        data: [
          { value: 65.8, name: "Featured Ads", color: "#384046" },
          { value: 20.5, name: "Blog Ads", color: "#217EFD" },
          { value: 13.4, name: "Profesy Network Ads", color: "#17181A" },
        ],
        color: ["#384046", "#217EFD", "#17181A"],
      },
    ],
  };
};
