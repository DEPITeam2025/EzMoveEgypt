import { createBrowserRouter } from "react-router-dom";

// ✅ الصفحات
import Home from "@/pages/Home/Home";
import MetroGuide from "@/pages/MetroGuide/MetroGuide";
import Login from "@/pages/Login/Login";
import SignUp from "@/pages/SignUp/SignUp";
import FindRoutes from "@/pages/FindRoutes/FindRoutes";
import SearchForTransport from "@/pages/SearchForTransport/SearchForTransport";
import SavedItems from "@/pages/SavedItems/SavedItems";
import SavedRoutes from "@/pages/SavedItems/SavedRoutes";
import SavedTransport from "@/pages/SavedItems/SavedTransport";
import ForgotPassword from "@/pages/ForgotPassword/ForgotPassword";
import ResetPassword from "@/pages/ForgotPassword/ResetPasword";

// ✅ الـ Layouts
import MainLayout from "@/layout/mainLayout/mainLayout";
import AuthLayout from "@/layout/authLayout/authLayout";

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
