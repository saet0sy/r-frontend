import Card from "../components/Card/Card";
import Navbar from "../components/Navbar";
import productsController from "../controller/products";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const Product = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await productsController.getProduct(parseInt(id));
    setProduct(data);
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <h1>Products</h1>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <Card product={product} />
      )}
    </div>
  );
};

export default Product;
