import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Form Submission
  const handleSubmit = async (e) => {
    console.log("onsubmg");
    e.preventDefault();

    // Validate Required Fields
    if (!name || !description || !price || !category || !subCategory) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const formData = new FormData();
      console.log("best", bestseller, JSON.stringify(bestseller));
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      images.forEach((image, index) => {
        if (image) {
          formData.append(`image${index + 1}`, image);
        }
      });

      console.log(formData);
      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset Form State
        setName("");
        setDescription("");
        setImages([null, null, null, null]);
        setPrice("");
        setCategory("Men");
        setSubCategory("Topwear");
        setBestseller(false);
        setSizes([]);
        setErrorMessage("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Handle Image Change
  const handleImageChange = (index, file) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index] = file;
      return updatedImages;
    });
  };

  // Toggle Sizes
  const toggleSize = (size) => {
    setSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  return (
    <form
      className="flex flex-col w-full items-start gap-6"
      onSubmit={handleSubmit}
    >
      {/* Display Error Message */}
      {errorMessage && (
        <p className="text-red-500 bg-red-100 p-2 rounded">{errorMessage}</p>
      )}

      {/* Image Upload */}
      <div>
        <p className="mb-2 text-gray-700">Upload Images</p>
        <div className="flex gap-2">
          {images.map((image, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img
                className="w-20 h-20 object-cover"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt={`Uploaded ${index + 1}`}
                onLoad={() => image && URL.revokeObjectURL(image)}
              />
              <input
                type="file"
                id={`image${index + 1}`}
                hidden
                accept="image/*"
                onChange={(e) => handleImageChange(index, e.target.files[0])}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2 text-gray-700">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <p className="mb-2 text-gray-700">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write content here"
          required
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
        <div>
          <p className="mb-2 text-gray-700">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2 text-gray-700">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2 text-gray-700">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            placeholder="25"
            required
          />
        </div>
      </div>

      {/* Product Sizes */}
      <div>
        <p className="mb-2 text-gray-700">Product Sizes</p>
        <div className="flex gap-3 flex-wrap">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div key={size} onClick={() => toggleSize(size)}>
              <p
                className={`px-3 py-1 cursor-pointer ${
                  sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
                }`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={(e) => setBestseller(e.target.checked)}
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      {/* Submit Button */}
      <button className="w-28 py-3 mt-4 bg-black text-white" type="submit">
        ADD
      </button>
    </form>
  );
};

export default Add;
