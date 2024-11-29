import React, { useState, useEffect } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

interface AuctionItemFormProps {
  onSubmit: (formData: AuctionItemFormState) => void;
}

interface AuctionItemFormState {
  name: string;
  description: string;
  photo: File | null;
  deadline: Date | null;
  startingPrice: number;
  status: "OPEN" | "CLOSED" | "CANCELLED";
}

const AuctionItemForm: React.FC<AuctionItemFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<AuctionItemFormState>({
    name: "",
    description: "",
    photo: null,
    deadline: null,
    startingPrice: 0,
    status: "OPEN",
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [isDeadlineInvalid, setIsDeadlineInvalid] = useState(false);
  const [isPhotoInvalid, setIsPhotoInvalid] = useState(false);
  const [isPriceInvalid, setIsPriceInvalid] = useState(false);

  // Validation logic for enabling/disabling submit button
  useEffect(() => {
    const now = new Date();
    const isNameValid = formData.name.trim() !== "";
    const isDeadlineValid = formData.deadline ? formData.deadline > now : false;
    const isPhotoSelected = !!formData.photo;
    const isPriceValid = formData.startingPrice > 0;

    setIsNameInvalid(!isNameValid);
    setIsDeadlineInvalid(!isDeadlineValid && !!formData.deadline);
    setIsPhotoInvalid(!isPhotoSelected);
    setIsPriceInvalid(!isPriceValid);

    setIsSubmitDisabled(
      !(isNameValid && isDeadlineValid && isPhotoSelected && isPriceValid)
    );
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "startingPrice" ? (value ? parseFloat(value) : 0) : value, // Ensure startingPrice is a valid number
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const now = new Date();
      date.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    }
    setFormData((prev) => ({ ...prev, deadline: date }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.deadline ||
      !formData.photo ||
      formData.startingPrice <= 0 ||
      formData.name.trim() === ""
    ) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-md mx-auto bg-white shadow-md rounded"
    >
      <h2 className="text-xl font-bold mb-4">Create Auction Item</h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`mt-1 p-2 w-full border ${
            isNameInvalid ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {isNameInvalid && (
          <span className="text-red-500 text-sm">Name is required.</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 p-2 w-full border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="photo" className="block text-sm font-medium">
          Photo
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          onChange={handleFileChange}
          accept="image/*"
          required
          className={`mt-1 p-2 w-full border ${
            isPhotoInvalid ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {isPhotoInvalid && (
          <span className="text-red-500 text-sm">Please upload a photo.</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="deadline" className="block text-sm font-medium">
          Deadline
        </label>
        <DatePicker
          value={formData.deadline}
          onChange={handleDateChange}
          required
          className={`mt-1 border ${
            isDeadlineInvalid ? "border-red-500" : "border-gray-300"
          } p-2 rounded w-full`}
          calendarClassName="bg-white border rounded shadow-md"
        />
        {isDeadlineInvalid && (
          <span className="text-red-500 text-sm">
            Deadline must be in the future.
          </span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="startingPrice" className="block text-sm font-medium">
          Starting Price
        </label>
        <input
          type="number"
          id="startingPrice"
          name="startingPrice"
          value={formData.startingPrice || ""}
          onChange={handleChange}
          required
          className={`mt-1 p-2 w-full border ${
            isPriceInvalid ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {isPriceInvalid && (
          <span className="text-red-500 text-sm">
            Starting price must be greater than 0.
          </span>
        )}
      </div>

      <button
        type="submit"
        className={`py-2 px-4 rounded ${
          isSubmitDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
        disabled={isSubmitDisabled}
      >
        Submit
      </button>
    </form>
  );
};

export default AuctionItemForm;
