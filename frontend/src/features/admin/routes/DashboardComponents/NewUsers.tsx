import React from "react";
import ReactApexChart from "react-apexcharts";

export const NewUsers = () => {
    const [state, setState] = React.useState({
      
        series: [{
          name: 'New Users',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
          name: 'Revenue',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }],
        options: {
          chart: {
            type: 'bar',
            height: 200
          },
          grid: {
            show: false, 
          },
          colors: ['#CB3CFF', '#00C2FF'],
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              borderRadius: 5,
              borderRadiusApplication: 'end'
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: ['12AM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM'],
            labels: {
                style: {
                  colors: '#FFFFFF'  
                }
              }
          },
          yaxis: {
            title: {
              text: '$ (thousands)'
            },
            labels: {
                style: {
                  colors: '#FFFFFF'  
                }
              }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return " " + val + " thousands"
              }
            }
          }
        },
      
      
    });

    

    return (
      <div>
        <div id="chart">
            <ReactApexChart options={state.options} series={state.series} type="bar" height={200} />
          </div>
        <div id="html-dist"></div>
      </div>
    );
  }
