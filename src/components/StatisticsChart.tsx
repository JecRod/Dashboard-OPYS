import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_CONFIG } from "../Api-Config";

// Register chart.js modules
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

export default function StatisticsChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call your Laravel API (make sure endpoint exists)
        const res = await axios.get(
          API_CONFIG.BASE_URL + "/sales-stats"
        );

        setLabels(res.data.labels);   // e.g. ["Jan", "Feb", "Mar"]
        setValues(res.data.values);   // e.g. [120, 300, 150]
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: values,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4, // smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Monthly Sales" },
    },
  };

  return (
    <div className="card-body">
      <div className="chart-container" style={{ minHeight: 375 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
