import { useEffect, useState } from "react";
import { API_CONFIG } from "../Api-Config";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ Import toast

interface Payment {
  id: number;
  customer_name: string;
  customer_email: string;
  total_price: number;
  transaction_id: string;
  created_at: string;
  payment_method: string;
  status: string;
}

export default function ContentPayment() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  // ✅ Fetch all payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("login_token");
        if (!token) throw new Error("Authentication token not found");

        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.PAYMENT}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const paymentData =
          response.data.data || response.data.payments || response.data;

        if (!Array.isArray(paymentData)) {
          throw new Error("Invalid data format received from server");
        }

        setPayments(paymentData);
      } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
          ? err.message
          : "Unknown error occurred";

        console.error("Error fetching payments:", err);
        setError(`Failed to load payments: ${errorMessage}`);
        toast.error(`❌ ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // ✅ Update payment status
  const handleStatusChange = async (id: number, newStatus: string) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;

    try {
      const token = localStorage.getItem("login_token");
      if (!token) throw new Error("Authentication token missing.");

      await axios.put(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.PAYMENT}/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ Update UI instantly
      setPayments((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: newStatus } : p
        )
      );

      toast.success(`✅ Status updated to "${newStatus}"`);
    } catch (err) {
      console.error("Failed to update payment status:", err);
      toast.error("❌ Failed to update payment status.");
    }
  };

  // ✅ Delete payment
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    try {
      const token = localStorage.getItem("login_token");
      await axios.delete(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.PAYMENT}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayments((prev) => prev.filter((p) => p.id !== id));
      toast.success("🗑️ Payment deleted successfully!");
    } catch (err) {
      console.error("Failed to delete payment:", err);
      toast.error("❌ Failed to delete payment.");
    }
  };

  return (
    <div className="page-inner">
      <div className="page-header">
        <h3 className="fw-bold mb-3">All Payments</h3>
        <ul className="breadcrumbs mb-3">
          <li className="nav-home">
            <a href="#">
              <i className="icon-home" />
            </a>
          </li>
          <li className="separator">
            <i className="icon-arrow-right" />
          </li>
          <li className="nav-item">
            <a href="#">Payments</a>
          </li>
        </ul>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Payment List</div>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <p>Loading payments...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-head-bg-success">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Total Price</th>
                    <th>Transaction ID</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Delete</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.customer_name || "—"}</td>
                        <td>{p.customer_email || "—"}</td>
                        <td>RM {p.total_price}</td>
                        <td>{p.transaction_id}</td>
                        <td>{p.payment_method}</td>

                        {/* ✅ Status dropdown */}
                        <td>
                          <div className="btn-group">
                            <button
                              className={`btn btn-sm dropdown-toggle ${
                                p.status === "paid"
                                  ? "btn-success"
                                  : p.status === "pending"
                                  ? "btn-warning"
                                  : "btn-secondary"
                              }`}
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {p.status}
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    handleStatusChange(p.id, "pending")
                                  }
                                >
                                  Pending
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    handleStatusChange(p.id, "paid")
                                  }
                                >
                                  Paid
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    handleStatusChange(p.id, "failed")
                                  }
                                >
                                  Failed
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() =>
                                    handleStatusChange(p.id, "cancelled")
                                  }
                                >
                                  Cancelled
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>

                        <td>{new Date(p.created_at).toLocaleDateString()}</td>

                        {/* ✅ Delete button */}
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(p.id)}
                          >
                            Delete
                          </button>
                        </td>

                        {/* ✅ Receipt button */}
                        <td>
                          <Link
                            to={`/receipt/${p.id}`}
                            className="btn btn-primary btn-sm"
                          >
                            View Receipt
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center">
                        No payment records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
