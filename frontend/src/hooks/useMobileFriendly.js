import { useEffect } from "react";

// Helper to ensure mobile viewport and scrolling optimization
export default function useMobileFriendly() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1";
    document.head.appendChild(meta);

    document.body.style.webkitOverflowScrolling = "touch";
    document.body.style.overflowX = "hidden";

    return () => {
      document.head.removeChild(meta);
      document.body.style.overflowX = "";
    };
  }, []);
}