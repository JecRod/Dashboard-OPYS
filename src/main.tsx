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
import LoginPage from './pages/LoginPage.tsx';
import ReceiptPage from './pages/ReceiptPage.tsx';
import FeedbackPage from './pages/FeedbackPage.tsx';
import ChatbotPage from './pages/ChatbotPage.tsx';
import ContentCreateChatbot from './components/ContentCreateChatbot.tsx';
import OfferPage from './pages/OfferPage.tsx';
import CreateOfferPage from './pages/CreateOfferPage.tsx';
import NotificationPage from './pages/NotificationPage.tsx';
import HallsPage from './pages/HallsPage.tsx';
import CreateHallsPage from './pages/CreateHallPage.tsx';
import EditMenuPage from './pages/EditMenuPage.tsx';
import OrderHallPage from './pages/OrderHallPage.tsx';


const router = createBrowserRouter([
  {
    path: "/login",   // 👈 Login does NOT use Layout
    element: <LoginPage />,
  },
  {
    path: "/receipt/:id",
    element: <ReceiptPage />,
  },
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
        path: "order-hall",
        element: <OrderHallPage />,
      },
      {
        path: "payment",
        element: <PaymentPage />,
      },
      {
        path: "feedback",
        element: <FeedbackPage />,
      },
      {
        path: "chatbot",
        element: <ChatbotPage />,
      },
      {
        path: "create-chatbot",
        element: <ContentCreateChatbot />,
      },
      {
        path: "offer",
        element: <OfferPage />,
      },
      {
        path: "create-offer",
        element: <CreateOfferPage  />,
      },
      {
        path: "notification",
        element: <NotificationPage />,
      },
      {
        path: "create-halls",
        element: <CreateHallsPage />,
      },
      {
        path: "halls",
        element: <HallsPage />,
      },
      {
        path: "edit-menu/:id",
        element: <EditMenuPage />,
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

