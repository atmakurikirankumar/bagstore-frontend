import React from "react";
import Loader from "react-loader-spinner";

export default () => (
  <Loader
    type="Ball-Triangle"
    color="#00BFFF"
    height={100}
    width={100}
    timeout={5000}
    style={{ width: "200px", margin: "auto", display: "block" }}
  />
);
