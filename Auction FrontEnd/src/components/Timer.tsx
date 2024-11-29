import React, { useEffect } from "react";
import { useTimer } from "../Contexts/TimerContext"; // Adjust path as needed

const Timer = ({ deadline }) => {
  const { setTimeLeft, timeLeft } = useTimer();

  useEffect(() => {
    if (!deadline || isNaN(new Date(deadline))) {
      console.error("Invalid deadline provided to Timer component");
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const timeDiff = new Date(deadline) - now;

      if (timeDiff <= 0) {
        clearInterval(interval);
        setTimeLeft("Auction ended");
      } else {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);

        const formattedTime = `${
          days > 0 ? `${days}d ` : ""
        }${hours}h ${minutes}m ${seconds}s`;

        setTimeLeft(formattedTime);
      }
    };

    // Update the timer every second
    const interval = setInterval(updateTimer, 1000);

    // Initial call to set timeLeft immediately
    updateTimer();

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [deadline, setTimeLeft]);

  return <div>{timeLeft}</div>;
};

export default Timer;
