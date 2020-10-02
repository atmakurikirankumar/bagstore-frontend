import React, { useState } from "react";
import Layout from "../core/Layout";
import { Link } from "react-router-dom";
import { signup } from "../auth";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });

  const { name, email, password, success, error } = values;

  const handleChange = (e) => {
    setValues({ ...values, error: false, [e.target.name]: e.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    signup({ name, email, password }).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
        });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          success: true,
        });
      }
    });
  };

  const signUpForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange}
          type="text"
          className="form-control"
          value={name}
          id="name"
          name="name"
          required
        />
      </div>

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
      <button className="btn btn-primary btn-block">Register</button>
      <p>
        Already have an account? <Link to="/signin">Signin Here</Link>
      </p>
    </form>
  );

  const showError = () => (
    <div style={{ display: error ? "" : "none" }}>
      {error &&
        error.split("|").map((e, i) => (
          <h3 className="text-danger" key={i}>
            {e}
          </h3>
        ))}
    </div>
  );

  const showSuccess = () => (
    <div className="alert alert-info" style={{ display: success ? "" : "none" }}>
      New account is created. Please <Link to="/signin">Signin</Link>
    </div>
  );

  return (
    <Layout
      title="Signup"
      description="Signup to buy your favourite bags"
      className="container col-md-5 offset-md-2"
    >
      {showSuccess()}
      {showError()}
      {signUpForm()}
    </Layout>
  );
};

export default Signup;
