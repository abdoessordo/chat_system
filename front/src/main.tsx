// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UserChat from "./Pages/UserChat";
import AgentDashboard from "./Pages/AgentDashboard";

import "./index.css";
import AgentChat from "./Pages/AgentChat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserChat />,
  },
  {
    path: "/agent",
    children: [
      {
        path: "",
        element: <AgentDashboard />,
      },
      {
        path: "chat/:conversationUUID",
        element: <AgentChat />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
