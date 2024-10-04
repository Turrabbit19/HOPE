import { Breadcrumb } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const BreadCrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          return (
            <Breadcrumb.Item key={to}>
              <Link to={to}>{value}</Link>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </>
  );
};

export default BreadCrumb;
