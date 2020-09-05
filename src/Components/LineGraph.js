import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar($) sign in the ticks
          callback: function (value) {
            return numeral(value).format("0 a");
          },
        },
      },
    ],
  },
};
function LineGraph({ className, casesType = "cases" }) {
  const [data, setData] = useState({});
  const buildChartData = (data, casesType) => {
    //we have a 3 types of cases todays cases ,todays recovered cases and todays deaths and if not passed then default will be cases
    const chartData = [];
    let lastDatePoint;
    for (let date in data.cases) {
      if (lastDatePoint) {
        const newDataPoint = {
          x: date, //creating x variable
          y: data[casesType][date] - lastDatePoint, //creating y variable having number of cases increased
        };
        chartData.push(newDataPoint);
      }
      lastDatePoint = data[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChartData(data, casesType); //default case type is cases
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);
  return (
    <div className="app__graph">
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                data: data,
                backgroundColor: "rgba(204,16,52,0.5)",
                borderColor: "#CC1034",
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
