// PieChartComponent.jsx
import { Pie } from "react-chartjs-2";

export default function PieChart({ data }) {
  if (!data) return <p>Loading Pie Chart...</p>;
  return <Pie key="pieChart" data={data} options={{ responsive: true }} />;
}
