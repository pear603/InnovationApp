// BarChartComponent.jsx
import { Bar } from "react-chartjs-2";

export default function BarChart({ data }) {
  if (!data) return <p>Loading Bar Chart...</p>;
  return <Bar key="barChart" data={data} options={{ responsive: true }} />;
}
