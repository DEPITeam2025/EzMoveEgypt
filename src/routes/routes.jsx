import { createBrowserRouter } from "react-router-dom";

// ✅ الصفحات
import Home from "@/Pages/Home/Home";
import MetroGuide from "@/Pages/MetroGuide/MetroGuide";
import Login from "@/Pages/Login/Login";
import SignUp from "@/Pages/SignUp/SignUp";
import FindRoutes from "@/Pages/FindRoutes/FindRoutes";
import SearchForTransport from "@/Pages/SearchForTransport/SearchForTransport";
import SavedItems from "@/Pages/SavedItems/SavedItems";
import SavedRoutes from "@/Pages/SavedItems/SavedRoutes";
import SavedTransport from "@/Pages/SavedItems/SavedTransport";
import ForgotPassword from "@/Pages/ForgotPassword/ForgotPassword";
import ResetPassword from "@/Pages/ForgotPassword/ResetPasword";

// ✅ الـ Layouts
import MainLayout from "@/Layout/MainLayout/MainLayout";
import AuthLayout from "@/Layout/AuthLayout/AuthLayout";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: "findroutes", Component: FindRoutes },
      { path: "metroguide", Component: MetroGuide },
      { path: "searchfortransport", Component: SearchForTransport },

      // ✅ مجموعة الصفحات المحفوظة
      {
        path: "saveditems",
        Component: SavedItems,
        children: [
          { index: true, Component: SavedRoutes }, // الافتراضي أول ما يدخل
          { path: "savedroutes", Component: SavedRoutes },
          { path: "savedtransport", Component: SavedTransport },
        ],
      },
    ],
  },

  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "signup", Component: SignUp },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password", Component: ResetPassword },
    ],
  },
]);

export default router;
