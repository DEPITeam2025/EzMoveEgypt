import { createBrowserRouter } from "react-router-dom";

// ✅ استيراد الصفحات
import Home from "@/Pages/Home/Home";
import MetroGuide from "@/Pages/MetroGuide/MetroGuide";
import Login from "@/Pages/Login/Login";
import SignUp from "@/Pages/SignUp/SignUp";
import FindRoutes from "@/Pages/FindRoutes/FindRoutes";
import SearchForTransport from "@/Pages/SearchForTransport/SearchForTransport";
import SavedItems from "@/Pages/SavedItems/SavedItems";
import ForgotPassword from "@/Pages/ForgotPassword/ForgotPassword";
import ResetPassword from "@/Pages/ForgotPassword/ResetPasword";
// ✅ استيراد الـ ProtectedRoute
import ProtectedRoute from "@/components/ProtectedRoute";
// ✅ استيراد الـ Layouts
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

      // ✅ أي صفحة هنا تعتبر Private
      {
        element: <ProtectedRoute />, // يشوف لو المستخدم مسجل دخول ولا لأ
        children: [{ path: "saveditems", Component: SavedItems }],
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
