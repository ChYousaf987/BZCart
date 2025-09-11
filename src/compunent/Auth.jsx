import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light font-cabin p-4 md:p-8 overflow-hidden">
      <div className="relative w-full max-w-[80rem] h-auto shadow-xl rounded-2xl bg-white overflow-hidden flex flex-col md:flex-row">
        {/* Container with transition */}
        <div className="w-full transition-all duration-500 ease-in-out">
          {isSignIn ? (
            <div className="animate-slideInLeft">
              <Login setIsSignIn={setIsSignIn} />
            </div>
          ) : (
            <div className="animate-slideInRight">
              <Signup setIsSignIn={setIsSignIn} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
