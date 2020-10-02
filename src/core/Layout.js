import React from "react";
import "../styles.css";

const Layout = ({ title = "Title", description = "Description", children, className }) => {
  return (
    <div>
      <div className="jumbotron" style={{ height: "20px" }}>
        <h2>{title}</h2>
        <p className="lead">{description}</p>
      </div>
      <div className={className}>{children}</div>
    </div>
  );
};

export default Layout;
