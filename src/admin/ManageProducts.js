import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "./apiAdmin";
import Spinner from "../core/Spinner";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = isAuthenticated();

  const loadProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  const destroy = (productId) => {
    setLoading(true);
    deleteProduct(productId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
        setLoading(false);
      } else {
        loadProducts();
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const showLoading = () => loading && <Spinner />;

  return (
    <Layout title="Manage Products" description="Perform CRUD on products" className="container">
      <div className="row">
        {showLoading()}
        <div className="col-12">
          <h2 className="text-center">Total {products.length} products</h2>
          <hr />
          <ul className="list-group">
            {products.map((p, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <strong>{p.name}</strong>
                <div style={{ marginRight: 0 }}>
                  <Link to={`/update/product/${p._id}`}>
                    <span className="btn btn-sm btn-warning">Update</span>
                  </Link>
                  <button onClick={() => destroy(p._id)} className="btn btn-sm btn-danger">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <br />
        </div>
      </div>
    </Layout>
  );
};

export default ManageProducts;
