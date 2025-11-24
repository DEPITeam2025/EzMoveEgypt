import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const supportsSR = "scrollRestoration" in window.history;
    const previousSR = supportsSR ? window.history.scrollRestoration : null;
    if (supportsSR) window.history.scrollRestoration = "manual";

    try {
      const el = document.scrollingElement || document.documentElement;
      if (el) el.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    } finally {
      if (supportsSR) {
        setTimeout(() => {
          window.history.scrollRestoration = previousSR;
        }, 0);
      }
    }
  }, [pathname]);
}
