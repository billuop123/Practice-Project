import React, { createContext, useState, useContext } from "react";

// Create the TimerContext
const TimerContext = createContext();

// Provider component
export const TimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState("");

  return (
    <TimerContext.Provider value={{ timeLeft, setTimeLeft }}>
      {children}
    </TimerContext.Provider>
  );
};

// Custom hook to use TimerContext
export const useTimer = () => {
  const context = useContext(TimerContext);

  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }

  return context;
};
