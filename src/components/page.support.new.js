import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import { Container, Card, Form, Alert } from "react-bootstrap";

import { PageLoading } from "../utils/page-status.util";
import Breadcrumb from "../utils/breadcrumb.util";
import { useFormInput } from "../utils/form-input.util";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";

import {
  supportGetUserIdByEmailService,
  supportCreateTicketService,
} from "../services/support.service";

import { HiOutlineArrowLeft } from "react-icons/hi";

export default function Support() {
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

  const history = useHistory();
  const { username, name } = auth_obj.user;
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [showThankyou, setShowThankyou] = useState(false);
  const [validated, setValidated] = useState(false);

  const [ticketUserId, setTicketUserId] = useState("");

  const email = useFormInput("");
  const subject = useFormInput("");
  const comment = useFormInput("");

  useEffect(() => {
    async function fetchData() {
      setPageLoading(true);

      const ticketUserIdData = await supportGetUserIdByEmailService(
        username,
        name
      );
      if (!ticketUserIdData.error) {
        setTicketUserId(ticketUserIdData.data);
      }

      setPageLoading(false);
    }
    fetchData();
  }, [dispatch, username, name]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      const ticket = {
        subject: subject.value,
        comment: { body: comment.value },
        requester: { email: email.value },
        submitter_id: ticketUserId,
      };

      setPageLoading(true);
      const data = await supportCreateTicketService(ticket);
      if (data.error) {
        setPageError("Server Error! Please retry...");
      } else {
        setShowThankyou(true);
      }
      setPageLoading(false);
    }

    setValidated(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.push("/supports");
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
                    Your ticket has been submitted successfully.
                  </p>

                  <button className="btn btn-green" onClick={handleCancel}>
                    Back to Ticket list
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
                <Card.Header className="bg-info">
                  <h5 className="m-0 text-white">It's not you. It's us...</h5>
                </Card.Header>

                <Card.Body>
                  <Alert variant="danger">
                    Something went wrong. Please try again later.
                  </Alert>

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
      <Container className="position-relative p-5">
        <Breadcrumb
          breadcrumb={{
            parentPath: "Tickets",
            parentLink: "/supports",
            activePath: "New Ticket",
          }}
        />

        <h1 className="m-5 text-center text-navy text-uppercase">
          Submit <span className="text-info">A Ticket</span>
        </h1>

        <Link to="/supports" className="btn btn-outline-info mb-3">
          <HiOutlineArrowLeft size="20" className="align-middle" />
        </Link>

        <Card className="mb-5 border-0">
          <Card.Body className="bg-light-blue position-relative">
            <Form
              autoComplete="off"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <Form.Group>
                <Form.Label>Customer Email</Form.Label>
                <Form.Control
                  required
                  id="email"
                  name="email"
                  type="email"
                  {...email}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  required
                  id="subject"
                  name="subject"
                  type="text"
                  {...subject}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  id="comment"
                  name="comment"
                  type="text"
                  {...comment}
                />
              </Form.Group>

              <button className="btn btn-green m-0 mr-2 ml-auto" type="submit">
                Submit a Ticket
              </button>

              <button
                className="btn btn-outline-green m-0"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </Form>
          </Card.Body>
          <Card.Footer className="py-1 bg-info border-0"></Card.Footer>
        </Card>
      </Container>

      <PageError />
      <ThankyouPopup />
      <PageLoading pageLoading={pageLoading} />
    </>
  );
}
