import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated, signout } from "../auth";
import { read, update } from "./apiUser";
import { useHistory } from "react-router-dom";

const Profile = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: false,
    success: false,
  });
  const { token } = isAuthenticated();
  const { name, email, password, error, success } = values;
  let history = useHistory();
  const init = (userId) => {
    // console.log(userId);
    read(userId, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: true });
      } else {
        setValues({ ...values, name: data.name, email: data.email });
      }
    });
  };
  useEffect(() => {
    init(match.params.userId);
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, error: false, [event.target.name]: event.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    update(match.params.userId, token, { name, password }).then((data) => {
      if (data.error) {
        // console.log(data.error);
        alert(data.error);
      } else {
        signout(() => {
          history.push({
            pathname: "/signin",
            state: { profileUpdate: true },
          });
        });
      }
    });
  };

  const profileUpdate = (name, email, password) => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          onChange={handleChange}
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
          type="email"
          //   onChange={handleChange}
          className="form-control"
          value={email}
          id="email"
          name="email"
          readOnly
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          onChange={handleChange}
          className="form-control"
          value={password}
          id="passwprd"
          name="password"
          required
        />
      </div>

      <button className="btn btn-primary">Update Profile</button>
    </form>
  );

  return (
    <Layout title="Profile" description="Update your profile" className="container">
      <h2 className="mb-4">Profile update</h2>
      {profileUpdate(name, email, password)}
    </Layout>
  );
};

export default Profile;
