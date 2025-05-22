import { FaTh, FaList } from "react-icons/fa";
import { filterAPI } from "../utils/apiService";

const FilterTopbar = ({
  totalItems,
  filteredItems,
  itemsPerPage,
  gridView,
  setGridView,
  onSort,
  appliedPrice,
  handleClearPriceFilter,
}) => {
  const sortOptions = [
    { id: "0", name: "Default Sorting" },
    { id: "1", name: "Latest" },
    { id: "2", name: "Price: Low to High" },
    { id: "3", name: "Price: High to Low" },
  ];

  const handleSortChange = async (e) => {
    const selectedSort = parseInt(e.target.value);
    try {
      const response = await filterAPI.getSorting(selectedSort, 1, 9);
      if (response && response.data) {
        onSort(response.data, selectedSort);
      } else {
        onSort([], selectedSort);
      }
    } catch (error) {
      console.error("Failed to sort items:", error);
      onSort([], selectedSort);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-100 bg-white">
      <div className="text-gray-800 font-bold text-lg animate-fadeInUp">
        Showing{" "}
        <span className="text-primary">
          {Math.min(filteredItems, itemsPerPage)}
        </span>{" "}
        of <span className="text-primary">{totalItems}</span> items
      </div>

      <div className="flex flex-col">
        {appliedPrice && (
          <div className="flex gap-4 mt-2 items-center px-4 py-2 rounded-xl shadow animate-fadeInUp">
            <span className="font-semibold">Price Filter Applied:</span>
            <span>
              ₹{appliedPrice[0]} - ₹{appliedPrice[1]}
            </span>
            <button
              onClick={handleClearPriceFilter}
              className="ml-4 text-sm text-red-600 underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 items-center animate-fadeInUp">
        <select
          onChange={handleSortChange}
          className="border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-primary shadow-sm hover:scale-105 transition-all"
        >
          {sortOptions.map((sort) => (
            <option key={sort.id} value={sort.id}>
              {sort.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => setGridView("3col")}
            className={`p-3 rounded-lg shadow-md ${
              gridView === "3col"
                ? "bg-primary text-white"
                : "bg-white border border-gray-300 hover:bg-primary hover:text-white"
            } transition-all`}
          >
            <FaTh size={16} />
          </button>
          <button
            onClick={() => setGridView("list")}
            className={`p-3 rounded-lg shadow-md ${
              gridView === "list"
                ? "bg-primary text-white"
                : "bg-white border border-gray-300 hover:bg-primary hover:text-white"
            } transition-all`}
          >
            <FaList size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterTopbar;
