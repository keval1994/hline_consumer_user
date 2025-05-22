import { useEffect, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { filterAPI, categoryAPI } from "../utils/apiService";
import { Product05 } from "../utils";

const FilterSidebar = ({
  priceRange,
  setPriceRange,
  handleApplyPriceFilter,
  onApplySubCategoryFilter,
}) => {
  const [selectedPrice, setSelectedPrice] = useState([1140, 7225]);
  const [showPriceActions, setShowPriceActions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  useEffect(() => {
    if (priceRange && priceRange.length === 2) {
      setSelectedPrice(priceRange);
    }
  }, [priceRange]);

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        const priceData = await filterAPI.getRangePrice();
        if (priceData) {
          setPriceRange([priceData.minPrice, priceData.maxPrice]);
          setSelectedPrice([priceData.minPrice, priceData.maxPrice]);
        }
      } catch (error) {
        console.error("Failed to load price range:", error);
      }
    };
    fetchPriceRange();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryAPI.getAllCategory();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryCheckboxChange = async (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );

    try {
      const data = await categoryAPI.getProductByCategory(categoryId);
      setSubCategoriesMap((prev) => ({ ...prev, [categoryId]: data }));
    } catch (error) {
      console.error("Failed to load subcategories:", error);
    }
  };

  const handleSubCategoryCheckboxChange = (subCategoryId) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="sticky top-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Price Range
              </h3>
              <RangeSlider
                min={priceRange?.[0] ?? 1140}
                max={priceRange?.[1] ?? 7225}
                step={100}
                value={selectedPrice}
                onInput={(values) => setSelectedPrice(values)}
                className="accent-primary"
              />

              <div className="mt-3 text-gray-700 font-semibold text-sm">
                Price : ₹{selectedPrice[0]} - ₹{selectedPrice[1]}
              </div>
              <button
                onClick={() => {
                  handleApplyPriceFilter(
                    selectedPrice[0],
                    selectedPrice[1],
                    1,
                    9
                  );

                  setShowPriceActions(true);
                }}
                className="h-full w-full mx-auto text-md bg-soft hover:bg-muted text-black rounded-md p-3 transition-all hover:border-2 mt-3"
              >
                Filter
              </button>
            </div>

            <div className="border-t border-gray py-3">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800">Categories</h3>
                <button
                  className="ml-6 text-white font-bold py-2 hover:bg-muted hover:text-black hover:border-accent transition-all bg-accent px-4 rounded-md shadow-sm"
                  onClick={() =>
                    onApplySubCategoryFilter(selectedSubCategories)
                  }
                >
                  Apply
                </button>
              </div>

              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat.category_Id}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`category_${cat.category_Id}`}
                        checked={selectedCategories.includes(cat.category_Id)}
                        onChange={() =>
                          handleCategoryCheckboxChange(cat.category_Id)
                        }
                        className="accent-primary cursor-pointer"
                      />
                      <label
                        htmlFor={`category_${cat.category_Id}`}
                        className="text-gray-700 font-medium cursor-pointer"
                      >
                        {cat.category_Name}
                      </label>
                    </div>

                    {subCategoriesMap[cat.category_Id] && (
                      <div className="ml-6 border-l pl-4 mt-2">
                        {subCategoriesMap[cat.category_Id].map((sub) => (
                          <div
                            key={sub.sub_Category_Id}
                            className="flex items-center gap-3"
                          >
                            <input
                              type="checkbox"
                              id={`subcategory_${sub.sub_Category_Id}`}
                              onChange={() =>
                                handleSubCategoryCheckboxChange(
                                  sub.sub_Category_Id
                                )
                              }
                              className="accent-primary cursor-pointer"
                            />
                            <label
                              htmlFor={`subcategory_${sub.sub_Category_Id}`}
                              className="text-gray-700 font-medium cursor-pointer"
                            >
                              {sub.sub_Category_Name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 mt-6">
        <img
          src={Product05}
          alt="Promotion"
          className="w-full h-[200px] object-cover"
        />
        <div className="p-4 text-center">
          <div className="text-xs font-bold bg-secondary text-white inline-block px-3 py-1 rounded-full mb-3">
            30% OFF
          </div>
          <h3 className="text-lg font-bold text-gray-800">Special Offer</h3>
          <p className="text-sm text-gray-600 mb-4">
            Grab your favorite items now!
          </p>
          <button className="px-6 py-2 bg-primary text-white rounded-full font-semibold hover:bg-secondary transition-all">
            Shop Now
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
