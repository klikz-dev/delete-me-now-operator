import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Container, Form, Row, Col, Card } from "react-bootstrap";
import Avatar from "react-avatar";

import { PageLoading } from "../utils/page-status.util";
import Breadcrumb from "../utils/breadcrumb.util";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import {
  customerGetService,
  customerGetReportIDService,
  customerGetMembersService,
} from "../services/customer.service";
import {
  stripeGetSubscriptionService,
  stripeGetPaymentByIdService,
} from "../services/subscriptions.service";

import { HiOutlineArrowLeft } from "react-icons/hi";

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

  const { id } = useParams();
  const [customer, setCustomer] = useState({
    fName: "",
    lName: "",
    email: "",
    phone: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    created_at: "",
    updated_at: "",
    currency: "",
    default_card: "",
    deleted_at: "",
    ip_address: "",
    note: "",
    altNames: [],
    altEmails: [],
    altPhones: [],
    altAddresses: [],
  });
  const [subscription, setSubscription] = useState([]);
  const [payment, setPayment] = useState({});
  const [reportId, setReportId] = useState("");
  const [showDataSheet, setShowDataSheet] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setPageLoading(true);

      const customerData = await customerGetService(id);

      if (!customerData.error) {
        setCustomer(customerData.data);
      }

      if (customer.subscriptionId !== undefined) {
        const subscriptionData = await stripeGetSubscriptionService(
          customer.subscriptionId
        );

        if (!subscriptionData.error) {
          setSubscription(subscriptionData.data);
        }
      }

      if (customer.paymentId !== undefined) {
        const paymentData = await stripeGetPaymentByIdService(
          customer.paymentId
        );

        if (!paymentData.error) {
          setPayment(paymentData.data);
        }
      }

      const reportData = await customerGetReportIDService(id);

      if (!reportData.error) {
        setReportId(reportData.data._id);
      }

      const membersData = await customerGetMembersService(id);
      if (!membersData.error) {
        setMembers(membersData.data);
      }

      setPageLoading(false);
    }
    fetchData();
  }, [dispatch, id, customer.subscriptionId, customer.paymentId]);

  const handleShowDataSheet = (e) => {
    e.preventDefault();

    setShowDataSheet(true);
  };

  const listAltNames = (altNames) => {
    return altNames.map((altName, index) => {
      return (
        <p className="mb-1" key={index}>
          {altName.fName}
          {altName.mName ? " " + altName.mName : ""} {altName.lName}
        </p>
      );
    });
  };

  const listAltEmails = (altEmails) => {
    return altEmails.map((altEmail, index) => {
      return (
        <p className="mb-1" key={index}>
          {altEmail}
        </p>
      );
    });
  };

  const listAltPhones = (altPhones) => {
    return altPhones.map((altPhone, index) => {
      return (
        <p className="mb-1" key={index}>
          {altPhone}
        </p>
      );
    });
  };

  const listAltAddresses = (altAddresses) => {
    return altAddresses.map((altAddress, index) => {
      return (
        <p className="mb-1" key={index}>
          {altAddress.street1}
          {altAddress.street2 ? " " + altAddress.street2 : ""},{" "}
          {altAddress.city}, {altAddress.state} {altAddress.zip}
        </p>
      );
    });
  };

  const DataSheet = (props) => {
    return (
      <>
        {showDataSheet && (
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
              <Card
                className="shadow"
                style={{
                  maxWidth: "800px",
                  width: "800px",
                  maxHeight: "800px",
                  overflowY: "scroll",
                }}
              >
                <Card.Header className="bg-info text-white">
                  <h5 className="m-0 text-center">Customer Data Sheet</h5>
                </Card.Header>

                <Card.Body>
                  <Row>
                    <Col>
                      <h5>Primary Name</h5>
                      <p>
                        {customer.fName} {customer.mName} {customer.lName}
                      </p>
                      <h6>Alternative Names</h6>
                      {props.customer.altNames !== undefined &&
                        listAltNames(props.customer.altNames)}
                    </Col>

                    <Col>
                      <h5>Primary Email Address</h5>
                      <p>{customer.email}</p>
                      <h6>Alternative Emails</h6>
                      {props.customer.altEmails !== undefined &&
                        listAltEmails(props.customer.altEmails)}
                    </Col>

                    <Col>
                      <h5>Primary Phone Number</h5>
                      <p>{customer.phone}</p>
                      <h6>Alternative Phones</h6>
                      {props.customer.altPhones !== undefined &&
                        listAltPhones(props.customer.altPhones)}
                    </Col>
                  </Row>

                  <hr className="my-3" />

                  <Row>
                    <Col>
                      <h5>Current Address</h5>
                      <p>
                        {customer.street1}, {customer.street2}, {customer.city},{" "}
                        {customer.state} {customer.zip}
                      </p>
                      <h6>Alternative Addresses</h6>
                      {props.customer.altAddresses !== undefined &&
                        listAltAddresses(props.customer.altAddresses)}
                    </Col>
                  </Row>

                  <button
                    className="btn btn-outline-green mt-5 mb-2"
                    onClick={() => setShowDataSheet(false)}
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

  const Member = (props) => (
    <a href={`/customers/${props.member._id}`}>
      {props.member.fName} {props.member.mName} {props.member.lName}
    </a>
  );

  const memberList = (members) => {
    return members.map((member, index) => {
      return <Member member={member} key={index} />;
    });
  };

  return (
    <>
      <Container className="position-relative p-5">
        <Breadcrumb
          breadcrumb={{
            parentPath: "Customers",
            parentLink: "/customers",
            activePath: "Detail",
            btnLink: "",
            btnText: "",
          }}
        />

        <div className="mb-3">
          <div className="mr-auto">
            <Link to="/customers" className="btn btn-outline-info">
              <HiOutlineArrowLeft size="20" className="align-middle" />
            </Link>

            <h4 className="d-inline-block mb-0 ml-3 align-middle">
              {customer.fName} {customer.mName} {customer.lName}
            </h4>
          </div>

          <div></div>
        </div>

        <Form autoComplete="off">
          <Row>
            <Col lg="8">
              <Card className="shadow">
                <div className="p-4 border-bottom">
                  <div className="d-flex mb-4">
                    <Avatar
                      name={`${customer.fName} ${customer.mName} ${customer.lName}`}
                      round={true}
                      size={60}
                      className="mt-1"
                    />
                    <div className="d-inline-block ml-3">
                      <h5 className="mb-1">
                        {customer.fName} {customer.mName} {customer.lName}
                      </h5>
                      <p className="mb-1">
                        {customer.city}, {customer.state}
                      </p>
                      <p className="mb-1">
                        Member since{" "}
                        {moment(new Date(customer.created_at)).format(
                          "MMM DD, YYYY"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <Row>
                    <Col>
                      <p className="text-center text-navy mb-1">
                        Next Bill Date
                      </p>
                      <h5 className="text-center mb-0">
                        {subscription.status !== "active" &&
                        subscription.status !== "trialing" ? (
                          <>No subscription</>
                        ) : (
                          <>
                            {moment(
                              new Date(subscription?.current_period_end * 1000)
                            ).format("MMM DD, YYYY")}
                          </>
                        )}
                      </h5>
                    </Col>

                    <Col>
                      <p className="text-center text-navy mb-1">
                        Next Bill Amount
                      </p>
                      <h5 className="text-center mb-0">
                        {subscription.status !== "active" &&
                        subscription.status !== "trialing" ? (
                          <>No subscription</>
                        ) : (
                          <>${subscription.plan.amount / 100}</>
                        )}
                      </h5>
                    </Col>

                    <Col>
                      <p className="text-center text-navy mb-1">
                        Payment Method
                      </p>
                      <h5 className="text-center mb-0">
                        {payment.card !== undefined ? (
                          <>
                            {payment.card.brand} ending in {payment.card.last4}
                          </>
                        ) : (
                          <>No payment method</>
                        )}
                      </h5>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="shadow mb-3">
                <div className="p-4 border-bottom">
                  <div className="d-flex mb-4">
                    <h6 className="mb-0">Customer Overview</h6>
                    {/* <button className="btn text-green ml-auto p-0 m-0">
                      Edit
                    </button> */}
                  </div>

                  <div>
                    <p className="mb-1">{customer.email}</p>
                  </div>
                </div>

                <div className="p-4">
                  <h6 className="mb-3">Address</h6>
                  <p className="mb-0">
                    {customer.fName} {customer.mName} {customer.lName}
                  </p>
                  <p className="mb-0">
                    {customer.street1}, {customer.street2}
                  </p>
                  <p className="mb-0">
                    {customer.city} {customer.state} {customer.zip}
                  </p>
                  <p className="mb-0">
                    {customer.country === "US" && "Unitd States"}
                  </p>
                  <p className="mb-0">{customer.phone}</p>
                </div>
              </Card>

              <Card className="shadow mb-3 p-4">
                <h6>Member Accounts</h6>

                {members.length > 0 ? (
                  memberList(members)
                ) : (
                  <span>No Member Accounts</span>
                )}
              </Card>

              <Card className="shadow mt-3">
                <div className="p-4">
                  <h6 className="mb-3">Action</h6>
                  <button
                    className="btn btn-info d-block w-100 text-center mb-3"
                    onClick={handleShowDataSheet}
                  >
                    DataSheet
                  </button>

                  <Link
                    className="btn btn-green d-block w-100 text-center mb-3"
                    to={`/reports/${reportId}`}
                  >
                    Delete Me!
                  </Link>
                </div>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>

      <PageLoading pageLoading={pageLoading} />
      <DataSheet customer={customer} />
    </>
  );
}
