import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Table from "react-bootstrap/Table";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

import { useFormInput } from "../utils/form-input.util";
import { PageLoading } from "../utils/page-status.util";
import Breadcrumb from "../utils/breadcrumb.util";

import {
  verifyTokenAsync,
  userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { customerGetCardsService } from "../services/customer.service";

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

  const [cards, setCards] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  // const [formError, setFormError] = useState("");

  const [creditCard, setCreditCard] = useState({
    name: "",
    number: "",
    cvc: "",
    expiry: "",
    focused: "",
  });

  const name = useFormInput(creditCard.name);
  const number = useFormInput(creditCard.number);
  const cvc = useFormInput(creditCard.cvc);
  const expiry = useFormInput(creditCard.expiry);
  const focused = useFormInput(creditCard.focused);

  useEffect(() => {
    async function fetchData() {
      setPageLoading(true);

      const cardList = await customerGetCardsService(userId);

      if (cardList.error) {
        dispatch(userLogoutAsync());
      } else {
        setCards(cardList.data);
      }

      setPageLoading(false);
    }
    fetchData();
  }, [dispatch, userId]);

  const CardLine = (props) => (
    <tr className="text-center">
      <td>{props.card.brand}</td>
      <td>{props.card.funding}</td>
      <td>{props.card.last4}</td>
      <td>{props.card.exp_date}</td>
      <td>{props.card.country}</td>
      <td>{cards.length === 1 ? "Yes" : props.card.country}</td>
      <td></td>
    </tr>
  );

  const cardList = (cards) => {
    return cards.map(function (card, index) {
      return <CardLine card={card} index={index} key={index} />;
    });
  };

  const handleCardFocus = (e) => {
    setCreditCard({ ...creditCard, focus: e.target.name });
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
      <Container className="position-relative p-5">
        <Breadcrumb
          breadcrumb={{
            parentPath: "",
            parentLink: "",
            activePath: "Payment Methods",
            btnLink: "",
            btnText: "",
          }}
        />

        <h1 className="m-5 text-center">Payment Methods</h1>

        <Card className="shadow">
          <Table responsive className="m-0">
            <thead className="bg-navy text-white text-center">
              <tr>
                <th>Brand</th>
                <th>Funding Source</th>
                <th>Last 4</th>
                <th>Exp Date</th>
                <th>Country</th>
                <th>Default</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>{cardList(cards)}</tbody>
          </Table>
        </Card>
      </Container>

      <Container className="position-relative">
        <h1 className="m-5 text-center">Add a Payment Methods</h1>

        <Row>
          <Col className="text-center">
            <div id="PaymentForm" className="d-inline-flex">
              <Cards
                cvc={cvc.value}
                expiry={expiry.value}
                focused={focused.value}
                name={name.value}
                number={number.value}
              />
              <Form className="ml-5 pt-1" style={{ width: "320px" }}>
                <Form.Group className="mb-2">
                  <Form.Control
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Cardholder Name"
                    {...name}
                    onFocus={handleCardFocus}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control
                    id="number"
                    name="number"
                    type="tel"
                    placeholder="Card Number"
                    {...number}
                    onFocus={handleCardFocus}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control
                    id="cvc"
                    name="cvc"
                    type="number"
                    placeholder="CVC"
                    {...cvc}
                    onFocus={handleCardFocus}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control
                    id="expiry"
                    name="expiry"
                    type="date"
                    placeholder="Expiration Date"
                    {...expiry}
                    onFocus={handleCardFocus}
                  />
                </Form.Group>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

      <PageError />
      <PageLoading pageLoading={pageLoading} />
    </>
  );
}
