import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to Ayursutra, your trusted partner in holistic Ayurvedic
            healthcare. At Ayursutra, we blend ancient Ayurvedic wisdom with
            modern technology to provide personalized wellness solutions that
            treat the root cause, not just symptoms.
          </p>
          <p>
            Ayursutra is committed to preserving and promoting authentic
            Ayurvedic practices. We connect you with certified Ayurvedic
            practitioners who understand your unique constitution (Prakriti) and
            provide treatments that harmonize your mind, body, and spirit.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            Our vision at Ayursutra is to make authentic Ayurvedic healthcare
            accessible to everyone. We aim to create a world where natural
            healing and preventive care are the foundation of wellbeing,
            empowering individuals to live in harmony with nature.
          </p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Holistic Approach:</b>
          <p>
            Comprehensive Ayurvedic treatments that address mind, body, and
            spirit for complete wellness.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Natural Healing:</b>
          <p>
            Access to certified Ayurvedic practitioners specializing in
            natural, chemical-free treatments.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Personalized Care:</b>
          <p>
            Treatment plans based on your unique Prakriti (constitution) and
            current health state.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
