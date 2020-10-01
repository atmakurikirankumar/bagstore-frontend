import React, { useState, useEffect, useRef } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { listOrders } from "./apiAdmin";
import OrderCard from "../user/OrderCard";

const Orders = () => {
  let [orders, setOrders] = useState([]);
  const { user, token } = isAuthenticated();
  const [loading, setLoading] = useState(true);
  const text = useRef("");
  let [filteredOrders, setFilteredOrders] = useState(null);

  const loadOrders = () => {
    listOrders(token).then((data) => {
      if (data.error) {
        console.error(data.error);
        setLoading(false);
      } else {
        setOrders(data);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    if (filteredOrders === null) {
      text.current.value = "";
    }
    // eslint-disable-next-line
  }, []);

  const renderOrders = (orders) => {
    return (
      <>
        {!loading && orders && orders.length > 0 ? (
          <div className="row">
            {filteredOrders !== null
              ? filteredOrders.map((order, i) => (
                  <div key={i} className="col-4 mb-3">
                    <OrderCard order={order} showStatusUpdate={true} />
                  </div>
                ))
              : orders.map((order, i) => (
                  <div key={i} className="col-4 mb-3">
                    <OrderCard order={order} showStatusUpdate={true} />
                  </div>
                ))}
          </div>
        ) : (
          <div className="alert alert-info">You have not received any orders yet.</div>
        )}
      </>
    );
  };

  const filterOrders = (searchText) => {
    const fOrders = orders.filter((order) => {
      const regex = new RegExp(searchText, "gi");
      return order.status.match(regex) || order._id.match(regex);
    });
    setFilteredOrders(fOrders);
  };

  const onChange = (e) => {
    if (text.current.value !== "") {
      filterOrders(e.target.value);
    } else {
      filteredOrders = null;
    }
  };

  const ordersFilterForm = () => {
    return (
      <form>
        <input
          ref={text}
          type="text"
          placeholder="Filter Orders by Status or Id..."
          onChange={onChange}
        />
      </form>
    );
  };

  return (
    <Layout
      title="Order"
      description={`G'day ${user.name}, You can manage all your orders here`}
      className="container-fluid"
    >
      <div className="container">
        {ordersFilterForm()}
        <br />
        {renderOrders(orders)}
      </div>
    </Layout>
  );
};

export default Orders;
