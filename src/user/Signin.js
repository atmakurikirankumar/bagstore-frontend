import React, { useState } from "react";
import Layout from "../core/Layout";
import { Redirect, Link, useLocation } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth";
import Spinner from "../core/Spinner";

const Signin = (props) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    redirectToReferrer: false,
  });

  const location = useLocation();

  const { email, password, loading, error, redirectToReferrer } = values;
  const { user } = isAuthenticated();

  const handleChange = (event) => {
    setValues({ ...values, error: false, [event.target.name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => {
          setValues({
            ...values,
            redirectToReferrer: true,
          });
        });
      }
    });
  };

  const signInForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange}
          type="email"
          className="form-control"
          value={email}
          id="email"
          name="email"
          required
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange}
          type="password"
          className="form-control"
          value={password}
          id="password"
          name="password"
          required
        />
      </div>
      <button className="btn btn-primary btn-block">Login</button>
      <p>
        Don't Have an account? <Link to="/signup">Signup Here</Link>
      </p>
    </form>
  );

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
      {error && error.split("|").map((e, i) => <h6 key={i}>{e}</h6>)}
    </div>
  );

  const showLoading = () => loading && <Spinner />;

  const redirectUser = () => {
    if (redirectToReferrer) {
      if (user && user.role === "admin") {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  const showProfileUpdateMessage = () =>
    location.state &&
    location.state.profileUpdate && (
      <div className="alert alert-success">Profile updated Successfully. Please sign in again.</div>
    );

  return (
    <Layout
      title="Signin"
      description="Signin to Node React E-commerce App"
      className="container col-md-5 offset-md-2"
    >
      {showLoading()}
      {showError()}
      {showProfileUpdateMessage()}
      {signInForm()}
      {redirectUser()}
    </Layout>
  );
};

export default Signin;
