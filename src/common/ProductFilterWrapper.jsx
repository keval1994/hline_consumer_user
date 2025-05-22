import FilterSidebar from "../common/FilterSidebar";
import FilterTopbar from "../common/FilterTopbar";
import ItemCard from "../common/ItemCard";
import CartDialog from "../components/Cart/CartDialog";
import Pagination from "./Pagination";

const ProductFilterWrapper = ({
  title,
  products,
  filteredProducts,
  itemsPerPage,
  setItemsPerPage,
  gridView,
  setGridView,
  sortBy,
  onSort,
  appliedPrice,
  handleClearPriceFilter,
  handleApplyPriceFilter,
  priceRange,
  handleMinPriceFilter,
  handleMaxPriceFilter,
  handleApplySubCategoryFilter,
  selectedItem,
  setSelectedItem,
  showCartDialog,
  setShowCartDialog,
  noItemsMessage,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const gridClasses =
    gridView === "3col"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1";

  return (
    <div className="bg-soft py-10">
      <div className="mx-auto container">
        <h1 className="text-xl font-bold mb-4">{title}</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64">
            <FilterSidebar
              priceRange={priceRange}
              appliedPrice={appliedPrice}
              handleApplyPriceFilter={handleApplyPriceFilter}
              handleClearPriceFilter={handleClearPriceFilter}
              handleMinPriceFilter={handleMinPriceFilter}
              handleMaxPriceFilter={handleMaxPriceFilter}
              onApplySubCategoryFilter={handleApplySubCategoryFilter}
            />
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <FilterTopbar
              totalItems={products.length}
              filteredItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              gridView={gridView}
              setGridView={setGridView}
              onSort={onSort}
              appliedPrice={appliedPrice}
              handleClearPriceFilter={handleClearPriceFilter}
            />

            {noItemsMessage && (
              <div className="bg-yellow-100 text-yellow-900 font-medium px-6 py-3 rounded-xl shadow">
                {noItemsMessage}
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className={`grid ${gridClasses}`}>
                {filteredProducts.slice(0, itemsPerPage).map((item) => (
                  <ItemCard
                    key={item.item_Id}
                    item={item}
                    setSelectedItem={setSelectedItem}
                    setShowCartDialog={setShowCartDialog}
                    gridView={gridView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            if (page >= 1 && page <= totalPages) {
              setCurrentPage(page);
            }
          }}
        />

        <CartDialog
          isOpen={showCartDialog}
          onClose={() => setShowCartDialog(false)}
          item={selectedItem}
        />
      </div>
    </div>
  );
};

export default ProductFilterWrapper;
