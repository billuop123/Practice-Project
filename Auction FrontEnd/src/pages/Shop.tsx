import { Link } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { ItemCard } from "../components/ItemCard";

export const Shop = function () {
  const [allItems, setAllItems] = useState([]);
  const token = sessionStorage.getItem("token");
  useEffect(
    function () {
      async function getItems() {
        const allItems = await axios.get(
          "http://localhost:3001/api/v1/auctionItem/allItems",
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        setAllItems(allItems.data.items);
      }
      getItems();
    },
    [token]
  );

  return (
    <>
      <Appbar />
      <div className="text-center mt-20 pt-10">
        {" "}
        {/* Added mt-20 and pt-10 for spacing */}
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome to the Shop
        </h2>
        <Link
          to="/postitem"
          className="mt-4 inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sell an Item
        </Link>
      </div>

      {/* Grid container with Tailwind CSS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 px-4">
        {allItems.map((item) => (
          <ItemCard
            key={item.id} // Ensure unique key for each item
            startingPrice={item.startingPrice}
            userId={item.userId}
            name={item.name}
            description={item.description}
            deadline={item.deadline}
            status={item.status}
            photo={item.photo}
            itemId={item.id}
          />
        ))}
      </div>
    </>
  );
};
