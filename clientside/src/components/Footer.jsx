import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-4 md:px-0 md:mx-10">
      {/* Parent container */}
      <div className="flex flex-col sm:flex-row justify-between gap-10 sm:gap-14 my-10 mt-20 sm:mt-40 text-sm">
        
        {/* ------------ Left Section ------------ */}
        <div className="text-center sm:text-left">
          <img className="mb-5 w-40 mx-auto sm:mx-0" src={assets.logo} alt="Ayursutra logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6 mx-auto sm:mx-0">
            Panchkarma is an ancient Ayurvedic practice designed to cleanse the body and rejuvenate the mind.
            It has been used for centuries as a natural method to restore balance and vitality.
            Through specialized therapies, it removes toxins and strengthens overall well-being.
            Panchkarma continues to be a trusted path for holistic health and harmony.
          </p>
        </div>

        {/* Divider on mobile */}
        <div className="sm:hidden border-t border-border" />

        {/* ------------ Right Section ------------ */}
        <div className="text-center sm:text-right">
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <a 
                href="tel:+911234567890" 
                className="inline-block px-3 py-2 rounded-md hover:bg-muted transition-colors touch-target"
              >
                1234567890
              </a>
            </li>
            <li className="break-words">
              <a 
                href="mailto:suhail17mohammad@gmail.com" 
                className="inline-block px-3 py-2 rounded-md hover:bg-muted transition-colors touch-target"
              >
                suhail17mohammad@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
