import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";

import PrivateRoute from "./private.route";
import PublicRoute from "./public.route";

import Menu from "../components/menu";
import Header from "../components/header";
import Footer from "../components/footer";
import Login from "../components/login";
import Reset from "../components/reset";
import PageDashboard from "../components/page.dashboard";
import CustomerList from "../components/page.customer.list";
import CustomerDetail from "../components/page.customer.detail";
import AccountOrders from "../components/page.account.orders";
import AccountPayment from "../components/page.account.payment";
import AccountReferral from "../components/page.account.referral";
import AccountSecurity from "../components/page.account.security";
import ReportList from "../components/page.report.list";
import ProcessList from "../components/page.report.detail";

export default function MainRouter() {
  const auth_obj = useSelector((state) => state.auth);
  const { isAuthenticated } = auth_obj;

  return (
    <div id="content" className="d-flex flex-row">
      <Router>
        {isAuthenticated && (
          <div
            className="page-left shadow vh-100 bg-white navigation"
            style={{ width: "270px", position: "fixed", top: "0", zIndex: "9" }}
          >
            <Menu />
          </div>
        )}

        <div
          className="page-right w-100 min-vh-100 d-flex flex-column"
          style={{ paddingLeft: isAuthenticated ? "270px" : "0" }}
        >
          {isAuthenticated && <Header />}
          <main>
            <Switch>
              <PublicRoute
                exact
                path="/login"
                component={Login}
                isAuthenticated={isAuthenticated}
              />

              <PublicRoute
                exact
                path="/reset/:id"
                component={Reset}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                exact
                path="/"
                component={PageDashboard}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                exact
                path="/customers"
                component={CustomerList}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                exact
                path="/customers/:id"
                component={CustomerDetail}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                exact
                path="/account/orders"
                component={AccountOrders}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                exact
                path="/account/payment"
                component={AccountPayment}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                exact
                path="/account/referral"
                component={AccountReferral}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                exact
                path="/account/security"
                component={AccountSecurity}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                exact
                path="/reports"
                component={ReportList}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                exact
                path="/reports/:id"
                component={ProcessList}
                isAuthenticated={isAuthenticated}
              />

              <Redirect to={isAuthenticated ? "/" : "/login"} />
            </Switch>
          </main>
          {isAuthenticated && <Footer />}
        </div>
      </Router>
    </div>
  );
}
