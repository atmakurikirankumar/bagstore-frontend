import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import { addItem, updateItem, removeItem } from "./cartHelpers";

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  showFullDescription = false,
  setRun = (f) => f,
  run = undefined,
  // changeCartSize
}) => {
  const [count, setCount] = useState(product.count);
  const [redirect, setRedirect] = useState(false);

  const showViewButton = (showViewProductButton) => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button className="btn btn-sm btn-primary mt-2 mb-2 card-btn-1">View Product</button>
        </Link>
      )
    );
  };

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const addToCart = () => {
    addItem(product, setRedirect(true));
  };

  const showAddToCartBtn = (showAddToCartButton) => {
    return (
      showAddToCartButton &&
      product.quantity > 0 && (
        <button onClick={addToCart} className="btn btn-sm btn-warning mt-2 mb-2 card-btn-1  ">
          Add to cart
        </button>
      )
    );
  };

  const showStock = (quantity) =>
    quantity && quantity <= 0 && <span className="badge badge-primary">Sold Out</span>;

  const handleChange = (productId) => (event) => {
    setRun(!run); // run useEffect in parent Cart
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }
  };

  const showCartUpdateOptions = (cartUpdate) => {
    return (
      cartUpdate && (
        <div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Adjust Quantity</span>
            </div>
            <input
              type="number"
              className="form-control"
              value={count}
              onChange={handleChange(product._id)}
            />
          </div>
        </div>
      )
    );
  };
  const showRemoveButton = (showRemoveProductButton) => {
    return (
      showRemoveProductButton && (
        <button
          onClick={() => {
            removeItem(product._id);
            setRun(!run); // run useEffect in parent Cart
          }}
          className="btn btn-sm btn-danger mt-2 mb-2"
        >
          Remove Product
        </button>
      )
    );
  };
  return (
    <div className="card">
      <div
        className="card-header bg-primary text-left text-white jumbo"
        style={{
          borderRadius: "20px",
        }}
      >
        {product.name} <span style={{ float: "right" }}>{showStock(product.quantity)}</span>
      </div>
      <div className="card-body" style={{ padding: "2px" }}>
        {shouldRedirect(redirect)}
        <ShowImage item={product} url="product" />
        <small>
          {showFullDescription
            ? product.description
            : product.description && product.description.substring(0, 100)}{" "}
        </small>
        <p className="font-weight-bold text-danger">Rs. {product.price}</p>
        <p>
          <span className="font-weight-bold">Category: </span>
          {product.category && product.category.name}
        </p>
        {showViewButton(showViewProductButton)}

        {showAddToCartBtn(showAddToCartButton)}

        {showRemoveButton(showRemoveProductButton)}

        {showCartUpdateOptions(cartUpdate)}
      </div>
    </div>
  );
};

export default Card;
