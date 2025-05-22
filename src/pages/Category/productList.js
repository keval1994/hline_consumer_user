import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProductFilterManager from "../../hooks/useProductFilterManager";
import usePriceFilter from "../../hooks/usePriceFilter";
import { subCategoryAPI } from "../../utils/apiService";
import ProductFilterWrapper from "../../common/ProductFilterWrapper";

const ProductList = () => {
  const { subCategoryId } = useParams();
  const filterManager = useProductFilterManager([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const customerId = sessionStorage.getItem("customerId");

  const {
    priceRange,
    appliedPrice,
    handleApplyPriceFilter,
    handleClearPriceFilter,
    handleMinPriceFilter,
    handleMaxPriceFilter,
  } = usePriceFilter((data) => {
    filterManager.setFilteredProducts(data);
    filterManager.setNoItemsMessage(
      data.length > 0 ? "" : "No products found for selected price range."
    );
  });
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await subCategoryAPI.getProductsBySubCategory({
          subCategoryId,
          pageNumber: currentPage,
          pageSize: 9,
          customer_Id: customerId || 0,
        });
        if (response?.data) {
          filterManager.setProducts(response.data);
          filterManager.setFilteredProducts(response.data);
          setTotalPages(Math.ceil(response.totalRecords / 9));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    if (subCategoryId) {
      fetchProducts();
    }
  }, [subCategoryId]);

  const handleApplySubCategoryFilter = async (subCategoryIds) => {
    let mergedProducts = [];
    for (const id of subCategoryIds) {
      const data = await subCategoryAPI.getProductsBySubCategory(id, 1, 9);
      if (data?.data) {
        mergedProducts = [...mergedProducts, ...data.data];
      }
    }
    filterManager.handleApplySubCategoryFilter(mergedProducts);
  };

  return (
    <ProductFilterWrapper
      title="Products"
      {...filterManager}
      priceRange={priceRange}
      appliedPrice={appliedPrice}
      handleApplyPriceFilter={handleApplyPriceFilter}
      handleClearPriceFilter={handleClearPriceFilter}
      handleMinPriceFilter={handleMinPriceFilter}
      handleMaxPriceFilter={handleMaxPriceFilter}
      handleApplySubCategoryFilter={handleApplySubCategoryFilter}
      onSort={filterManager.handleSortedProducts}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
    />
  );
};

export default ProductList;
