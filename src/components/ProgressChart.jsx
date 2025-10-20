// components/IncomeProgressChart.jsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

const ProgressChart = ({ progressData, variant}) => {
    if (!progressData?.chartData) return <p>No data available</p>;

  const { progress, exceedPercent = 0 } = progressData;

  const isExceeded = progress > 100;

  let mainText = "";
  let subText = "";

  if (variant === "income") {
    if (isExceeded) {
      mainText = `+${(progress - 100).toFixed(1)}%`;
      subText = "over goal";
    } else {
      mainText = `${progress.toFixed(1)}%`;
      subText = "of goal";
    }
  } else if (variant === "expense") {
    if (isExceeded) {
      mainText = `${(100 - progress).toFixed(1)}%`;
      subText = "over budget";
    } else {
      mainText = `${progress.toFixed(1)}%`;
      subText = "of budget";
    }
  } else {
    // default case
    mainText = `${progress.toFixed(1)}%`;
    subText = "of goal";
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <Doughnut
        data={progressData.chartData}
        options={{
          cutout: "70%",
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
      <div className="absolute text-center">
        <p
          className={`text-lg font-semibold ${
            isExceeded && variant === "expense" ? "text-red-500" : ""
          } ${isExceeded && variant === "income" ? "text-green-600" : ""}`}
        >
          {mainText}
        </p>
        <p className="text-sm text-gray-500">{subText}</p>
      </div>
    </div>
  );
};

export default ProgressChart;