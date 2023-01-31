import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  Container,
  Table,
  Card,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";

import { PageLoading } from "../utils/page-status.util";
import Breadcrumb from "../utils/breadcrumb.util";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import {
  customerGetAllService,
  customerUpdateStatusService,
} from "../services/customer.service";

import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { FcSettings } from "react-icons/fc";

export default function Customers() {
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

  const { userId, access } = auth_obj.user;

  const [error, setError] = useState("");

  const [customers, setCustomers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [sortBy, setSortBy] = useState("customer");
  const [sortDirection, setSortDirection] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setPageLoading(true);

      if (access?.customers === 0) {
        setError("You have no permission to view the customer list.");
      } else {
        const customerList = await customerGetAllService();

        if (!customerList.error) {
          setCustomers(customerList.data);
        }
      }

      setPageLoading(false);
    }
    fetchData();
  }, [dispatch, access?.customers]);

  const Customer = (props) => (
    <tr>
      <td>
        <Link to={"/customers/" + props.customer._id}>
          {props.customer.fName} {props.customer.mName} {props.customer.lName}
        </Link>
      </td>
      <td>{props.customer.email}</td>
      <td>{props.customer.phone}</td>
      <td className="text-capitalize">
        {props.customer.subscription?.status === "active" ||
        props.customer.subscription?.status === "trialing" ? (
          <span className="text-info font-weight-bold">Active</span>
        ) : props.customer.role === "master" ? (
          <span className="text-danger font-weight-bold">Cancelled</span>
        ) : (
          <>
            <small className="font-weight-bold">Member Account</small>
            <br />
            <a href={`/customers/${props.customer.masterId}`}>
              <small>View Main Account</small>
            </a>
          </>
        )}
      </td>
      <td className="text-capitalize">{props.customer.status}</td>
      <td>
        {moment(new Date(props.customer.updated_at)).format(
          "MMM DD, YYYY hh:mm"
        )}
      </td>
      <td>
        <DropdownButton
          menuAlign="right"
          title={<FcSettings size="24" className="align-top mx-1" />}
          id="actions"
          variant="white"
        >
          <Dropdown.Item eventKey="1">
            <button
              className="btn w-100 text-left"
              onClick={() => handleUpdate(props.customer, "not-started")}
            >
              Not Started
            </button>
          </Dropdown.Item>
          <Dropdown.Item eventKey="2">
            <button
              className="btn w-100 text-left"
              onClick={() => handleUpdate(props.customer, "progress")}
            >
              In Progress
            </button>
          </Dropdown.Item>
          <Dropdown.Item eventKey="3">
            <button
              className="btn w-100 text-left"
              onClick={() => handleUpdate(props.customer, "stuck")}
            >
              Stuck
            </button>
          </Dropdown.Item>
          <Dropdown.Item eventKey="4">
            <button
              className="btn w-100 text-left"
              onClick={() => handleUpdate(props.customer, "completed")}
            >
              Completed and Monitoring
            </button>
          </Dropdown.Item>
          <Dropdown.Divider />
        </DropdownButton>
      </td>
    </tr>
  );

  const handleUpdate = async (customer, status) => {
    setPageLoading(true);

    await customerUpdateStatusService(customer._id, status);

    const customerList = await customerGetAllService();

    if (!customerList.error) {
      setCustomers(customerList.data);
    }

    setPageLoading(false);
  };

  const customerList = (customers, sortBy, sortDirection) => {
    if (sortBy === "customer") {
      customers.sort((a, b) => {
        if (sortDirection) {
          if (a.fName.toUpperCase() > b.fName.toUpperCase()) {
            return 1;
          } else {
            return -1;
          }
        } else {
          if (a.fName.toUpperCase() > b.fName.toUpperCase()) {
            return -1;
          } else {
            return 1;
          }
        }
      });
    }

    if (sortBy === "email") {
      customers.sort((a, b) => {
        if (sortDirection) {
          if (a.email?.toUpperCase() > b.email?.toUpperCase()) {
            return 1;
          } else {
            return -1;
          }
        } else {
          if (a.email?.toUpperCase() > b.email?.toUpperCase()) {
            return -1;
          } else {
            return 1;
          }
        }
      });
    }

    if (sortBy === "subscription") {
      customers.sort((a, b) => {
        if (sortDirection) {
          if (
            a.subscription?.status?.toUpperCase() <
              b.subscription?.status?.toUpperCase() ||
            b.subscription?.status?.toUpperCase() === "" ||
            b.subscription?.status?.toUpperCase() === undefined
          ) {
            return 1;
          } else {
            return -1;
          }
        } else {
          if (
            a.subscription?.status?.toUpperCase() <
              b.subscription?.status?.toUpperCase() ||
            b.subscription?.status?.toUpperCase() === "" ||
            b.subscription?.status?.toUpperCase() === undefined
          ) {
            return -1;
          } else {
            return 1;
          }
        }
      });
    }

    return customers.map(function (customer, index) {
      if (access?.customers === 2) {
        return (
          <Customer customer={customer} eventKey={index + 1} key={index} />
        );
      } else if (customer.assignee?._id === userId) {
        return (
          <Customer customer={customer} eventKey={index + 1} key={index} />
        );
      } else {
        return <tr key={index}></tr>;
      }
    });
  };

  const handleSort = (sortBy, sortDirection) => {
    setSortBy(sortBy);
    setSortDirection(sortDirection);
  };

  const PageError = () => {
    return (
      <>
        {error && (
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
                <Card.Header className="text-white bg-danger">
                  <h5 className="m-0 text-center">Permission Denied</h5>
                </Card.Header>

                <Card.Body>
                  <p className="text-muted">{error}</p>
                </Card.Body>

                <button
                  className="btn btn-outline-green"
                  onClick={() => setError("")}
                >
                  Close
                </button>
              </Card>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Container className="position-relative p-5">
        <Breadcrumb
          breadcrumb={{
            parentPath: "",
            parentLink: "",
            activePath: "Customers",
            btnLink: "",
            btnText: "",
          }}
        />
        <h1 className="m-5 text-center text-navy text-uppercase">
          Customer <span className="text-info">List</span>
        </h1>

        <Table striped bordered>
          <thead className="bg-navy text-white">
            <tr>
              <th style={{ width: "150px" }}>
                <span
                  className="d-flex"
                  onClick={() => handleSort("customer", !sortDirection)}
                >
                  Customer
                  {sortBy === "customer" &&
                    (sortDirection ? (
                      <AiFillCaretDown className="m-1" />
                    ) : (
                      <AiFillCaretUp className="m-1" />
                    ))}
                </span>
              </th>
              <th style={{ width: "100px" }}>
                <span
                  className="d-flex"
                  onClick={() => handleSort("email", !sortDirection)}
                >
                  Email
                  {sortBy === "email" &&
                    (sortDirection ? (
                      <AiFillCaretDown className="m-1" />
                    ) : (
                      <AiFillCaretUp className="m-1" />
                    ))}
                </span>
              </th>
              <th style={{ width: "120px" }}>Phone</th>
              <th style={{ width: "250px" }}>
                <span
                  className="d-flex"
                  onClick={() => handleSort("subscription", !sortDirection)}
                >
                  Subscription
                  {sortBy === "subscription" &&
                    (sortDirection ? (
                      <AiFillCaretDown className="m-1" />
                    ) : (
                      <AiFillCaretUp className="m-1" />
                    ))}
                </span>
              </th>
              <th style={{ width: "150px" }}>Status</th>
              <th style={{ width: "150px" }}>Last Updated</th>
              <th style={{ width: "100px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>{customerList(customers, sortBy, sortDirection)}</tbody>
        </Table>
      </Container>

      <PageLoading pageLoading={pageLoading} />
      <PageError />
    </>
  );
}
