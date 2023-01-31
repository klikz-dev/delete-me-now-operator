import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Table from "react-bootstrap/Table";
import { Container, Card } from "react-bootstrap";

import { PageLoading } from "../utils/page-status.util";
import Breadcrumb from "../utils/breadcrumb.util";

import {
  verifyTokenAsync,
  userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { customerGetInvoicesService } from "../services/customer.service";

export default function AccountOrders() {
  /*
   * Private Page Token Verification Module.
   */
  const auth_obj = useSelector((state) => state.auth);
  const { token, expiredAt } = auth_obj;
  const dispatch = useDispatch();
  useEffect(() => {
    setAuthToken(token);
    const verifyTokenTimer = setTimeout(() => {
      dispatch(verifyTokenAsync(true));
    }, moment(expiredAt).diff() - 10 * 1000);
    return () => {
      clearTimeout(verifyTokenTimer);
    };
  }, [expiredAt, token, dispatch]);
  /* ----------------------- */

  const { userId } = auth_obj.user;

  const [invoices, setInvoices] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setPageLoading(true);

      const invoiceList = await customerGetInvoicesService(userId);

      if (invoiceList.error) {
        dispatch(userLogoutAsync());
      } else {
        setInvoices(invoiceList.data);
      }

      setPageLoading(false);
    }
    fetchData();
  }, [dispatch, userId]);

  const Invoice = (props) => (
    <tr>
      <td>{props.invoice.id}</td>
      <td>${props.invoice.subtotal}</td>
      <td>{props.invoice.status}</td>
      <td>{props.invoice.paid === 0 ? "No" : "Yes"}</td>
      <td>
        {moment(new Date(props.invoice.created_at)).format("MMM DD, YYYY")}
      </td>
      <td>
        {moment(new Date(props.invoice.next_payment_attempt * 1000)).format(
          "MMM DD, YYYY"
        )}
      </td>
      <td>{props.invoice.attempted}</td>
    </tr>
  );

  const invoiceList = (invoices) => {
    return invoices.map(function (invoice, index) {
      return <Invoice invoice={invoice} index={index} key={index} />;
    });
  };

  const PageError = () => {
    return (
      <>
        {pageError && (
          <div
            className="position-fixed w-100 h-100 custom--desktop-padding-left-270"
            style={{ zIndex: "1000", top: "0", left: "0", minHeight: "100vh" }}
          >
            <div
              className="d-flex flex-column justify-content-center align-items-center w-100 h-100 px-3"
              style={{
                backgroundColor: "rgba(255, 255, 255, .8)",
              }}
            >
              <Card className="shadow" style={{ maxWidth: "500px" }}>
                <Card.Header
                  style={{ backgroundColor: "rgba(3, 169, 244, 0.6)" }}
                >
                  <h5 className="m-0 text-center">Error</h5>
                </Card.Header>

                <Card.Body>
                  <p className="text-muted">{pageError}</p>

                  <button
                    className="btn btn-outline-green"
                    onClick={() => setPageError("")}
                  >
                    Close
                  </button>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Container className="p-5">
        <Breadcrumb
          breadcrumb={{
            parentPath: "",
            parentLink: "",
            activePath: "Invoices",
            btnLink: "",
            btnText: "",
          }}
        />

        <h1 className="m-5 text-center">Invoices</h1>

        <Card className="shadow">
          <Table responsive className="m-0">
            <thead className="bg-navy text-white">
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Paid</th>
                <th>Created Date</th>
                <th>Next Billing Date</th>
                <th>Attempts</th>
              </tr>
            </thead>

            <tbody>{invoiceList(invoices)}</tbody>
          </Table>
        </Card>
      </Container>

      <PageError />
      <PageLoading pageLoading={pageLoading} />
    </>
  );
}
