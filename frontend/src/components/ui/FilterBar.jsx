// frontend/src/components/ui/FilterBar.jsx
import Input from "./Input.jsx";
import Button from "./Button.jsx";

const FilterBar = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  categories = [],
  showPriceFilter = true,
  placeholder = "Buscar...",
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Input
        placeholder={placeholder}
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
      />

      {categories.length > 0 && (
        <select
          className="form-input"
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      )}

      {showPriceFilter && (
        <>
          <Input
            type="number"
            placeholder="Precio mínimo"
            value={filters.minPrice}
            onChange={(e) => onFilterChange("minPrice", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Precio máximo"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange("maxPrice", e.target.value)}
          />
        </>
      )}

      <div className="flex space-x-2">
        <Button onClick={onApplyFilters} className="flex-1">
          Filtrar
        </Button>
        <Button variant="outline" onClick={onClearFilters}>
          Limpiar
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
