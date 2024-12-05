// components/Dropdown.js
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

const DropdownEquipmentLevel = ({ selectedOption, onSelect, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectOption = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative sm:w-1/3 w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
        className={`w-full px-5 py-3 rounded-[50px] placeholder:text-slate-400 text-sm cursor-pointer flex justify-between items-center shadow-md transition-all duration-300 bg-white hover:bg-[#F4F4F4]`}
      >
        <span
          className={`${!selectedOption ? "text-[#B2B2B2]" : "text-black"}`}
        >
          {selectedOption || "Search by name..."}
        </span>{" "}
        <Search
          className={`w-4 h-4 ${
            !selectedOption ? "text-[#B2B2B2]" : "text-black"
          }`}
        />
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div
          className="absolute mt-2 w-full rounded-[30px] bg-white shadow-md"
          style={{ zIndex: 10 }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelectOption(option)}
              className={`px-6 py-2 text-[#918E8E] text-sm cursor-pointer ${
                index === 0 ? "rounded-t-[30px]" : ""
              } ${
                index === options.length - 1 ? "rounded-b-[30px]" : ""
              } hover:bg-[#F4F4F4]`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownEquipmentLevel;
