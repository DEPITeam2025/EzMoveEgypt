import "./App.css";
import router from "@/routes/routes";
import { RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserFromStorage } from "@/features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}
export default App;
