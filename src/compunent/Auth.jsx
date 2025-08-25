import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login";
import Signup from "./Signup";

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light font-cabin p-4 md:p-8 overflow-hidden">
      <div className="relative w-full max-w-[80rem] h-auto shadow-xl rounded-2xl bg-white overflow-hidden flex flex-col md:flex-row">
        <AnimatePresence mode="wait">
          {isSignIn ? (
            <motion.div
              key="signin"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Login setIsSignIn={setIsSignIn} />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Signup setIsSignIn={setIsSignIn} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
