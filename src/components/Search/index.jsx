import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { searchAPI } from "../../utils/apiService";

const SearchBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const searchRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    // document.addEventListener("mousedown", handleClickOutside);
    // return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim() !== "") {
      try {
        const data = await searchAPI.searchItems(searchTerm);
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      }
    }
  };

  return (
    <motion.div
      ref={searchRef}
      className="relative"
      animate={{ width: isOpen ? 240 : 40 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`flex items-center bg-white shadow rounded-full transition-all duration-300 ease-in-out ${
          isOpen ? "px-4 py-2" : "w-10 h-10 justify-center"
        }`}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.input
              key="input"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search..."
              className="text-sm outline-none border-none bg-transparent placeholder-gray-400 mr-2"
              autoFocus
            />
          )}
        </AnimatePresence>

        <IoSearchSharp
          className="text-xl cursor-pointer text-black"
          onClick={() => {
            if (isOpen && searchTerm.trim()) handleSearch();
            else setIsOpen(true);
          }}
        />
      </div>

      {/* Optional: Show search results below */}
      {results.length > 0 && isOpen && (
        <div className="absolute mt-2 w-full bg-white shadow rounded text-left p-2 max-h-60 overflow-auto z-20">
          {results.map((item, index) => (
            <div
              key={index}
              className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.name || item.title || JSON.stringify(item)}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SearchBox;
