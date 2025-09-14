import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      {/* Parent container */}
      <div className="flex flex-col sm:flex-row justify-between gap-14 my-10 mt-40 text-sm">
        
        {/* ------------ Left Section ------------ */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Panchkarma is an ancient Ayurvedic practice designed to cleanse the body and rejuvenate the mind.
            It has been used for centuries as a natural method to restore balance and vitality.
            Through specialized therapies, it removes toxins and strengthens overall well-being.
            Panchkarma continues to be a trusted path for holistic health and harmony.
          </p>
        </div>

        {/* ------------ Right Section ------------ */}
        <div className="text-right">
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>1234567890</li>
            <li>suhail17mohammad@gmail.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
