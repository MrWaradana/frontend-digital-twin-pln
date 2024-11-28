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
    if (option === "Select an option") {
      onSelect(option);
      setIsOpen(false);
    } else {
      onSelect(option);
      setIsOpen(false);
    }
  };

  const extendedOptions = ["Select an option", ...options];

  return (
    <div ref={dropdownRef} className="relative sm:w-1/3 w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
        className={`w-full px-5 py-3 rounded-[50px] placeholder:text-slate-400 text-sm cursor-pointer flex justify-between items-center ${
          selectedOption ? "shadow-xl" : "shadow-none"
        } transition-all duration-300 ${
          !selectedOption || selectedOption === "Select an option"
            ? "bg-[#7B7A7A] hover:bg-[#8C8B8B] shadow-none"
            : "bg-white hover:bg-[#F4F4F4]"
        }`}
      >
        <span
          className={`${
            !selectedOption || selectedOption === "Select an option"
              ? "text-[#B2B2B2]"
              : "text-black"
          }`}
        >
          {selectedOption || "Select an option"}
        </span>{" "}
        <Search
          className={`w-4 h-4 ${
            !selectedOption || selectedOption === "Select an option"
              ? "text-[#B2B2B2]"
              : "text-black"
          }`}
        />
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div
          className="absolute mt-2 w-full rounded-[30px] bg-white shadow-xl"
          style={{ zIndex: 10 }}
        >
          {extendedOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelectOption(option)}
              className={`px-6 py-2 text-[#918E8E] text-sm cursor-pointer ${
                index === 0 ? "rounded-t-[30px]" : ""
              } ${
                index === extendedOptions.length - 1 ? "rounded-b-[30px]" : ""
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