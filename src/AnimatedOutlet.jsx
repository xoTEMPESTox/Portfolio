import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";

function AnimatedOutlet({ context }) {
  const location = useLocation();
  const outlet = useOutlet(context);
  const prevPathRef = useRef(location.pathname);
  const directionRef = useRef(1); // 1 for right-to-left, -1 for left-to-right

  // Determine direction based on path change
  if (prevPathRef.current !== location.pathname) {
    directionRef.current = directionRef.current * -1; // Toggle direction
    prevPathRef.current = location.pathname;
  }

  const direction = directionRef.current;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: 0.4
        }}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%"
        }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}

export default AnimatedOutlet;