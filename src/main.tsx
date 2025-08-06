// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
import HomePage from './pages/HomePage.tsx'
import React from 'react';
import Layout from './pages/Layout.tsx';
// import type { JSX } from 'react/jsx-runtime';
import NoPage from './pages/404Page.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PaymentPage from './pages/PaymentPage.tsx';
import OrderPage from './pages/OrderPage.tsx';
import CreateMenuPage from './pages/CreateMenuPage.tsx';
import MenuPage from './pages/MenuPage.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NoPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "menu",
        element: <MenuPage />,
      },
      {
        path: "create-menu",
        element: <CreateMenuPage />,
      },
      {
        path: "order",
        element: <OrderPage />,
      },
      {
        path: "payment",
        element: <PaymentPage />,
      },
    ],
  },
]);


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </React.StrictMode>
)

