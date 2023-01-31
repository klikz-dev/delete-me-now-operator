import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Container, Card, Row, Col } from "react-bootstrap";

import { PageLoading } from "../utils/page-status.util";
import Breadcrumb from "../utils/breadcrumb.util";

import {
  verifyTokenAsync,
  userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { customerGetListService } from "../services/customer.service";
import { supportGetAllTicketsService } from "../services/support.service";

import { FcBusinesswoman } from "react-icons/fc";

import { HiOutlineTicket } from "react-icons/hi";
import { FcBullish } from "react-icons/fc";

export default function Dashboard() {
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

  const [tickets, setTickets] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [customerLength, setCustomerLength] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setPageLoading(true);

      const customerList = await customerGetListService();

      if (customerList.error) {
        dispatch(userLogoutAsync());
      } else {
        let length = 0;
        customerList.data.forEach((customer) => {
          if (customer.assignee._id === userId) length++;
        });

        setCustomerLength(length);
      }

      const ticketsData = await supportGetAllTicketsService();

      if (!ticketsData.error) {
        setTickets(ticketsData.data);
      }

      setPageLoading(false);
    }
    fetchData();
  }, [dispatch, userId]);

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
      <Container className="position-relative py-5 px-5">
        <Breadcrumb
          breadcrumb={{
            parentPath: "",
            parentLink: "",
            activePath: "Dashboard",
            btnLink: "",
            btnText: "",
          }}
        />

        <h1 className="m-5 text-center text-info text-uppercase">Dashboard</h1>

        <Card className="p-4">
          <Card.Body>
            <Row>
              <Col className="d-flex">
                <div className="position-relative mr-4">
                  <FcBusinesswoman size="60" />
                  <span
                    className="position-absolute bg-danger text-white"
                    style={{
                      top: "0",
                      right: "0",
                      padding: "0 8px",
                      borderRadius: "50%",
                    }}
                  >
                    {customerLength}
                  </span>
                </div>

                <div className="">
                  <h3>Customers</h3>
                  <p className="mb-0">
                    There are {customerLength} customers assigned to you.
                  </p>
                </div>
              </Col>

              <Col className="text-right">
                <Link className="btn btn-green mt-3" to="/customers">
                  View All
                </Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mt-5 p-4">
          <Card.Body>
            <Row>
              <Col className="d-flex">
                <div className="position-relative mr-4">
                  <FcBullish size="60" />
                  <span
                    className="position-absolute bg-danger text-white"
                    style={{
                      top: "0",
                      right: "0",
                      padding: "0 8px",
                      borderRadius: "50%",
                    }}
                  >
                    {customerLength}
                  </span>
                </div>

                <div className="">
                  <h3>Privacy Reports</h3>
                  <p className="mb-0">
                    You have {customerLength} active reports assigned to you.
                  </p>
                </div>
              </Col>

              <Col className="text-right">
                <Link className="btn btn-green mt-3" to="/reports">
                  View All
                </Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mt-5 p-4">
          <Card.Body>
            <Row>
              <Col className="d-flex">
                <div className="position-relative mr-4">
                  <HiOutlineTicket size="60" />
                  <span
                    className="position-absolute bg-danger text-white"
                    style={{
                      top: "0",
                      right: "0",
                      padding: "0 8px",
                      borderRadius: "50%",
                    }}
                  >
                    {tickets.length}
                  </span>
                </div>

                <div className="">
                  <h3>Tickets</h3>
                  <p className="mb-0">
                    You have {tickets.length} tickets assigned to you.
                  </p>
                </div>
              </Col>

              <Col className="text-right">
                <a
                  className="btn btn-green mt-3"
                  href="https://deletemenow.zendesk.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  View Tickets
                </a>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>

      <PageError />
      <PageLoading pageLoading={pageLoading} />
    </>
  );
}
