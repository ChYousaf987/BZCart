import React from "react";
import { motion } from "framer-motion";
// import logo from "./assets/logo.png"; // adjust path

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-400 relative overflow-hidden">
      {/* Floating Gradient Particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/70 blur-md"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, Math.random() * -200],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: Math.random() * 5 + 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Logo Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="relative flex flex-col items-center"
      >
        {/* Circular Progress Ring */}
        

        {/* Glowing Pulse */}
        <motion.div
          className="absolute w-44 h-44 rounded-full bg-primary/30 blur-3xl"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* 3D Floating Logo */}
        <motion.img
          src="/logg.png"
          alt="Logo"
          className="w-32 h-32 relative z-10 drop-shadow-[0_0_25px_rgba(242,108,43,0.9)]"
          animate={{
            y: [0, -15, 0],
            rotateY: [0, 15, -15, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Futuristic Loading Text */}
        <motion.p
          className="mt-3 text- font-montserrat text-lg tracking-[0.4em] uppercase"
          animate={{
            opacity: [0.2, 1, 0.2],
            letterSpacing: ["0.2em", "0.5em", "0.2em"],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loader;
