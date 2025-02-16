import React from "react";
import Title from "../components/Title";
import NewsletterBox from '../components/NewsletterBox'
import { assets } from "../assets/assets";
const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title Text1={<span className="mr-2">ABOUT</span>} Text2="US" />
      </div>
      <div className=" my-10  flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Welcome to MegaMart, your one-stop destination for quality products
            at unbeatable prices. We specialize in delivering exceptional value
            and customer satisfaction. Explore our wide range of categories,
            from fashion to electronics, designed to meet your everyday needs.
            Shop confidently with secure payments and fast shipping!
          </p>
          <p>
            Discover the best online shopping experience with [Your Store Name].
            From trendy apparel to cutting-edge gadgets, we offer a vast
            selection of products to enhance your lifestyle. Enjoy fast
            delivery, easy returns, and excellent customer service every step of
            the way.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Our mission at Lahore and Islamabad in both cites we provide a
            seamless online shopping experience by offering high-quality
            products, exceptional customer service, and fast delivery, ensuring
            customer satisfaction with every order we fulfill.
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title Text1={<span className="mr-2">WHY</span>} Text2="CHOOSE US" />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            We prioritize quality assurance by thoroughly testing every product
            to ensure the highest standards and reliability.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            Our website offers convenient shopping, easy navigation, fast
            checkout, and seamless delivery for a hassle-free experience.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customers Service:</b>
          <p className="text-gray-600">
            We provide exceptional customer service with prompt responses,
            personalized assistance, and dedicated support for all customers.
          </p>
        </div>
      </div>
      <NewsletterBox/>
    </div>
  );
};

export default About;
