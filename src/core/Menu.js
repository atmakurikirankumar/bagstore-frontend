import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { totalItemsInCart } from "./cartHelpers";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = ({ history }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <a className="navbar-brand" href="#">
        AKK Enterprises
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" style={isActive(history, "/")} to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" style={isActive(history, "/shop")} to="/shop">
              Shop
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" style={isActive(history, "/cart")} to="/cart">
              Cart
              {totalItemsInCart() > 0 && (
                <sup>
                  <small className="cart-badge">{totalItemsInCart()}</small>
                </sup>
              )}
            </Link>
          </li>
          {isAuthenticated() && isAuthenticated().user.role === "user" && (
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/user/dashboard")}
                to="/user/dashboard"
              >
                Dashboard
              </Link>
            </li>
          )}
          {isAuthenticated() && isAuthenticated().user.role === "admin" && (
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/admin/dashboard")}
                to="/admin/dashboard"
              >
                Dashboard
              </Link>
            </li>
          )}

          {!isAuthenticated() && (
            <>
              <li className="nav-item">
                <Link className="nav-link" style={isActive(history, "/signin")} to="/signin">
                  Signin
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" style={isActive(history, "/signup")} to="/signup">
                  Signup
                </Link>
              </li>
            </>
          )}

          {isAuthenticated() && (
            <li className="nav-item">
              <span
                className="nav-link"
                style={{ cursor: "pointer", color: "#ffffff" }}
                onClick={() =>
                  signout(() => {
                    // if (typeof window !== "undefined") {
                    //   localStorage.removeItem("cart");
                    // }
                    history.push("/");
                  })
                }
              >
                Signout
              </span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default withRouter(Menu);
