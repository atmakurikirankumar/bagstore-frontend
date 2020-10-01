import React, { useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { createCategory } from "./apiAdmin";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [createdCategory, setCreatedCategory] = useState("");
  const [error, setError] = useState(false);

  const { user, token } = isAuthenticated();

  const handleChange = (e) => {
    setError("");
    setName(e.target.value);
    setCreatedCategory("");
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setError("");
    setCreatedCategory("");
    // make request to api to create category
    createCategory(token, { name }).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setError("");
        setName("");
        setCreatedCategory(data.name);
      }
    });
  };

  const addCategroyForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          autoFocus
          id="name"
          placeholder="Enter Category Name..."
          required
        />
      </div>
      <button className="btn btn-block btn-primary">Create Category</button>
    </form>
  );

  const showSuccess = () => (
    <div className="text-success" style={{ display: createdCategory ? "" : "none" }}>
      <h3>{`${createdCategory}`} is created!</h3>
    </div>
  );

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
      {error && error.split("|").map((e, i) => <h6 key={i}>{e}</h6>)}
    </div>
  );

  const goBack = () => (
    <div className="mt-2">
      <Link to="/admin/dashboard" className="btn btn-secondary btn-block text-white">
        Back to Dashboard
      </Link>
    </div>
  );

  return (
    <Layout
      title="Add a new category"
      description={`G'day ${user.name}, ready to add a new category?`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showSuccess()}
          {showError()}
          {addCategroyForm()}
          {goBack()}
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
