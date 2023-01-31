import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import csc from "country-state-city";

import { PageLoading } from "../utils/page-status.util";
import { useFormInput } from "../utils/form-input.util";
import Breadcrumb from "../utils/breadcrumb.util";

import {
  verifyTokenAsync,
  userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";

import {
  customerGetService,
  customerUpdateService,
} from "../services/customer.service";

export default function AccountSecurity() {
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
  const [customer, setCustomer] = useState({
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const history = useHistory();
  const [pageError, setPageError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [showThankyou, setShowThankyou] = useState(false);
  const [validated, setValidated] = useState(false);
  const [pwFormValidated, setPwFormValidated] = useState(false);

  const email = useFormInput(customer.email);
  const first_name = useFormInput(customer.first_name);
  const last_name = useFormInput(customer.last_name);
  const address = useFormInput(customer.address);
  const city = useFormInput(customer.city);
  const state = useFormInput(customer.state);
  const zip = useFormInput(customer.zip);
  const country = useFormInput(customer.country);
  const curr_pw = useFormInput("");
  const new_pw = useFormInput("");
  const confirm_pw = useFormInput("");

  useEffect(() => {
    async function getData() {
      const customerData = await customerGetService(userId);
      if (customerData.error) {
        dispatch(userLogoutAsync());
      } else {
        setCustomer((customer) => ({ ...customer, ...customerData.data }));
      }
      setPageLoading(false);
    }
    getData();
  }, [dispatch, userId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      const customer = {
        id: userId,
        email: email.value,
        first_name: first_name.value,
        last_name: last_name.value,
        address: address.value,
        city: city.value,
        state: state.value,
        zip: zip.value,
        country: country.value,
      };

      async function fetchData() {
        setPageLoading(true);
        const result = await customerUpdateService(customer);
        if (result.error) {
          setPageError("Server Error! Please retry...");
        } else {
          setCustomer((customer) => ({ ...customer, ...result.data }));
          setShowThankyou(true);
        }
        setPageLoading(false);
      }
      fetchData();
    }

    setValidated(true);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      if (new_pw.value === confirm_pw.value) {
        setPasswordError("");

        const customer = {
          id: userId,
          curr_pw: curr_pw.value,
          new_pw: new_pw.value,
          confirm_pw: confirm_pw.value,
        };

        setPageLoading(true);
        const result = await customerUpdateService(customer);

        if (result.error) {
          setPasswordError("Server Error! Please retry...");
        } else {
          if (result.data.error) {
            setPasswordError(result.data.error);
          } else {
            setCustomer((customer) => ({ ...customer, ...result.data }));
            setShowThankyou(true);
          }
        }
        setPageLoading(false);
      } else {
        setPasswordError("Password doesn't match.");
      }
    }

    setPwFormValidated(true);
  };

  const ThankyouPopup = () => {
    return (
      <>
        {showThankyou && (
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
                <Card.Header className="bg-info text-white">
                  <h5 className="m-0 text-center">Sucess</h5>
                </Card.Header>

                <Card.Body>
                  <p className="text-muted">
                    The customer has been updated successfully.
                  </p>

                  <button
                    className="btn btn-outline-green"
                    onClick={() => setShowThankyou(false)}
                  >
                    OK
                  </button>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}
      </>
    );
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

  const handleCancel = (e) => {
    e.preventDefault();
    history.push("/customers");
  };

  const CountryOptions = (props) => (
    <option value={props.isoCode}>{props.name}</option>
  );

  const listCountries = () => {
    return csc.getAllCountries().map(function (country, index) {
      return (
        <CountryOptions
          name={country.name}
          isoCode={country.isoCode}
          key={index}
        ></CountryOptions>
      );
    });
  };

  return (
    <>
      <Container className="p-5">
        <Breadcrumb
          breadcrumb={{
            parentPath: "",
            parentLink: "",
            activePath: "Login & Security",
            btnLink: "",
            btnText: "",
          }}
        />
        <h1 className="m-5 text-center">Login & Security</h1>

        <Row>
          <Col>
            <Form
              autoComplete="off"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <Card className="h-100 shadow">
                <Card.Header className="bg-navy">
                  <h5 className="m-0 text-center text-white">
                    Account Settings
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      id="email"
                      name="email"
                      type="email"
                      {...email}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      required
                      id="first_name"
                      name="first_name"
                      type="text"
                      {...first_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid first name.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      id="last_name"
                      name="last_name"
                      type="text"
                      {...last_name}
                    />
                  </Form.Group>

                  <hr />

                  <Form.Label>Address</Form.Label>

                  <Form.Group>
                    <Form.Control
                      required
                      id="address"
                      name="address"
                      type="text"
                      {...address}
                      placeholder="Address"
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid address.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Control
                      required
                      id="city"
                      name="city"
                      type="text"
                      {...city}
                      placeholder="City"
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid city name.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Control
                      required
                      id="state"
                      name="state"
                      type="text"
                      {...state}
                      placeholder="State"
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid state name.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Control
                      required
                      id="zip"
                      name="zip"
                      type="text"
                      {...zip}
                      placeholder="Zip Code"
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid Zipcode.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Control
                      id="country"
                      name="country"
                      as="select"
                      {...country}
                    >
                      {listCountries()}
                    </Form.Control>
                  </Form.Group>

                  <Row>
                    <Col className="d-flex pt-3">
                      <button
                        className="btn btn-green m-0 mr-2 ml-auto"
                        type="submit"
                      >
                        Update
                      </button>

                      <button
                        className="btn btn-outline-green m-0"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Form>
          </Col>

          <Col>
            <Form
              autoComplete="off"
              noValidate
              validated={pwFormValidated}
              onSubmit={handlePasswordUpdate}
            >
              <Card className="shadow">
                <Card.Header className="bg-navy">
                  <h5 className="m-0 text-center text-white">
                    Security Credentials
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      required
                      id="curr_pw"
                      name="curr_pw"
                      type="password"
                      {...curr_pw}
                    />
                    <Form.Control.Feedback type="invalid">
                      Current password required.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      required
                      id="new_pw"
                      name="new_pw"
                      type="password"
                      {...new_pw}
                    />
                    <Form.Control.Feedback type="invalid">
                      Input new password.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      required
                      id="confirm_pw"
                      name="confirm_pw"
                      type="password"
                      {...confirm_pw}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please confirm your password.
                    </Form.Control.Feedback>
                  </Form.Group>

                  {passwordError && (
                    <Row>
                      <Col className="d-flex">
                        <p className="text-danger">{passwordError}</p>
                      </Col>
                    </Row>
                  )}

                  <Row>
                    <Col className="d-flex pt-3">
                      <button
                        className="btn btn-green m-0 mr-2 ml-auto"
                        type="submit"
                      >
                        Update
                      </button>

                      <button
                        className="btn btn-outline-green m-0"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Form>
          </Col>
        </Row>
      </Container>

      <PageLoading pageLoading={pageLoading} />
      <PageError />
      <ThankyouPopup />
    </>
  );
}
