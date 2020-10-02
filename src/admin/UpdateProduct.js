import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import { getProduct, getCategories, updateProduct } from "./apiAdmin";
import Spinner from "../core/Spinner";

const UpdateProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    quantity: "",
    photo: "",
    loading: false,
    error: false,
    createdProduct: "",
    redirectToProfile: false,
    formData: "",
  });
  const [categories, setCategories] = useState([]);

  const { user, token } = isAuthenticated();
  const {
    name,
    description,
    price,
    category,
    quantity,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData,
  } = values;

  const init = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        // populate the state
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          shipping: data.shipping,
          quantity: data.quantity,
          formData: new FormData(),
        });
        // load categories
        initCategories();
      }
    });
  };

  // load categories and set form data
  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    init(match.params.productId);
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    updateProduct(match.params.productId, token, formData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: "",
          description: "",
          photo: "",
          price: "",
          quantity: "",
          category: "",
          loading: false,
          error: false,
          redirectToProfile: true,
          createdProduct: data.name,
        });
      }
    });
  };

  const updateProductForm = () => (
    <form className="mb-3" onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input onChange={handleChange("photo")} type="file" name="photo" accept="image/*" />
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
          id="category"
          value={category}
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

      <button className="btn btn-sm btn-primary">Update Product</button>
    </form>
  );

  const showError = () => (
    <h3 className="text-danger" style={{ display: error ? "" : "none" }}>
      {error}
    </h3>
  );

  const showSuccess = () => (
    <div className="alert alert-info" style={{ display: createdProduct ? "" : "none" }}>
      <h2>{`${createdProduct}`} is updated!</h2>
    </div>
  );

  const showLoading = () => loading && <Spinner />;

  const redirectUser = () => {
    if (redirectToProfile) {
      if (!error) {
        return <Redirect to="/" />;
      }
    }
  };

  return (
    <Layout
      title="Update Product"
      description={`G'day ${user.name}, ready to update a new product?`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {updateProductForm()}
          {redirectUser()}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
