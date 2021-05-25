import React, { useState, useEffect } from "react";
import "./ScrollToTop.css";
import { useWindowScroll } from "react-use";
function ScrollToTop() {
  const { y: pageYOffset } = useWindowScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pageYOffset < 300) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [pageYOffset]);
  if (!visible) {
    return null;
  }

  function handleScroll() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="container" onClick={handleScroll}>
      <i className="fas fa-chevron-up"></i>
    </div>
  );
}

export default ScrollToTop;
