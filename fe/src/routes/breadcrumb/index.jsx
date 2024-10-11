import { Breadcrumb } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const BreadCrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const {t} = useTranslation("breadcrumb");
  const translation = {
    home: t("home"),
    admin: t("admin"),
    subjects: t("subjects"),
    semesters: t("semesters"),
    majors: t("majors"),
    courses: t("courses"),
    student_manager: t("student-manager"),
  }
  return (
    <>
      <Breadcrumb style={{ }}>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          return (
            <Breadcrumb.Item key={to}>
              <Link to={to}>{translation[value] || value}</Link>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </>
  );

};

export default BreadCrumb;
