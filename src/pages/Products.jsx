import Card from "../components/Card/Card";
import Navbar from "../components/Navbar";
import productsController from "../controller/products";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { paramsToObject } from "../utils/routerUtils";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useSearchParams();
  const { search } = useLocation();
  const searchRef = useRef(null);
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);

  const currentPage = Number(params.get('page')) || 1;
  const itemsPerPage = 1; 

  useEffect(() => {
    fetchProducts();
  },[search, currentPage]);

  const updateParams = (key, ref) => {
    setParams((prevParams) => {
      const params = new URLSearchParams(prevParams);
      params.set(key, ref.current.value);
      return params;
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await productsController.getProducts(paramsToObject(params));
    setProducts(data);
    setLoading(false);
  };

  const handlePageChange = (pageNumber) => {
    setParams((prevParams) => {
      const params = new URLSearchParams(prevParams);
      params.set('page', pageNumber);
      return params;
    });
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);

  return (
    <div>
      <Navbar />
      <h1>Products</h1>
      <input type="text" ref={searchRef} value={params.get('q')} />
      <button onClick={() => updateParams("q", searchRef)}>Search</button>
      <div>
        <label>Min Price:</label>
        <input type="number" ref={minPriceRef} value={params.get('minPrice') || ''} />
      </div>
      <div>
        <label>Max Price:</label>
        <input type="number" ref={maxPriceRef} value={params.get('maxPrice') || ''} />
      </div>
      <button onClick={() => updateParams("minPrice", minPriceRef)}>Apply</button>
      <button onClick={() => updateParams("maxPrice", maxPriceRef)}>Apply</button>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          {displayedProducts.map((p) => <Card key={p.id} product={p} />)}
          <div>
            {currentPage > 1 && (
              <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
            )}
            {currentPage < totalPages && (
              <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
