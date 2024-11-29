import React, { useState } from "react";
import AuctionItemForm from "./AuctionItemForm";
import axios from "axios";
import { userInfo } from "../hooks/userInfo";
import toast from "react-hot-toast";
import { Spinner } from "./Spinner";
import { useNavigate } from "react-router-dom";

export const AuctionItem: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  console.log(sessionStorage.getItem("user"));
  console.log(userInfo());
  const token = sessionStorage.getItem("token");
  const handleFormSubmit = async (formData) => {
    console.log("Form Data:", formData);
    const { id } = await userInfo();
    formData.userId = id;
    console.log(formData.userId);
    // Create a FormData object to send the file and form fields
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("deadline", formData.deadline.toISOString()); // Send as ISO string
    formDataToSend.append("startingPrice", formData.startingPrice.toString());
    formDataToSend.append("status", formData.status);
    formDataToSend.append("userId", formData.userId);
    if (formData.photo) {
      formDataToSend.append("photo", formData.photo); // Append the file
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3001/api/v1/auctionItem/additems",
        formDataToSend,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data", // This will be set by Axios automatically
          },
        }
      );
      if (response.data.status) toast.success(response.data.status);
      navigate("/shop");
      setIsLoading(false); // Handle the response as needed
    } catch (error) {
      console.error("Error uploading item:", error);
    }
  };
  return isLoading ? (
    <Spinner />
  ) : (
    <div>
      <AuctionItemForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default AuctionItem;
