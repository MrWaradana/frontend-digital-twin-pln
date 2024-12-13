import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";

const DropdownEquipmentLevel = ({ selectedOption, onSelect, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
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

  // Only filter if 'options' is defined
  const filteredOptions = options
    ? options.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Show a maximum of 10 filtered options
  const displayedOptions = filteredOptions.slice(0, 10);

  return (
    <div ref={dropdownRef} className="relative sm:w-1/3 w-full">
      <div
        onClick={() => setIsOpen(true)} // Open the dropdown on click
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
        className={`w-full px-5 py-3 rounded-[50px] placeholder:text-slate-400 text-sm cursor-pointer flex justify-between items-center shadow-md transition-all duration-300 bg-white hover:bg-[#F4F4F4]`}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term as user types
          placeholder="Search by name..."
          className={`w-full bg-transparent outline-none text-sm ${
            !searchTerm ? "text-[#B2B2B2]" : "text-black"
          }`}
        />
        <Search
          className={`w-4 h-4 ${!searchTerm ? "text-[#B2B2B2]" : "text-black"}`}
        />
      </div>

      {/* Dropdown List */}
      {isOpen &&
        searchTerm &&
        displayedOptions.length > 0 && ( // Show only filtered results
          <div
            className="absolute mt-2 w-full rounded-[30px] bg-white shadow-md"
            style={{ zIndex: 10 }}
          >
            {displayedOptions.map((option, index) => (
              <a href={`/reliability-app/${option.location_tag}`} key={index}>
                <div
                  onClick={() => handleSelectOption(option)}
                  className={`px-6 py-2 text-[#918E8E] text-sm cursor-pointer ${
                    index === 0 ? "rounded-t-[30px]" : ""
                  } ${
                    index === displayedOptions.length - 1
                      ? "rounded-b-[30px]"
                      : ""
                  } hover:bg-[#F4F4F4]`}
                >
                  {option.name}
                </div>
              </a>
            ))}
          </div>
        )}

      {/* If no results match */}
      {isOpen && searchTerm && displayedOptions.length === 0 && (
        <div
          className="absolute mt-2 w-full rounded-[30px] bg-white shadow-md"
          style={{ zIndex: 10 }}
        >
          <div className="px-6 py-2 text-[#918E8E] text-sm cursor-pointer">
            No results found
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownEquipmentLevel;
