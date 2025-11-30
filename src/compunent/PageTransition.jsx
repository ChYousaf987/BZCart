import { motion } from "framer-motion";

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }} // start off to the right
      animate={{ x: 0, opacity: 1 }} // slide in to center
      exit={{ x: -300, opacity: 0 }} // exit to the left
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
