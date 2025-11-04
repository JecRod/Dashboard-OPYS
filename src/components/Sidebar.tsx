import { Link } from "react-router-dom";


export default function Sidebar() {
    return (
        <>
        <div className="sidebar" data-background-color="dark">
            <div className="sidebar-logo">
              {/* Logo Header */}
              <div className="logo-header" data-background-color="dark">
                <Link to="/" className="logo">
                  <img src="assets/img/Opys/Opys.svg" alt="navbar brand" className="navbar-brand" height={20} />
                </Link>
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
            <div className="sidebar-wrapper scrollbar scrollbar-inner">
              <div className="sidebar-content">
                <ul className="nav nav-secondary">
                  <li className="nav-item">
                    <a data-bs-toggle="collapse" href="#dashboard" className="collapsed" aria-expanded="false">
                      <i className="fas fa-home" />
                      <p>Dashboard</p>
                      <span className="caret" />
                    </a>
                    <div className="collapse" id="dashboard">
                      <ul className="nav nav-collapse">
                        <li>
                          <Link to="/" className="nav-btn"><span className="sub-item">Dashboard 1</span></Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="nav-section">
                    <span className="sidebar-mini-icon">
                      <i className="fa fa-ellipsis-h" />
                    </span>
                    <h4 className="text-section">Components</h4>
                  </li>
                  <li className="nav-item">
                    <a data-bs-toggle="collapse" href="#base">
                      <i className="fas fa-layer-group" />
                      <p>Menu</p>
                      <span className="caret" />
                    </a>
                    <div className="collapse" id="base">
                      <ul className="nav nav-collapse">
                        <li>
                          <Link to="/menu" className="nav-btn"><span className="sub-item">All Menu</span></Link>
                        </li>
                        <li>
                          <Link to="/create-menu" className="nav-btn"><span className="sub-item">Create Menu</span></Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="nav-item">
                    <a data-bs-toggle="collapse" href="#sidebarLayouts">
                      <i className="fas fa-th-list" />
                      <p>Order</p>
                      <span className="caret" />
                    </a>
                    <div className="collapse" id="sidebarLayouts">
                      <ul className="nav nav-collapse">
                        <li>
                          <Link to="/order" className="nav-btn"><span className="sub-item">List Order</span></Link>
                        </li>
                        <li>
                          <Link to="/order-hall" className="nav-btn"><span className="sub-item">List Hall Order</span></Link>
                        </li>
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item">
                    <a data-bs-toggle="collapse" href="#hallLayouts">
                      <i className="fas fa-th-list" />
                      <p>Hall</p>
                      <span className="caret" />
                    </a>
                    <div className="collapse" id="hallLayouts">
                      <ul className="nav nav-collapse">
                        <li>
                          <Link to="/halls" className="nav-btn"><span className="sub-item">List Hall</span></Link>
                        </li>
                        <li>
                          <Link to="/create-halls" className="nav-btn"><span className="sub-item">Create Hall</span></Link>
                        </li>
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item">
                    <a data-bs-toggle="collapse" href="#notificationLayouts">
                      <i className="fas fa-th-list" />
                      <p>Notifications</p>
                      <span className="caret" />
                    </a>
                    <div className="collapse" id="notificationLayouts">
                      <ul className="nav nav-collapse">
                        <li>
                          <Link to="/notification" className="nav-btn"><span className="sub-item">List Notifications</span></Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="nav-item">
                    <a data-bs-toggle="collapse" href="#forms">
                      <i className="fas fa-pen-square" />
                      <p>Payment</p>
                      <span className="caret" />
                    </a>
                    <div className="collapse" id="forms">
                      <ul className="nav nav-collapse">
                        <li>
                          <Link to="/payment" className="nav-btn"><span className="sub-item">All Payment</span></Link>
                        </li>
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item">
                    <a data-bs-toggle="collapse" href="#offerLayouts">
                      <i className="fas fa-th-list" />
                      <p>Offers</p>
                      <span className="caret" />
                    </a>
                    <div className="collapse" id="offerLayouts">
                      <ul className="nav nav-collapse">
                        <li>
                          <Link to="/offer" className="nav-btn"><span className="sub-item">List Offer</span></Link>
                        </li>
                        <li>
                          <Link to="/create-offer" className="nav-btn"><span className="sub-item">Create Offer</span></Link>
                        </li>
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item">
                    <a data-bs-toggle="collapse" href="#feedbackLayouts">
                      <i className="fas fa-th-list" />
                      <p>Feedback</p>
                      <span className="caret" />
                    </a>
                    <div className="collapse" id="feedbackLayouts">
                      <ul className="nav nav-collapse">
                        <li>
                          <Link to="/feedback" className="nav-btn"><span className="sub-item">List Feedback</span></Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="nav-item">
                    <a data-bs-toggle="collapse" href="#chatbotLayouts">
                      <i className="fas fa-th-list" />
                      <p>Chatbot</p>
                      <span className="caret" />
                    </a>
                    <div className="collapse" id="chatbotLayouts">
                      <ul className="nav nav-collapse">
                        <li>
                          <Link to="/chatbot" className="nav-btn"><span className="sub-item">List Chatbot</span></Link>
                        </li>
                        <li>
                          <Link to="/create-chatbot" className="nav-btn"><span className="sub-item">Create Chatbot</span></Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </>


    );
}