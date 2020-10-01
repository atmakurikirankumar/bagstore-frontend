import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { getCart } from "./cartHelpers";
import Card from "./Card";
import Checkout from "./Checkout";
import empty_cart from "./empty_cart.jpg";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setItems(getCart());
  }, [run]);

  const showItems = (items) => {
    return (
      <div>
        <h2>Your cart has {`${items.length}`} items</h2>
        <hr />

        {items.map((product, i) => (
          <Card
            key={i}
            product={product}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
            setRun={setRun}
            run={run}
          />
        ))}
      </div>
    );
  };

  const noItemsMessage = () => (
    <div className="product-img">
      <img
        src={empty_cart}
        alt="Empty Cart"
        className="mb-3"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      />
      <div className="alert alert-danger">
        Looks like you have no items in your shopping car. Click <Link to="/shop">HERE</Link> to
        continue shopping
      </div>
    </div>
  );

  return (
    <Layout
      title="Shopping Cart"
      description="Manage your cart items. Add remove checkout or continue shopping."
      className="container-fluid"
    >
      <div className="row">
        <div className="col-4">{items.length > 0 ? showItems(items) : noItemsMessage()}</div>
        <div className="col-2"></div>
        <div className="col-5">
          <h2 className="mb-4">Order Summary</h2>
          <hr />
          <Checkout products={items} setRun={setRun} run={run} />
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
