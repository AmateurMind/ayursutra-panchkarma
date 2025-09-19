import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-8 sm:my-16 text-gray-900 px-4 sm:px-0 md:mx-10">
      <h1 className="text-2xl sm:text-3xl font-medium text-center">Featured PanchKarma Specialists</h1>
      <p className="w-full sm:w-2/3 lg:w-1/3 text-center text-sm px-4 sm:px-0">
        Connect with our most experienced certified PanchKarma therapists and wellness experts.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 pt-5 px-4 sm:px-0">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="border border-primary border-opacity-30 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] hover:shadow-elevated transition-all duration-500 touch-target bg-white"
            key={index}
          >
            <div className="aspect-w-1 aspect-h-1">
              <img className="w-full h-48 sm:h-56 object-cover bg-primary bg-opacity-10" src={item.image} alt={item.name} />
            </div>
            <div className="p-4">
              <div
                className={`flex items-center gap-2 text-sm mb-2 ${
                  item.available ? "text-green-500" : "text-gray-500"
                }`}
              >
                <p
                  className={`w-2 h-2 flex-shrink-0 ${
                    item.available ? "bg-green-500" : "bg-gray-500"
                  } rounded-full`}
                ></p>
                <p className="text-xs sm:text-sm">{item.available ? "Available" : "Not Available"}</p>
              </div>
              <p className="text-gray-900 text-base sm:text-lg font-medium mb-1 line-clamp-2">{item.name}</p>
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-primary bg-opacity-10 text-gray-700 px-8 sm:px-12 py-3 rounded-full mt-6 sm:mt-10 hover:bg-primary hover:text-white transition-all duration-300 text-sm sm:text-base font-medium touch-target min-h-[44px] min-w-[44px]"
      >
        View All Specialists
      </button>
    </div>
  );
};

export default TopDoctors;
