import { Link, useNavigate } from "react-router-dom";
import { API_CONFIG } from "../Api-Config";
import axios from "axios";
import { useEffect, useState } from "react";

interface Notification {
  id: number;
  type: string;
  order_id: number;
  title: string;
  message: string;
  is_read: number;
  created_at: string;
}

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(true);
  const [notifError, setNotifError] = useState<string | null>(null);

  const navigate = useNavigate();

  // ✅ Fetch user profile
    useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("login_token");

      // 🚨 If no token, redirect immediately
      if (!token) {
        console.warn("⚠️ No token found. Redirecting to login...");
        navigate("/login"); // ✅ redirect to login page
        return;
      }

      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.PROFILE}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.user);
      } catch (err: any) {
        console.error("❌ Failed to fetch user:", err.response?.data || err.message);

        // 🚨 If token invalid or expired, also redirect
        if (
          err.response?.status === 400 || // Token not provided
          err.response?.status === 401 || // Unauthorized
          err.response?.status === 404    // User not found
        ) {
          localStorage.removeItem("login_token");
          navigate("/login");
        }
      }
    };

    fetchUser();
  }, [navigate]);

  // ✅ Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotif(true);
        setNotifError(null);

        const token = localStorage.getItem("login_token");
        if (!token) throw new Error("Authentication token not found");

        const res = await axios.get(
          API_CONFIG.BASE_URL + API_CONFIG.ENDPOINT.NOTIFICATION,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setNotifications(res.data.data || []);
      } catch (err: any) {
        console.error("Failed to fetch notifications:", err);
        setNotifError("Failed to load notifications");
      } finally {
        setLoadingNotif(false);
      }
    };

    fetchNotifications();
  }, []);

  // ✅ Logout function
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("login_token");

    try {
      await axios.post(
        API_CONFIG.BASE_URL + API_CONFIG.ENDPOINT.LOGOUT,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Logout API failed:", err);
    }

    localStorage.removeItem("login_token");
    setUser(null);
    navigate("/login");
  };

  // ✅ Mark notification as read
  const handleMarkAsRead = async (id: number) => {
    const token = localStorage.getItem("login_token");
    if (!token) return;

    try {
      await axios.patch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.MARK_READ(id)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ Update UI: mark as read locally
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: 1 } : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // ✅ Only unread notifications
  const unreadNotifications = notifications.filter((n) => n.is_read === 0);

  return (
    <>
      <div className="main-header">
        <div className="main-header-logo">
          <div className="logo-header" data-background-color="dark">
            <a href="/" className="logo">
              <img
                src="assets/img/Opys/Opys.svg"
                alt="navbar brand"
                className="navbar-brand"
                height={20}
              />
            </a>
            <div className="nav-toggle">
              <button className="btn btn-toggle toggle-sidebar">
                <i className="gg-menu-right" />
              </button>
              <button className="btn btn-toggle sidenav-toggler">
                <i className="gg-menu-left" />
              </button>
            </div>
            <button className="topbar-toggler more">
              <i className="gg-more-vertical-alt" />
            </button>
          </div>
        </div>

        {/* 🔥 Navbar Header */}
        <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
          <div className="container-fluid">
            <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">

              {/* 🔔 Notifications Dropdown */}
              <li className="nav-item topbar-icon dropdown hidden-caret">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="notifDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fa fa-bell" />
                  {unreadNotifications.length > 0 && (
                    <span className="notification">
                      {unreadNotifications.length}
                    </span>
                  )}
                </a>

                <ul
                  className="dropdown-menu notif-box animated fadeIn"
                  aria-labelledby="notifDropdown"
                >
                  <li>
                    <div className="dropdown-title">
                      {loadingNotif
                        ? "Loading..."
                        : notifError
                        ? notifError
                        : `You have ${unreadNotifications.length} unread notification${
                            unreadNotifications.length !== 1 ? "s" : ""
                          }`}
                    </div>
                  </li>
                  <li>
                    <div className="notif-scroll scrollbar-outer">
                      <div className="notif-center">
                        {unreadNotifications.length > 0 ? (
                          unreadNotifications.map((n) => (
                            <a
                              href="#"
                              key={n.id}
                              onClick={(e) => {
                                e.preventDefault();
                                handleMarkAsRead(n.id);
                                navigate(`/order/${n.order_id}`);
                              }}
                            >
                              <div
                                className={`notif-icon ${
                                  n.type === "order"
                                    ? "notif-primary"
                                    : "notif-info"
                                }`}
                              >
                                <i className="fa fa-box" />
                              </div>
                              <div className="notif-content">
                                <span className="block fw-bold">{n.title}</span>
                                <span className="block">{n.message}</span>
                                <span className="time">
                                  {new Date(n.created_at).toLocaleString()}
                                </span>
                              </div>
                            </a>
                          ))
                        ) : (
                          <p className="text-center text-muted py-3">
                            🎉 No unread notifications
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link to="/notification" className="nav-btn see-all">
                      See all notifications <i className="fa fa-angle-right" />
                    
                    </Link>
                    
                  </li>
                </ul>
              </li>

              <li className="nav-item topbar-icon dropdown hidden-caret">
                  <a className="nav-link" data-bs-toggle="dropdown" href="#" aria-expanded="false">
                    <i className="fas fa-layer-group" />
                  </a>
                  <div className="dropdown-menu quick-actions animated fadeIn">
                    <div className="quick-actions-header">
                      <span className="title mb-1">Quick Actions</span>
                      <span className="subtitle op-7">Shortcuts</span>
                    </div>
                    <div className="quick-actions-scroll scrollbar-outer">
                      <div className="quick-actions-items">
                        <div className="row m-0">
                          <a className="col-6 col-md-4 p-0" href="#">
                            <div className="quick-actions-item">
                              <div className="avatar-item bg-danger rounded-circle">
                                <i className="far fa-calendar-alt" />
                              </div>
                              <span className="text">Calendar</span>
                            </div>
                          </a>
                          <a className="col-6 col-md-4 p-0" href="#">
                            <div className="quick-actions-item">
                              <div className="avatar-item bg-warning rounded-circle">
                                <i className="fas fa-map" />
                              </div>
                              <span className="text">Maps</span>
                            </div>
                          </a>
                          <a className="col-6 col-md-4 p-0" href="#">
                            <div className="quick-actions-item">
                              <div className="avatar-item bg-info rounded-circle">
                                <i className="fas fa-file-excel" />
                              </div>
                              <span className="text">Reports</span>
                            </div>
                          </a>
                          <a className="col-6 col-md-4 p-0" href="#">
                            <div className="quick-actions-item">
                              <div className="avatar-item bg-success rounded-circle">
                                <i className="fas fa-envelope" />
                              </div>
                              <span className="text">Emails</span>
                            </div>
                          </a>
                          <a className="col-6 col-md-4 p-0" href="#">
                            <div className="quick-actions-item">
                              <div className="avatar-item bg-primary rounded-circle">
                                <i className="fas fa-file-invoice-dollar" />
                              </div>
                              <span className="text">Invoice</span>
                            </div>
                          </a>
                          <a className="col-6 col-md-4 p-0" href="#">
                            <div className="quick-actions-item">
                              <div className="avatar-item bg-secondary rounded-circle">
                                <i className="fas fa-credit-card" />
                              </div>
                              <span className="text">Payments</span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

              {/* 👤 Profile Section */}
              <li className="nav-item topbar-user dropdown hidden-caret">
                <a
                  className="dropdown-toggle profile-pic"
                  data-bs-toggle="dropdown"
                  href="#"
                  aria-expanded="false"
                >
                  <div className="avatar-sm">
                    <img
                      src="assets/img/profile.jpg"
                      alt="..."
                      className="avatar-img rounded-circle"
                    />
                  </div>
                  <span className="profile-username">
                    <span className="op-7">Hi,</span>{" "}
                    <span className="fw-bold">{user ? user.name : ""}</span>
                  </span>
                </a>
                <ul className="dropdown-menu dropdown-user animated fadeIn">
                  <div className="dropdown-user-scroll scrollbar-outer">
                    <li>
                      <div className="user-box">
                        <div className="avatar-lg">
                          <img
                            src="assets/img/profile.jpg"
                            alt="profile"
                            className="avatar-img rounded"
                          />
                        </div>
                        <div className="u-text">
                          <h4>{user ? user.name : ""}</h4>
                          <p className="text-muted">{user ? user.email : ""}</p>
                          <a
                            href="/profile"
                            className="btn btn-xs btn-secondary btn-sm"
                          >
                            View Profile
                          </a>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="dropdown-divider" />
                      <a className="dropdown-item" href="#">
                        My Profile
                      </a>
                      <div className="dropdown-divider" />
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={handleLogout}
                      >
                        Logout
                      </a>
                    </li>
                  </div>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}
