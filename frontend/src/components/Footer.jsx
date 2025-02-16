import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className=" flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full  md:w-2/3 text-gray-600">
            Jackets, Coats, Trousers, Shirts, Dresses, Blouses, Sweaters,
            Hoodies, Jeans, Skirts, Shorts, Cardigans, Blazers, Tunics,
            Overalls, Leggings, Tops, Scarves, Gloves, Beanies, Hats, Socks,
            Undergarments, Tracksuits, Sweatpants, Suits, Nightwear, Outerwear,
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600 ">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div>
          {" "}
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+92-316-280-776</li>
            <li>contact@megamart.gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          {" "}
          Copyright 2025@ megamart.come - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
