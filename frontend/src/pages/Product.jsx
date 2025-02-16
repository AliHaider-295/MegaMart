import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import { backendUrl } from "../App";

const Product = () => {
  const { productId } = useParams();
  const { currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState();
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const fatchProductData = async () => {
    const response = await axios.get(backendUrl + "/api/product/list");
    const products = response.data.products;
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fatchProductData();
  }, [productId]);
  return productData ? (
    <div className=" border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* product data is here */}
      <div className="flex-gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* now the product images is here  */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[8.4%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[36%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
          <div className="flex-1">
            <h1 className="font-medium text-3xl mt-2">{productData.name}</h1>
            <div className="flex items-center gap-1 mt-2">
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className="pl-2">(122)</p>
            </div>
            <p className="mt-5 text-3xl font-medium">
              {currency}
              {productData.price}
            </p>
            <p className="mt-5 text-gray-500 md:w-4/5">
              {productData.description}
            </p>
            <div className="flex flex-col gap-4 my-8">
              <p>Select Size</p>
              <div className="flex gap-2">
                {productData.sizes.map((item, index) => (
                  <button
                    onClick={() => setSize(item)}
                    className={`border py-2 px-4 bg-gray-100 ${
                      item === size ? "border-orange-500" : ""
                    }`}
                    key={index}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => addToCart(productData._id, size)}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              ADD TO CART{" "}
            </button>
            <hr className="mt-8 sm:w-4/5" />
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and Exchange policy within 7days.</p>
            </div>
          </div>
        </div>

        {/* product info */}
        <div className="mt-20">
          <div className="flex">
            <b className="border px-5 text:sm">Description</b>
            <p className="border px-5 text:sm">Reviews(122)</p>
          </div>
          <div className=" flex flex-col gap-4 border px-6 py-6 text:sm text-gray-500">
            <p>
              An e-commerce website related to online work provides products or
              services catering to professionals, freelancers, and remote
              workers. These platforms are designed to meet the needs of
              individuals working in the digital or remote workspace by offering
              tools, software.
            </p>
            <p>
              When discussing running products related to e-commerce, it
              primarily involves selling goods and accessories that cater to
              runners and fitness enthusiasts. These products focus on enhancing
              performance, comfort, and safety while running. Below are key
              categories, product details, and examples of websites specializing
              in running-related items:
            </p>
          </div>
        </div>
        {/* display related products  */}
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  ) : (
    <div className=" opacity-0"></div>
  );
};

export default Product;
