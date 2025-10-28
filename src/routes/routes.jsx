import { createBrowserRouter } from "react-router";
// Pages
import Home from "@/Pages/Home/Home";
import MetroGuide from "@/Pages/MetroGuide/MetroGuide";
import Login from "@/Pages/Login/Login";
import SignUp from "@/Pages/SignUp/SignUp";
import FindRoutes from "@/Pages/FindRoutes/FindRoutes";
import SearchForTransport from "@/Pages/SearchForTransport/SearchForTransport";
import SavedItems from "@/Pages/SavedItems/SavedItems";
// Layouts
import MainLayout from "@/Layout/MainLayout/MainLayout";
import AuthLayout from "@/Layout/AuthLayout/AuthLayout";
const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,

    children: [
      {
        index: true,
        Component: Home,
      },

      {
        path: "findroutes",
        Component: FindRoutes,
      },

      {
        path: "metroguide",
        Component: MetroGuide,
      },
      {
        path: "searchfortransport",
        Component: SearchForTransport,
      },
      {
          path: 'saveditems',
          Component: SavedItems,
        }
    ],
  },
    {
      path: "/",
      Component: AuthLayout,
      children: [
        {
          path: "login",
          Component: Login,
        },
        {
          path: "signup",
          Component: SignUp,
        },
      ],
    },
]);

export default router;
