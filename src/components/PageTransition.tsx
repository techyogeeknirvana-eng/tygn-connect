import { useLocation, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export const PageTransition = ({ children }: Props) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...fade} className="min-h-full">
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
