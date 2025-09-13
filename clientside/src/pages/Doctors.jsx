import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through our certified Ayurvedic practitioners.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <p
            onClick={() =>
              speciality === "Panchakarma Specialist"
                ? navigate("/doctors")
                : navigate("/doctors/Panchakarma Specialist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Panchakarma Specialist"
                ? "bg-primary bg-opacity-20 text-black"
                : ""
            }`}
          >
            Panchakarma Specialist
          </p>
          <p
            onClick={() =>
              speciality === "Ayurvedic Gynecology"
                ? navigate("/doctors")
                : navigate("/doctors/Ayurvedic Gynecology")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Ayurvedic Gynecology" ? "bg-primary bg-opacity-20 text-black" : ""
            }`}
          >
            Ayurvedic Gynecology
          </p>
          <p
            onClick={() =>
              speciality === "Ayurvedic Dermatology"
                ? navigate("/doctors")
                : navigate("/doctors/Ayurvedic Dermatology")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Ayurvedic Dermatology" ? "bg-primary bg-opacity-20 text-black" : ""
            }`}
          >
            Ayurvedic Dermatology
          </p>
          <p
            onClick={() =>
              speciality === "Ayurvedic Pediatrics"
                ? navigate("/doctors")
                : navigate("/doctors/Ayurvedic Pediatrics")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Ayurvedic Pediatrics" ? "bg-primary bg-opacity-20 text-black" : ""
            }`}
          >
            Ayurvedic Pediatrics
          </p>
          <p
            onClick={() =>
              speciality === "Ayurvedic Neurology"
                ? navigate("/doctors")
                : navigate("/doctors/Ayurvedic Neurology")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Ayurvedic Neurology" ? "bg-primary bg-opacity-20 text-black" : ""
            }`}
          >
            Ayurvedic Neurology
          </p>
          <p
            onClick={() =>
              speciality === "Ayurvedic Gastroenterology"
                ? navigate("/doctors")
                : navigate("/doctors/Ayurvedic Gastroenterology")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Ayurvedic Gastroenterology"
                ? "bg-primary bg-opacity-20 text-black"
                : ""
            }`}
          >
            Ayurvedic Gastroenterology
          </p>
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-primary border-opacity-30 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}
            >
              <img className="bg-primary bg-opacity-10" src={item.image} alt="" />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    item.available ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  <p
                    className={`w-2 h-2 ${
                      item.available ? "bg-green-500" : "bg-gray-500"
                    } rounded-full`}
                  ></p>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm ">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
