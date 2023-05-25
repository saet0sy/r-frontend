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

  useEffect(() => {
    fetchProducts();
  },[search]);

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

  return (
    <div>
      <Navbar />
      <h1>Products</h1>
      <input type="text" ref={searchRef} value={params.get('q')} />
      <button onClick={() => updateParams("q", searchRef)}>Search</button>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        products.map((p) => <Card key={p.id} product={p} />)
      )}
    </div>
  );
};

export default Products;
