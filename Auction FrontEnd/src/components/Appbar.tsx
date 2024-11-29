import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
export const Appbar = function () {
  const [info, setInfo] = useState({});
  const token = sessionStorage.getItem("token");

  useEffect(
    function () {
      async function fetchUserInfo() {
        try {
          const email = jwtDecode(token)?.email;
          if (!email) {
            console.error("No user email found in sessionStorage");
            return;
          }

          const response = await axios.post(
            "http://localhost:3001/api/v1/user/info",
            { email },
            {
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            } // Send the email as an object
          );

          setInfo(response.data.user); // Set user info to state
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }

      fetchUserInfo(); // Invoke the function inside useEffect
    },
    [token]
  ); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-gray-800 text-white w-full z-10">
      {/* Left Side with Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold">Auction System</h1>
      </div>

      {/* Empty div to take up space on the left */}
      <div className="flex-grow"></div>

      {/* Right Side with User Info */}
      <div className="flex items-center">
        {info.photo && (
          <img
            src={info.photo}
            alt={info.name}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
        )}
        <span className="text-lg font-bold">{info.name}</span>
      </div>
    </div>
  );
};
