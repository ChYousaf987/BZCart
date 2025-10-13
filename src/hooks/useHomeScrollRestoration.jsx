import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useHomeScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    // ✅ Save scroll position before leaving home
    const handleScroll = () => {
      if (location.pathname === "/") {
        sessionStorage.setItem("homeScroll", window.scrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // ✅ Restore when coming back to home
    if (location.pathname === "/") {
      const saved = sessionStorage.getItem("homeScroll");
      if (saved) {
        window.scrollTo(0, parseInt(saved, 10));
      }
    } else {
      // Always scroll to top for other pages
      window.scrollTo(0, 0);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);
}
