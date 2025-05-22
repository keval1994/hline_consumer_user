import { useState, useEffect } from "react";
import { filterAPI } from "../utils/apiService";

const usePriceFilter = (onFilteredData) => {
  const [priceRange, setPriceRange] = useState([1140, 7225]);
  const [appliedPrice, setAppliedPrice] = useState(null);

  useEffect(() => {
    const fetchPriceRange = async () => {
      const data = await filterAPI.getRangePrice();
      if (data) {
        setPriceRange([data.minPrice, data.maxPrice]);
      }
    };
    fetchPriceRange();
  }, []);

  const handleApplyPriceFilter = async (
    min,
    max,
    pageNumber = 1,
    pageSize = 9
  ) => {
    const data = await filterAPI.getFilterPrice(min, max, pageNumber, pageSize);
    if (data && data.data) {
      onFilteredData(data.data);
      setAppliedPrice([min, max]);
    }
  };

  const handleClearPriceFilter = async () => {
    try {
      const priceData = await filterAPI.getRangePrice();
      if (priceData) {
        setPriceRange([priceData.minPrice, priceData.maxPrice]);
        setAppliedPrice(null);
        const data = await filterAPI.getFilterPrice(
          priceData.minPrice,
          priceData.maxPrice
        );
        if (data && data.data) {
          onFilteredData(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to clear price filter:", error);
    }
  };

  const handleMinPriceFilter = async () => {
    if (!appliedPrice) return;
    const data = await filterAPI.getFilterPrice(appliedPrice[0], priceRange[1]);
    if (data && data.data) {
      onFilteredData(data.data);
    }
  };

  const handleMaxPriceFilter = async () => {
    if (!appliedPrice) return;
    const data = await filterAPI.getFilterPrice(priceRange[0], appliedPrice[1]);
    if (data && data.data) {
      onFilteredData(data.data);
    }
  };

  return {
    priceRange,
    appliedPrice,
    handleApplyPriceFilter,
    handleClearPriceFilter,
    handleMinPriceFilter,
    handleMaxPriceFilter,
  };
};

export default usePriceFilter;
