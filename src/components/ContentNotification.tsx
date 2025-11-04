import { useEffect, useState } from "react";
import axios from "axios";
import { API_CONFIG } from "../Api-Config";
import toast from "react-hot-toast";

interface Notification {
  id: number;
  type: string;
  order_id: number | null;
  title: string;
  message: string;
  is_read: number;
  created_at: string;
}

export default function ContentNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("login_token");
        if (!token) throw new Error("Authentication token not found");

        const res = await axios.get(
          API_CONFIG.BASE_URL + API_CONFIG.ENDPOINT.NOTIFICATION,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setNotifications(res.data.data || []);
      } catch (err: any) {
        console.error("Failed to load notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);



const handleMarkAsRead = async (id: number) => {
  const token = localStorage.getItem("login_token");
  if (!token) return;

  try {
    await axios.put(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.MARK_READ(id)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Update UI immediately
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, is_read: 1 } : notif
      )
    );

    // ✅ Show success message
    toast.success(" Notification marked as read");
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
    toast.error("❌ Failed to mark notification as read");
  }
};




  return (
    <div className="page-inner">
        <div className="page-header">
        <h3 className="fw-bold mb-3">📩 Notifications</h3>
        <ul className="breadcrumbs mb-3">
          <li className="nav-home">
            <a href="#"><i className="icon-home" /></a>
          </li>
          <li className="separator"><i className="icon-arrow-right" /></li>
          <li className="nav-item"><a href="#">Notification</a></li>
          <li className="separator"><i className="icon-arrow-right" /></li>
          <li className="nav-item"><a href="#">All Notification</a></li>
        </ul>
      </div>

        
      

      <div className="card">
        <div className="card-body">
          {loading && <p>Loading notifications...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && notifications.length === 0 && (
            <p className="text-center text-muted">No notifications found.</p>
          )}

          {!loading && notifications.length > 0 && (
            <div className="list-group">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`list-group-item d-flex justify-content-between align-items-start ${
                    n.is_read ? "bg-light" : "bg-white"
                  }`}
                >
                  <div>
                    <h5 className="mb-1">
                      {n.title}{" "}
                      {!n.is_read && (
                        <span className="badge bg-primary ms-2">New</span>
                      )}
                    </h5>
                    <p className="mb-1">{n.message}</p>
                    <small className="text-muted">
                      {new Date(n.created_at).toLocaleString()}
                    </small>
                  </div>

                  <div className="ms-3 d-flex flex-column align-items-end">
                    {n.order_id && (
                      <a
                        href={`/order`}
                        className="btn btn-sm btn-outline-success mb-2"
                      >
                        View Order
                      </a>
                    )}
                    {!n.is_read && (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleMarkAsRead(n.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
