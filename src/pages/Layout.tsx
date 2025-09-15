import { Outlet, ScrollRestoration } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
// import Footer from "../components/Footer";
// import appData from "../app/appDetail";



const Layout = () => {

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
