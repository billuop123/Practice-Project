import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "../pages/Spinner";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { userInfo } from "../hooks/userInfo";
import Timer from "./Timer";
import { useTimer } from "../Contexts/TimerContext";

export const BigItem = function () {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const token = sessionStorage.getItem("token");
  const [startingPrice, setStartingPrice] = useState(null);
  const [bidPrice, setBidPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const email = jwtDecode(token)?.email;
  const [highestBidder, setHighestBidder] = useState(null);
  const [highestBidPrice, setHighestBidPrice] = useState(0);
  const [socket, setSocket] = useState(null);
  const [highestBidderEmail, setHighestBidderEmail] = useState("");
  const { timeLeft } = useTimer();
  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:3001");
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("WebSocket connection established");
    };

    newSocket.onmessage = async (message) => {
      const parsedData = JSON.parse(message.data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (parsedData.auctionId === Number(id)) {
        try {
          const response2 = await axios.post(
            "http://localhost:3001/api/v1/bids/bidDetails",
            { id: Number(id) }
          );
          setHighestBidPrice(response2.data.price);
          setHighestBidder(response2.data.userInfo);
        } catch (error) {
          console.error("Error updating bid details:", error);
        }
      }
    };

    return () => newSocket.close();
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userInfo1 = await userInfo();
        setHighestBidderEmail(userInfo1.email);

        const response = await axios.post(
          "http://localhost:3001/api/v1/auctionItem/iteminfo",
          { id: Number(id) },
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        setItem(response.data.item);
        setStartingPrice(response.data.item.startingPrice);
        setUserEmail(response.data.item.user.email);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    }

    fetchData();
  }, [id, token]);
  useEffect(
    function () {
      async function fetchHighestBidder() {
        const response2 = await axios.post(
          "http://localhost:3001/api/v1/bids/bidDetails",
          { id: Number(id) }
        );
        setHighestBidPrice(response2.data.price);
        setHighestBidder(response2.data.userInfo);
      }
      fetchHighestBidder();
    },
    [id]
  );
  const handleBidSubmit = async () => {
    const auctionId = Number(id);
    if (bidPrice > Math.max(startingPrice, highestBidPrice)) {
      try {
        setIsSubmitting(true);
        await axios.post("http://localhost:3001/api/v1/bids/produce-message", {
          auctionId,
          price: bidPrice,
          userEmail: email,
        });
        // await axios.post(
        //   "http://localhost:3001/api/v1/bids/addBids",
        //   { auctionId, price: bidPrice, userEmail: email },
        //   {
        //     headers: {
        //       Authorization: token,
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );
        toast.success("Bid submitted successfully");
        socket?.send(
          JSON.stringify({ type: "new_bid", auctionId, price: bidPrice })
        );
        setBidPrice("");
      } catch (error) {
        console.error("Error submitting bid:", error);
        alert("Failed to submit bid. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Your bid must be higher than the current highest bid.");
    }
  };

  if (!item) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const isSeller = email === userEmail;
  const isHighestBidder = email === highestBidder?.email;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Timer */}
      <Timer deadline={item.deadline} />

      {/* Item Details */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">{item.name}</h1>
        <p className="text-lg text-gray-600">{item.description}</p>
      </div>

      {/* Item Image */}
      <div className="rounded-lg overflow-hidden shadow-md">
        <img
          src={item.photo}
          alt={item.name}
          className="w-full h-[400px] object-cover"
        />
      </div>

      {/* Price and Status */}
      <div className="space-y-4">
        <p className="text-lg">
          <span className="font-semibold text-gray-800">Starting Price:</span>{" "}
          <span className="text-blue-600">${startingPrice}</span>
        </p>
        <p
          className={`text-lg font-semibold ${
            item.status === "active" ? "text-green-600" : "text-red-600"
          }`}
        >
          Status: {item.status}
        </p>
      </div>

      {/* Seller Information */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Seller Information
        </h2>
        <div className="flex items-center space-x-4">
          <img
            src={item.user.photo}
            alt={item.user.name}
            className="w-16 h-16 rounded-full object-cover shadow-md"
          />
          <div>
            <p className="text-lg font-medium text-gray-700">
              {item.user.name}
            </p>
          </div>
        </div>
      </div>

      {/* Highest Bidder */}
      {timeLeft === "Auction ended" ? (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Highest Bidder
          </h2>
          <div className="flex items-center space-x-4">
            <img
              src={highestBidder.photo}
              alt={highestBidder.name}
              className="w-16 h-16 rounded-full object-cover shadow-md"
            />
            <div>
              <p className="text-lg font-medium text-gray-700">
                {highestBidder.name}
              </p>
              <p className="text-lg font-medium text-gray-700">
                Has won this item at ${highestBidPrice}
              </p>
            </div>
          </div>
        </div>
      ) : (
        highestBidder && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Highest Bidder
            </h2>
            <div className="flex items-center space-x-4">
              <img
                src={highestBidder.photo}
                alt={highestBidder.name}
                className="w-16 h-16 rounded-full object-cover shadow-md"
              />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {highestBidder.name}
                </p>
                <p className="text-lg font-medium text-gray-700">
                  Current Highest Bid: ${highestBidPrice}
                </p>
              </div>
            </div>
          </div>
        )
      )}

      {/* Place Bid */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Place Your Bid</h2>
        {isSeller ? (
          <p className="text-red-600 font-semibold">
            You cannot bid on your own item.
          </p>
        ) : isHighestBidder ? (
          <p className="text-red-600 font-semibold">
            You are already the highest bidder.
          </p>
        ) : timeLeft === "Auction ended" ? null : (
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={bidPrice}
              onChange={(e) => setBidPrice(Number(e.target.value))}
              placeholder={`Enter a price greater than $${Math.max(
                startingPrice,
                highestBidPrice
              )}`}
              className={`border rounded-lg px-4 py-2 w-full ${
                bidPrice <= Math.max(startingPrice, highestBidPrice)
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              min={Math.max(startingPrice, highestBidPrice) + 1}
            />
            <button
              onClick={handleBidSubmit}
              disabled={
                isSubmitting ||
                bidPrice <= Math.max(startingPrice, highestBidPrice)
              }
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Bid"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
