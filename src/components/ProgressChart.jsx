// components/IncomeProgressChart.jsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

const ProgressChart = ({ progressData }) => {
  if (!progressData?.chartData) return <p>No data available</p>;

  return (
    <div className="w-64 h-64 relative flex items-center justify-center">
      <Doughnut
        data={progressData.chartData}
        options={{
          cutout: "70%",
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
        }}
      />
      <div className="absolute text-center">
        <p className="text-lg font-semibold">{progressData.progress.toFixed(1)}%</p>
        <p className="text-sm text-gray-500">of goal</p>
      </div>
    </div>
  );
};

export default ProgressChart;
