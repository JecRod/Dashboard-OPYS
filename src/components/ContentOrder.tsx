import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_CONFIG } from "../Api-Config";

interface OrderItem {
  item_id: number;
  item_name: string;
  quantity: number;
  subtotal_price: string;
  special_request: string | null;
}

interface Order {
  order_id: number;
  customer_name: string;
  total_price: string;
  order_type: string;
  status: string;
  items: OrderItem[];
}

export default function ContentOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch Orders (only non-hall)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("login_token");
        if (!token) throw new Error("Authentication token not found");

        const res = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ORDER}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ Filter out hall orders
        const nonHallOrders = (res.data.data || []).filter(
          (order: Order) => order.order_type !== "hall"
        );

        setOrders(nonHallOrders);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ Delete Order
  const handleDelete = async (orderId: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("login_token");
      await axios.delete(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ORDER}/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order deleted successfully");
      setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete order");
    }
  };

  // ✅ Change Status
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("login_token");
      if (!token) throw new Error("Authentication token not found");

      await axios.put(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ORDER}/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(`Status updated to "${newStatus}"`);

      // ✅ Update UI instantly
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="page-inner">
      <div className="page-header">
        <h3 className="fw-bold mb-3">All Orders</h3>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Order List (Food Only)</div>
        </div>

        <div className="card-body">
          {loading && <p>Loading orders...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && (
            <div className="table-responsive">
              <table className="table table-head-bg-success">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Order</th>
                    <th>Total Quantity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => {
                      const orderDetails = order.items
                        .map((item) => `${item.item_name} x${item.quantity}`)
                        .join(", ");

                      const totalQty = order.items.reduce(
                        (sum, item) => sum + (item.quantity || 0),
                        0
                      );

                      return (
                        <tr key={order.order_id}>
                          <td>{order.order_id}</td>
                          <td>{order.customer_name}</td>
                          <td>{orderDetails}</td>
                          <td>{totalQty}</td>
                          <td>
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-outline-primary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                {order.status}
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() =>
                                      handleStatusChange(order.order_id, "Process")
                                    }
                                  >
                                    Process
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() =>
                                      handleStatusChange(order.order_id, "OnGoing")
                                    }
                                  >
                                    OnGoing
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() =>
                                      handleStatusChange(order.order_id, "Completed")
                                    }
                                  >
                                    Completed
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() =>
                                      handleStatusChange(order.order_id, "Cancelled")
                                    }
                                  >
                                    Cancelled
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(order.order_id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No food orders found
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
