import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { getOrderById } from "../core/apiCore";
import { isAuthenticated } from "../auth";
import moment from "moment";
import ShowImage from "../core/ShowImage";
import { Link, useLocation } from "react-router-dom";

import { getStatusValues, updateOrderStatus } from "../admin/apiAdmin";

const OrderItem = (props) => {
  const [order, setOrder] = useState({});
  const [error, setError] = useState(false);
  const { token } = isAuthenticated();
  const [loading, setLoading] = useState(true);
  const [statusValues, setStatusValues] = useState([]);
  const location = useLocation();
  const showStatusUpdate = location.state && location.state.showStatusUpdate;

  const loadSingleOrder = (orderId) => {
    getOrderById(orderId, token).then((data) => {
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setOrder(data);
        setLoading(false);
      }
    });
  };

  const loadStatusValues = () => {
    getStatusValues(token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  useEffect(() => {
    const orderId = props.match.params.orderId;
    loadSingleOrder(orderId);
    loadStatusValues();
  }, [props]);

  const showStatus = (o) => (
    <div className="form-group">
      <select
        className="form-control"
        id="changeStatus"
        name="changeStatus"
        onChange={(e) => handleStatusChange(e, o._id)}
      >
        <option value="" disabled>
          Update Status
        </option>
        {statusValues.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  const handleStatusChange = (e, orderId) => {
    updateOrderStatus(token, orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log("Status update failed");
      } else {
        loadSingleOrder(orderId);
      }
    });
  };

  return (
    <Layout title="Order Details page" description="Product details" className="container">
      {!loading && (
        <div className="card">
          <div
            className="card-header mb-3"
            style={{
              backgroundColor: "grey",
              color: "white",
              fontSize: "20px",
              borderRadius: "10px",
            }}
          >
            Order# {order._id}
          </div>
          <div className="card-body" style={{ padding: "2px" }}>
            <p>Current Status: {order.status}</p>
            {showStatusUpdate && showStatus(order)}
            <p>Order Amount: {order.amount}</p>
            <p>Orderd By: {order.user.name}</p>
            <p>Order Placed on: {moment(order.createdAt).format("LL")}</p>
            <p>Number of Products: {order.products.length}</p>
            {order.products.map((product, i) => (
              <div className="card" key={i}>
                <div
                  className="card-header mb-3"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    fontSize: "20px",
                    borderRadius: "10px",
                  }}
                >
                  Product Id: {product._id}
                </div>
                <div className="row">
                  <div className="col-5">
                    <ShowImage item={product} url="product" />
                    <h3 className="text-primary ml-4">{product.name}</h3>
                  </div>
                  <div className="col-7">
                    <p>Price: {product.price}</p>
                    <p>Number of Pieces: {product.count} </p>
                    <small>{product.description}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Link
        className="btn btn-primary btn-sm btn-block mt-3"
        to={showStatusUpdate ? "/admin/dashboard" : "/user/dashboard"}
      >
        Back To Dashboard
      </Link>
    </Layout>
  );
};

export default OrderItem;
