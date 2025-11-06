import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { API_CONFIG } from "../Api-Config";
import { exportToExcel } from "../utils/exportToExcel";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlySalesResponse {
  total: number;
  labels: string[];
  chartData: number[];
}

const MonthlySalesChart: React.FC = () => {
  const [salesData, setSalesData] = useState<MonthlySalesResponse>({
    total: 0,
    labels: [],
    chartData: [],
  });
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSales = async (month: number, year: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("login_token");
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/payments/monthly-sales?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) setSalesData(response.data);
    } catch (error) {
      console.error("Failed to fetch monthly sales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(month, year);
  }, [month, year]);

  const data = {
    labels: salesData.labels,
    datasets: [
      {
        label: "Sales",
        data: salesData.chartData,
        borderColor: "rgba(1, 3, 3, 1)",
        backgroundColor: "rgba(232, 12, 26, 0.96)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: `Monthly Sales - ${month}/${year}` },
    },
  };

  const handleExport = () => {
    const excelData = salesData.labels.map((label, index) => ({
      Date: label,
      Sales: Number(salesData.chartData[index]), // ✅ Convert to number
    }));

    // Add total row
    excelData.unshift({
      Date: "TOTAL",
      Sales: Number(salesData.total),
    });

    exportToExcel(excelData, `monthly_sales_${month}_${year}.xlsx`);
  };


  return (
    <div className="card card-primary card-round p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Monthly Sales</h5>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "short" })}
              </option>
            ))}
          </select>
          <select
            className="form-select form-select-sm"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={year - i}>
                {year - i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : (
        <>
          <div className="mb-2">
            <h3>Total Sales: RM {salesData.total.toFixed(2)}</h3>
          </div>
          <Line data={data} options={options} />
        </>
      )}
    </div>
    
  );
};

export default MonthlySalesChart;
