import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

export const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [direction, setDirection] = useState(0);

  const toggleForm = () => {
    setDirection(isLogin ? 1 : -1);
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-[calc(100vh - 5rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl relative ">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={isLogin ? "login" : "signup"}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute w-full top-40"
          >
            {isLogin ? (
              <LoginForm onToggle={toggleForm} />
            ) : (
              <SignupForm onToggle={toggleForm} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
