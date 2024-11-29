import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const ItemCard = ({
  startingPrice,
  name,
  description,
  deadline,
  status,
  photo,
  userId,
  itemId,
}: {
  startingPrice: number;
  name: string;
  description: string;
  deadline: string;
  status: string;
  photo: string;
}) => {
  // Function to calculate remaining time
  const calculateTimeRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const timeDiff = deadlineDate.getTime() - now.getTime();

    if (timeDiff <= 0) return "Expired"; // Return if deadline has passed

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Conditionally include days only if they are greater than 0
    return `${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m ${seconds}s`;
  };

  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(deadline)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(deadline));
    }, 1000);

    // Clear the interval when the component is unmounted or when the deadline has passed
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-2xl">
      <img src={photo} alt={name} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-gray-900">
            ${startingPrice}
          </span>
          <span
            className={`text-sm font-semibold rounded-full px-3 py-1 ${
              status === "active"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <Link to={`${itemId}`}>{status}</Link>
          </span>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <span className="font-semibold">Time Remaining:</span> {timeRemaining}
        </div>
      </div>
    </div>
  );
};
