import React from "react";
import ReactApexChart from "react-apexcharts";

export const TotalRevenue = () => {
  const [state, setState] = React.useState({
    series: [
      {
        name: "revenue",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "revenue",
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    options: {
      chart: {
        height: 400,
        type: "area",
      },
      colors: ['#CB3CFF', '#00C2FF'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        labels: {
            style: {
              colors: '#FFFFFF'  
            }
          },
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
      yaxis: {
        labels: {
            style: {
              colors: '#FFFFFF'  
            }
          }
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      grid: {
        show: false, 
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="area"
          height={400}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};
