import { Outlet, ScrollRestoration, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
// import Footer from "../components/Footer";
// import appData from "../app/appDetail";



const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("login_token");

    if (!token) {
      // If no token found, redirect to login page
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
    <div className="wrapper">
      <Sidebar/>
      <div className="main-panel">
      <Navbar/>
      

      
      <main className="main mt-5">
        <ScrollRestoration />
        <Toaster />
        <Outlet />
      </main>
      {/* <Footer /> */}
      </div>
      </div>
      
    </>
  );
};

export default Layout;
