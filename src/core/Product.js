import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProductById, listRelated } from "./apiCore";
import Card from "./Card";
import Spinner from "./Spinner";

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSingleProduct = (productId) => {
    getProductById(productId).then((data) => {
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setProduct(data);
        setLoading(false);
      }
    });
  };

  const loadRelatedProducts = (productId) => {
    listRelated(productId).then((data) => {
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setRelatedProduct(data);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
    loadRelatedProducts(productId);
  }, [props]);

  const showLoading = () => loading && <Spinner />;

  return (
    <Layout
      title="Product Details page"
      description="Product details Description"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-5">
          {showLoading()}
          {!loading && (
            <Card product={product} showViewProductButton={false} showFullDescription={true} />
          )}
        </div>

        <div className="col-4">
          <h1 className="jumbotron" style={{ height: "20px", textAlign: "center", margin: 0 }}>
            Related products
          </h1>
          {showLoading()}
          {relatedProduct.map((p, i) => (
            <div className="mb-3" key={i}>
              <Card product={p} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Product;
