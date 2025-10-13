import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Saves scroll position for Home and restores it when navigating back.
 * Works across full unmounts (like going to /product/:id and coming back).
 */
export default function useScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType(); // "POP", "PUSH", "REPLACE"
  const prevPath = useRef(null);

  useEffect(() => {
    // 🔹 Save scroll before leaving /
    return () => {
      if (location.pathname === "/") {
        sessionStorage.setItem("homeScroll", window.scrollY.toString());
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    // 🔹 Restore when returning to /
    if (location.pathname === "/") {
      const savedScroll = sessionStorage.getItem("homeScroll");
      if (savedScroll) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScroll, 10));
        }, 50);
      }
    } else if (navigationType === "PUSH") {
      // Always scroll to top when visiting other pages
      window.scrollTo(0, 0);
    }

    prevPath.current = location.pathname;
  }, [location.pathname, navigationType]);
}
