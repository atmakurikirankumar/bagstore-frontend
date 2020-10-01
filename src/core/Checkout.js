import React, { useState } from "react";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { emptyCart, totalItemsInCart } from "./cartHelpers";
import { createOrder } from "./apiCore";

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
  const [values, setValues] = useState({
    success: false,
    error: "",
    address: "",
    phone: "",
  });

  const { success, error, address, phone } = values;

  const token = isAuthenticated() && isAuthenticated().token;

  const handleChange = (e) =>
    setValues({ ...values, error: false, [e.target.name]: e.target.value });

  const getTotal = () => {
    return products.reduce((currVal, nextVal) => {
      return currVal + nextVal.count * nextVal.price;
    }, 0);
  };

  const showError = (error) => (
    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
      {error}
    </div>
  );

  const showSuccess = (success) => (
    <div className="alert alert-info" style={{ display: success ? "" : "none" }}>
      Thanks! Your Order has been placed successfully. One of our representative will contact you.
    </div>
  );

  const placeOrder = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", success: false });
    if (!phone || !address) {
      setValues({ ...values, error: "Contact and Address are required to place an order." });
    } else {
      createOrder(token, { products, phone, address, amount: getTotal() })
        .then((data) => {
          if (data.error) {
            setValues({ ...values, error: data.error });
          } else {
            emptyCart(() => {
              setRun(!run); // run useEffect in parent Cart
              // console.log("Order Placed");
              setValues({
                success: true,
                phone: "",
                address: "",
              });
            });
          }
        })
        .catch((error) => {
          console.log(error);
          setValues({ ...values, error: "", success: false });
        });
    }
  };

  const showDropIn = () => {
    return (
      totalItemsInCart() > 0 && (
        <form onSubmit={placeOrder}>
          <div className="form-group">
            <label className="text-muted">Contact Number:</label>
            <input
              type="text"
              placeholder="Contact"
              name="phone"
              value={phone}
              onChange={handleChange}
              id="phone"
              required
            />
          </div>

          <div className="form-group">
            <label className="text-muted">Delivery address:</label>
            <textarea
              onChange={handleChange}
              className="form-control"
              value={address}
              placeholder="Type your delivery address here..."
              id="address"
              name="address"
              required
            />
          </div>
          <button className="btn btn-success btn-block">Place Order</button>
        </form>
      )
    );
  };

  const showOrderSummary = () => {
    return (
      totalItemsInCart() > 0 && (
        <div className="card">
          {products.map((prd) => (
            <h6>
              <span style={{ float: "left" }}>{prd.name}:</span>
              <span className="text-danger" style={{ float: "right" }}>
                {prd.count} X {prd.price} = {prd.count * prd.price}
              </span>
            </h6>
          ))}
          <hr />
          <h5 className="text-danger">
            Order Total: <span style={{ float: "right" }}>Rs. {getTotal()}</span>
          </h5>
        </div>
      )
    );
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <>
        <br />
        <Link to="/signin">
          <button className="btn btn-sm btn-primary btn-block">SignIn To Checkout</button>
        </Link>
      </>
    );
  };
  return (
    <div>
      {showOrderSummary()}
      {showSuccess(success)}
      {showError(error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
