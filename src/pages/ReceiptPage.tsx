import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "../Api-Config";

interface Payment {
  id: number;
  total_price: string;
  transaction_id: string;
  payment_method: string;
  status: string;
  created_at: string;
  order_id?: string | number;
  customer_name: string;
}


export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  console.log("ReceiptPage ID:", id);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("login_token");
        if (!token) throw new Error("Authentication token not found");

        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/payments/${id}/receipt`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("📨 API Response:", response.data); // ✅ Debug

        const data = response.data.receipt || response.data.data || response.data;

        setPayment({
          id: data.id,
          total_price: data.total_price,
          transaction_id: data.transaction_id,
          payment_method: data.payment_method,
          status: data.status,
          created_at: data.created_at,
          order_id: data.order_id ?? "", // handle missing
          customer_name: data.customer_name ?? "", // ✅ FIX HERE
        });
      } catch (err: any) {
        console.error(err);
        setError("Failed to load payment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);



  if (loading) return <p style={{ textAlign: "center" }}>Loading receipt...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!payment) return <p style={{ textAlign: "center" }}>No payment found.</p>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Opys Kitchen</h1>
          <p>Payment Receipt</p>
        </div>

        <div style={styles.content}>
          <h2>Hi there,</h2>
          <p>Thank you for your order! Here’s a summary of your payment:</p>

          <table style={styles.table}>
            <tbody>
              <tr>
                <th>Name</th>
                <td>{payment.customer_name || "Unknown"}</td>
              </tr>
              <tr>
                <th>Transaction ID</th>
                <td>{payment.transaction_id || "Unknown"}</td>
              </tr>
              <tr>
                <th>Order ID</th>
                <td>{payment.order_id}</td>
              </tr>
              <tr>
                <th>Payment Method</th>
                <td>{payment.payment_method}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td style={{ color: "green", fontWeight: "bold" }}>
                  {payment.status}
                </td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{new Date(payment.created_at).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div style={styles.total}>
            Total Paid: RM {Number(payment.total_price).toFixed(2)}
          </div>

          <p style={{ marginTop: 20 }}>
            If you have any questions about your order, feel free to{" "}
            <a href="mailto:support@burgersystem.com">contact us</a>.
          </p>
        </div>

        <div style={styles.footer}>
          <p>Thank you for choosing <strong>Our Restaurant</strong> 🍔</p>
          <p>© {new Date().getFullYear()} Opys Kitchen. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    background: "#f4f4f7",
    padding: "20px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: "600px",
    background: "#fff",
    margin: "30px auto",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  header: {
    background: "#4CAF50",
    padding: "20px",
    textAlign: "center",
    color: "#fff",
  },
  content: {
    padding: "30px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  total: {
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "right",
    padding: "15px",
    background: "#f9f9f9",
    borderTop: "2px solid #4CAF50",
  },
  footer: {
    padding: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#777",
    background: "#fafafa",
    borderTop: "1px solid #eee",
  },
};
