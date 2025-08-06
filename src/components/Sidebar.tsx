import { Link } from "react-router-dom";


export default function Sidebar() {
    return (
        <>
        <div className="sidebar" data-background-color="dark">
            <div className="sidebar-logo">
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
            <div className="sidebar-wrapper scrollbar scrollbar-inner">
              <div className="sidebar-content">
                <ul className="nav nav-secondary">
                  <li className="nav-item active">
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
                </ul>
              </div>
            </div>
          </div>

        </>


    );
}