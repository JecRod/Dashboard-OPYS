import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_CONFIG } from "../Api-Config";

interface Order {
  id: number;
  name: string;
  item: string;
  quantity: number;
  order_type: string;
  status: string;
  status_payment: string;
}

export default function ContentOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ORDER}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let orderData = response.data;

        if (response.data?.data) {
          orderData = response.data.data;
        } else if (response.data?.orders) {
          orderData = response.data.orders;
        }

        if (!Array.isArray(orderData)) {
          throw new Error("Invalid data format received from server");
        }

        setOrders(orderData);
      } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
          ? err.message
          : "Unknown error occurred";

        console.error("Error fetching orders:", err);
        setError(`Failed to load orders: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Update Order Status
  const handleStatusUpdate = async (
    id: number,
    newStatus: string,
    name: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to perform this action");
        return;
      }

      setUpdatingId(id);
      toast.loading(`Updating status for "${name}"...`);

      await axios.put(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ORDER}/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.dismiss();
      toast.success(`Status updated to "${newStatus}"`);

      // Update UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      toast.dismiss();
      console.error("Error updating order:", err);

      let errorMessage = "Failed to update order status";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="page-inner">
      <div className="page-header">
        <h3 className="fw-bold mb-3">All Orders</h3>
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
            <a href="#">Orders</a>
          </li>
          <li className="separator">
            <i className="icon-arrow-right" />
          </li>
          <li className="nav-item">
            <a href="#">All Orders</a>
          </li>
        </ul>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Order List</div>
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
              <p className="mt-2">Loading orders...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-head-bg-success">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Order</th>
                    <th>Quantity</th>
                    <th>Order Type</th>
                    <th>Table No</th>
                    <th>Status Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.name}</td>
                        <td>{order.item}</td>
                        <td>{order.quantity}</td>
                        <td>{order.order_type}</td>
                        <td>
                          <span
                            className={`badge ${
                              order.status === "Process"
                                ? "bg-warning"
                                : order.status === "OnGoing"
                                ? "bg-info"
                                : order.status === "Completed"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {order.status}
                          </span>
                          
                        </td>
                        <td>{order.status_payment}</td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-primary btn-sm dropdown-toggle"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Change Status
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      order.id,
                                      "OnGoing",
                                      order.name
                                    )
                                  }
                                  disabled={updatingId === order.id}
                                >
                                  OnGoing
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      order.id,
                                      "Completed",
                                      order.name
                                    )
                                  }
                                  disabled={updatingId === order.id}
                                >
                                  Completed
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      order.id,
                                      "Cancel",
                                      order.name
                                    )
                                  }
                                  disabled={updatingId === order.id}
                                >
                                  Cancel
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        {error ? "Failed to load orders" : "No orders found"}
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
