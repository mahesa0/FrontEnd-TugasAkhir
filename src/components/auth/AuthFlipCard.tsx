import { useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useNavigate } from "react-router-dom";
// import React from "react";

const AuthFlipCard = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleLoginSuccess = (role: string) => {
    const userData = { role };
    localStorage.setItem("user", JSON.stringify(userData));
    onLoginSuccess();
    if (role === "Admin") {
      navigate("/dashboard", { replace: true });
    } else if (role === "User") {
      navigate("/home", { replace: true });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        className="relative w-screen perspective-1000"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Login card */}
        <div className="absolute w-full h-full backface-hidden">
          <LoginForm
            onSwitch={() => setIsFlipped(true)}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>

        {/* Back - Register */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <RegisterForm onSwitch={() => setIsFlipped(false)} />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthFlipCard;
