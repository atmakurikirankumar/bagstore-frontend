import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";
import Spinner from "./Spinner";

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProductsBySell = () => {
    getProducts("sold").then((data) => {
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setProductsBySell(data);
        setLoading(false);
      }
    });
  };

  const loadProductsByArrival = () => {
    getProducts("createdAt").then((data) => {
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setProductsByArrival(data);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);

  const showLoading = () => loading && <Spinner />;

  return (
    <Layout
      title="Sri Padmavati Enterprises"
      description="Leading Bags Wholesale/Retail store in Vijayawada"
      className="container-fluid"
    >
      <Search />
      {showLoading()}
      {!loading && productsByArrival && productsByArrival.length > 0 && (
        <>
          <div className="mb-4">
            <h3 className="display-2"> New Arrivals </h3>
          </div>
          <div className="row">
            {productsByArrival.map((product, i) => (
              <div key={i} className="col-3 mb-3">
                <Card product={product} />
              </div>
            ))}
          </div>
          <hr />
        </>
      )}

      {!loading && productsBySell && productsBySell.length > 0 && (
        <>
          <div className="mb-4">
            <h3 className="display-2"> Best Sellers </h3>
          </div>
          <div className="row">
            {productsBySell.map((product, i) => (
              <div key={i} className="col-3 mb-3">
                <Card product={product} />
              </div>
            ))}
          </div>
          <hr />
        </>
      )}
    </Layout>
  );
};

export default Home;
