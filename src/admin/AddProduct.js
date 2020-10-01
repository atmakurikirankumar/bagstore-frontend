import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createProduct, getCategories } from "./apiAdmin";
import Spinner from "../core/Spinner";

const AddProduct = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    quantity: "",
    image: "",
    loading: false,
    error: "",
    createdProduct: "",
    formData: "",
  });

  const { user, token } = isAuthenticated();
  const {
    name,
    description,
    price,
    categories,
    quantity,
    loading,
    error,
    createdProduct,
    formData,
    category,
  } = values;

  // load categories and set form data
  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          categories: data,
          formData: new FormData(),
        });
      }
    });
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "image" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, error: false, createdProduct: "", [name]: value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", createdProduct: "", loading: true });

    createProduct(token, formData).then((data) => {
      if (data.error) {
        setValues({ ...values, createdProduct: "", error: data.error });
      } else {
        setValues({
          ...values,
          name: "",
          description: "",
          image: "",
          price: "",
          quantity: "",
          loading: false,
          category: "",
          createdProduct: data.name,
          formData: new FormData(),
        });
      }
    });
  };

  const addProductForm = () => (
    <form className="mb-3" onSubmit={clickSubmit}>
      <h5 className="text-primary">Pick an Image</h5>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input onChange={handleChange("image")} type="file" name="image" accept="image/*" />
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
          id="name"
          required
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea
          onChange={handleChange("description")}
          className="form-control"
          value={description}
          id="description"
          required
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Price</label>
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          value={price}
          id="price"
          required
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Category</label>
        <select
          onChange={handleChange("category")}
          className="form-control"
          value={category}
          id="category"
          required
        >
          <option value="">Please select</option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input
          onChange={handleChange("quantity")}
          type="number"
          className="form-control"
          value={quantity}
          id="quantity"
          required
        />
      </div>

      <button className="btn btn-primary">Create Product</button>
    </form>
  );

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
      {error && error.split("|").map((e, i) => <h6 key={i}>{e}</h6>)}
    </div>
  );

  const showSuccess = () => (
    <div className="text-success" style={{ display: createdProduct ? "" : "none" }}>
      <h2>{`${createdProduct}`} is created!</h2>
    </div>
  );

  const showLoading = () => loading && <Spinner />;

  return (
    <Layout
      title="Add a new product"
      description={`G'day ${user.name}, ready to add a new product?`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {addProductForm()}
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
