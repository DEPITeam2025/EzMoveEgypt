import { Outlet } from "react-router-dom";

import TheHeader from "@/Components/TheHeader/TheHeader";
import TheFooter from "@/Components/TheFooter/TheFooter";
import { useScrollToTop } from "../../hooks/useScrollToTop";

function MainLayout() {
  useScrollToTop();
  return (
    <div>
      <TheHeader />
      <main>
        <Outlet />
      </main>
      <TheFooter />
    </div>
  );
}

export default MainLayout;
