import { createBrowserRouter } from "react-router";

// layouts
import mainLayout from "@/layout/mainLayout/mainLayout";
import authLayout from "@/layout/authLayout/authLayout";

// Pages
import home from "@/pages/home/home";
import login from "@/pages/login/login";
import SignUp from "@/pages/SignUp/SignUp";
import details from "@/pages/details/details";
import cairoMetro from "@/pages/cairoMetro/cairoMetro";
import intercityTravelHub from "@/pages/intercityTravelHub/intercityTravelHub";
import settings from "@/pages/settings/settings";
import transportGuide from "@/pages/transportGuide/transportGuide";

const router = createBrowserRouter([
  {
    path: "/",
    Component: mainLayout,

    children: [
      {
        index: true,
        Component: home,
      },

      {
        path: "details",
        Component: details,
      },

      {
        path: "cairometro",
        Component: cairoMetro,
      },
      {
        path: "intercitytravelhub",
        Component: intercityTravelHub,
      },
      {
        path: "transportguide",
        Component: transportGuide,
      },
    ],
  },
  {
    path: "/",
    Component: authLayout,
    children: [
      {
        path: "login",
        Component: login,
      },
      {
        path: "signup",
        Component: SignUp,
      },
      {
        path: "settings",
        Component: settings,
      },
    ],
  },
]);

export default router;
