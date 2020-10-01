import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProductById, listRelated } from "./apiCore";
import Card from "./Card";

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
        listRelated(data._id).then((data) => {
          if (data.error) {
            setError(data.error);
            setLoading(false);
          } else {
            setRelatedProduct(data);
            setLoading(false);
          }
        });
      }
    });
  };

  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);

  return (
    <Layout
      title="Product Details page"
      description="Product details Description"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-5">
          {!loading && (
            <Card product={product} showViewProductButton={false} showFullDescription={true} />
          )}
        </div>

        <div className="col-4">
          <h4>Related products</h4>
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
