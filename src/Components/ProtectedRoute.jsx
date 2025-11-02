import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute() {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  // لو مفيش Token → رجّعه لصفحة اللوجين + خزّن الصفحة اللي كان فيها
  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // يعرض باقي الصفحات الداخلية لو الشخص مسموح له
}

export default ProtectedRoute;
