import { useEffect, useState } from "react";
import { allItemsAPI, subCategoryAPI } from "../../../utils/apiService";
import usePriceFilter from "../../../hooks/usePriceFilter";
import useProductFilterManager from "../../../hooks/useProductFilterManager";
import ProductFilterWrapper from "../../../common/ProductFilterWrapper";
import ArtBlobLoader from "../../../common/Loader/ArtBlobLoader ";

const NewArrivals = () => {
  const filterManager = useProductFilterManager([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const customerId = sessionStorage.getItem("customerId");

  useEffect(() => {
    const fetchPaginatedProducts = async () => {
      try {
        setIsLoading(true);
        const data = await allItemsAPI.getNewArrivalItems({
          filterType: "NewArrivals",
          pageNumber: currentPage,
          pageSize: 9,
          customer_Id: customerId,
        });

        if (data?.data) {
          filterManager.setProducts(data.data);
          filterManager.setFilteredProducts(data.data);
          setTotalPages(Math.ceil(data.totalRecords / 9));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaginatedProducts();
  }, [currentPage]);

  const {
    priceRange,
    appliedPrice,
    handleApplyPriceFilter,
    handleClearPriceFilter,
    handleMinPriceFilter,
    handleMaxPriceFilter,
  } = usePriceFilter((data) => {
    if (data.length > 0) {
      filterManager.setFilteredProducts(data);
      filterManager.setNoItemsMessage("");
    } else {
      filterManager.setFilteredProducts([]);
      filterManager.setNoItemsMessage(
        "No products found for selected price range."
      );
    }
  });

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

  if (isLoading) return <ArtBlobLoader />;

  return (
    <ProductFilterWrapper
      title="All Products"
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

export default NewArrivals;
