import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import productsController from "../controller/products";
import Card from "../components/Card/Card";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination/Pagination";
import { paramsToObject } from "../utils/routerUtils";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useSearchParams();
  const { search } = useLocation();
  const [productTotalCount, setProductTotalCount] = useState(null);
  const searchRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("football");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search]);

  // Фильтрация по категории и диапазону цен
  const filteredProducts = (categoryFilter, priceRange) => {
    let filtered = products;
    if (categoryFilter) {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }
    if (priceRange) {
      filtered = filtered.filter(
        (product) => product.price >= priceRange.min && product.price <= priceRange.max
      );
    }
    return filtered;
  };

  const updateParams = (key, value) => {
    setParams((prevParams) => {
      const params = new URLSearchParams(prevParams);
      params.set(key, value);
      return params;
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    const queryParameters = {
      ...paramsToObject(params),
      _limit: itemsPerPage
    };

    if (selectedCategory) {
      queryParameters.category = selectedCategory;
    }

    if (minPrice) {
      queryParameters.minPrice = minPrice;
    }

    if (maxPrice) {
      queryParameters.maxPrice = maxPrice;
    }

    const { data, headers } = await productsController.getProducts(queryParameters);
    setProducts(data);
    setProductTotalCount(headers["x-total-count"]);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await productsController.getCategories();
    setCategories(data);
  };

  const handlePageChange = (page) => {
    updateParams("_page", page);
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value);
    setItemsPerPage(newItemsPerPage);
    updateParams("_limit", newItemsPerPage);
    updateParams("_page", 1);
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    updateParams("category", category);
  };

  const handlePriceRangeChange = () => {
    updateParams("minPrice", minPrice);
    updateParams("maxPrice", maxPrice);
  };

  return (
    <div>
      <Navbar />
      <h1>Products</h1>
      <input type="text" ref={searchRef} defaultValue={params.get("q") || ""} />
      <button onClick={() => updateParams("q", searchRef.current.value)}>Search</button>
      {params.get("q") ? <p>Result for {params.get("q")}</p> : null}

      <div>
        <label>Category:</label>
        <select value={selectedCategory} onChange={(e) => filterByCategory(e.target.value)}>
          <option value="football">Football</option>
          <option value="spain">Spain</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Min Price:</label>
        <input type="text" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
      </div>
      <div>
        <label>Max Price:</label>
        <input type="text" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      </div>
      <button onClick={handlePriceRangeChange}>Apply Price Range</button>

      <div>
        <label>Items Per Page:</label>
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>

      {loading ? (
        <h1>Loading...</h1>
      ) : (
        filteredProducts(selectedCategory, { min: minPrice, max: maxPrice }).map((p) => (
          <Card key={p.id} product={p} />
        ))
      )}

      {productTotalCount ? (
        <Pagination
          totalPages={Math.ceil(productTotalCount / itemsPerPage)}
          currentPage={parseInt(params.get("_page")) || 1}
          onPageChange={handlePageChange}
        />
      ) : null}
    </div>
  );
}

export default Products;
