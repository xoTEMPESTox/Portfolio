import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Home from "./pages/home";
import About from "./pages/about";
import Journey from "./pages/journey";
import Portfolio from "./pages/portfolio";
import Services from "./pages/services";
import Skills from "./pages/skills";
import Socials from "./pages/socials";
import ExternalRedirect from "./components/ExternalRedirect";
import MailPage from "./pages/mail";


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/journey",
        element: <Journey />,
      },
      {
        path: "/portfolio",
        element: <Portfolio />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/skills",
        element: <Skills />,
      },
      {
        path: "/socials",
        element: <Socials />,
      },
      {
        path: "/mail",
        element: <MailPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default appRouter;
