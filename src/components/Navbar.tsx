import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../Api-Config";
import axios from "axios";
import { useEffect, useState } from "react";


export default function Navbar() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();

  // ✅ Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("login_token");
      if (!token) return;

      try {
        const response = await axios.get(
          API_CONFIG.BASE_URL + API_CONFIG.ENDPOINT.PROFILE,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);
  

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("login_token");

    try {
      await axios.post(
        API_CONFIG.BASE_URL + API_CONFIG.ENDPOINT.LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Logout API failed:", err);
    }

    localStorage.removeItem("login_token");
      navigate("/login");
    };
    


  
    return (
      <>
        <div className="main-header">
          <div className="main-header-logo">
            {/* Logo Header */}
            <div className="logo-header" data-background-color="dark">
              <a href="index.html" className="logo">
                <img src="assets/img/kaiadmin/logo_light.svg" alt="navbar brand" className="navbar-brand" height={20} />
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
            {/* End Logo Header */}
          </div>
          {/* Navbar Header */}
          <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
            <div className="container-fluid">
              <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
                
                
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
                <li className="nav-item topbar-user dropdown hidden-caret">
                  <a className="dropdown-toggle profile-pic" data-bs-toggle="dropdown" href="#" aria-expanded="false">
                    <div className="avatar-sm">
                      <img src="assets/img/profile.jpg" alt="..." className="avatar-img rounded-circle" />
                    </div>
                    <span className="profile-username">
                      <span className="op-7">Hi,</span> <span className="fw-bold">{user ? user.name : ""}</span>
                    </span>
                  </a>
                  <ul className="dropdown-menu dropdown-user animated fadeIn">
                    <div className="dropdown-user-scroll scrollbar-outer">
                      <li>
                        <div className="user-box">
                          <div className="avatar-lg"><img src="assets/img/profile.jpg" alt="image profile" className="avatar-img rounded" /></div>
                          <div className="u-text">
                            <h4>{user ? user.name : ""}</h4>
                            <p className="text-muted">{user ? user.email : ""}</p><a href="profile.html" className="btn btn-xs btn-secondary btn-sm">View Profile</a>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="dropdown-divider" />
                        <a className="dropdown-item" href="#">My Profile</a>
                        <a className="dropdown-item" href="#">My Balance</a>
                        <a className="dropdown-item" href="#">Inbox</a>
                        <div className="dropdown-divider" />
                        <a className="dropdown-item" href="#">Account Setting</a>
                        <div className="dropdown-divider" />
                        {/* <a className="dropdown-item" href="#">Logout</a> */}
                        <a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a>

                      </li>
                    </div>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
          {/* End Navbar */}
        </div>

        </>

        
    )
}