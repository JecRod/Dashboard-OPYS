import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_CONFIG } from "../Api-Config";


interface OrderItem {
  hall_id?: number | null;
  hall_name?: string;
  booking_hall_date?: string;
  quantity: number;
  subtotal_price: string;
  special_request?: string;
}

interface Order {
  order_id: number;
  customer_name: string;
  total_price: string;
  order_type: string;
  status: string;
  items: OrderItem[];
}

export default function ContentOrderHall() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // 🔹 Fetch Hall Orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("login_token");
      const res = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ORDER}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const hallOrders = (res.data.data || []).filter(
        (o: Order) => o.order_type === "hall"
      );

      
      
      setOrders(hallOrders);
    } catch (err) {
      console.error(err);
      setError("Failed to load hall orders ❌");
      toast.error("Failed to load hall orders ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete Order
  const handleDelete = async (orderId: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      setProcessingId(orderId);
      const token = localStorage.getItem("login_token");
      await axios.delete(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ORDER}/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
      toast.success("Order deleted successfully ✅");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order ❌");
    } finally {
      setProcessingId(null);
    }
  };

  // 🔹 Mark as Completed
  const handleMarkCompleted = async (orderId: number) => {
    try {
      setProcessingId(orderId);
      const token = localStorage.getItem("login_token");
      await axios.put(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ORDER}/${orderId}`,
        { status: "Completed" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, status: "Completed" } : o
        )
      );
      toast.success("Order marked as completed ✅");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status ❌");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="page-inner">
      <div className="page-header">
        <h3 className="fw-bold mb-3">Hall Orders</h3>
        <ul className="breadcrumbs mb-3">
          <li className="nav-home">
            <a href="#"><i className="icon-home" /></a>
          </li>
          <li className="separator"><i className="icon-arrow-right" /></li>
          <li className="nav-item"><a href="#">Orders</a></li>
          <li className="separator"><i className="icon-arrow-right" /></li>
          <li className="nav-item"><a href="#">Hall Orders</a></li>
        </ul>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Hall Order List</div>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading hall orders...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-head-bg-success">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Total (RM)</th>
                    <th>Status</th>
                    <th>Hall Name</th>
                    <th>Booking Date</th>
                    <th>Special Request</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order, index) => {
                      const hallItem = order.items[0];
                      return (
                        <tr key={order.order_id}>
                          <td>{index + 1}</td>
                          <td>{order.customer_name}</td>
                          <td>{parseFloat(order.total_price).toFixed(2)}</td>
                          <td>
                            <span
                              className={`badge ${
                                order.status.toLowerCase() === "completed"
                                  ? "bg-success"
                                  : order.status.toLowerCase() === "ongoing"
                                  ? "bg-warning text-dark"
                                  : "bg-secondary"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>{hallItem?.hall_name || "-"}</td>
                          <td>{hallItem?.booking_hall_date || "-"}</td>
                          <td>{hallItem?.special_request || "-"}</td>
                          <td>

                            {/* Mark Completed */}
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => handleMarkCompleted(order.order_id)}
                              disabled={processingId === order.order_id}
                            >
                              {processingId === order.order_id ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                <>
                                  <i className="fas fa-check"></i> Complete
                                </>
                              )}
                            </button>

                            {/* Delete */}
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(order.order_id)}
                              disabled={processingId === order.order_id}
                            >
                              {processingId === order.order_id ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                <>
                                  <i className="fas fa-trash-alt"></i> Delete
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center">
                        No hall orders found.
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
