import React from "react";
import { Link, useLocation } from "react-router-dom";

import logo from "./../assets/images/logo-dark.png";

import { FcHome, FcCustomerSupport, FcBusinessman } from "react-icons/fc";
import { FcTodoList } from "react-icons/fc";

export default function Menu() {
  const location = useLocation();

  const hideMenu = () => {
    document.getElementById("navbar-toggler").classList.add("collapsed");
    document.getElementById("responsive-navbar-nav").classList.remove("show");
  };

  return (
    <>
      <div className="w-100 px-3 py-3 pb-5 collapse-hide">
        <img src={logo} className="img-fluid" alt="Delete Me Now" />
      </div>

      <Link
        to="/"
        className={`btn w-100 px-4 py-3 m-0 text-left ${
          location.pathname === "/" ? "bg-info text-white" : "bg-white"
        }`}
        style={{ borderTop: "1px solid #cccccc" }}
        onClick={hideMenu}
      >
        <FcHome size="24" style={{ verticalAlign: "bottom" }} />
        <span className="ml-2" style={{ fontSize: "16px" }}>
          Dashboard
        </span>
      </Link>

      <Link
        to="/customers"
        className={`btn w-100 px-4 py-3 m-0 text-left ${
          location.pathname === "/customers" ? "bg-info text-white" : "bg-white"
        }`}
        style={{ borderTop: "1px solid #cccccc" }}
        onClick={hideMenu}
      >
        <FcBusinessman size="24" style={{ verticalAlign: "bottom" }} />
        <span className="ml-2" style={{ fontSize: "16px" }}>
          Customers
        </span>
      </Link>

      <Link
        to="/reports"
        className={`btn w-100 px-4 py-3 m-0 text-left ${
          location.pathname === "/reports" ? "bg-info text-white" : "bg-white"
        }`}
        style={{ borderTop: "1px solid #cccccc" }}
        onClick={hideMenu}
      >
        <FcTodoList size="24" style={{ verticalAlign: "bottom" }} />
        <span className="ml-2" style={{ fontSize: "16px" }}>
          Removal Process
        </span>
      </Link>

      <a
        href="https://deletemenow.zendesk.com/"
        target="_blank"
        rel="noreferrer"
        className={`btn w-100 px-4 py-3 m-0 text-left ${
          location.pathname === "/supports" ? "btn-info" : "btn-white"
        }`}
        style={{ borderTop: "1px solid #cccccc" }}
        onClick={hideMenu}
      >
        <FcCustomerSupport size="24" style={{ verticalAlign: "bottom" }} />
        <span className="ml-2" style={{ fontSize: "16px" }}>
          Support
        </span>
      </a>
    </>
  );
}
