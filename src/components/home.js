import React, { useRef } from "react";
import { Link } from "react-router-dom";

import { Navbar, Nav } from "react-bootstrap";

import logo_dark from "./../assets/images/logo-dark.png";
import img_footer from "./../assets/images/south-florida-security.jpg";

import how_it_works_1 from "./../assets/images/home/how-it-works-1.png";
import how_it_works_2 from "./../assets/images/home/how-it-works-2.png";
import how_it_works_3 from "./../assets/images/home/how-it-works-3.png";
import how_it_works_4 from "./../assets/images/home/how-it-works-4.png";

import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";

export default function Home() {
  const scrollToRefObject = (ref) => window.scrollTo(0, ref.current.offsetTop);

  const pricingForm = useRef(null);
  const goPricing = () => {
    scrollToRefObject(pricingForm);
  };

  return (
    <div
      className="row w-100 m-0"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='317' height='317' viewBox='0 0 200 200'%3E%3Cpolygon fill='%23DCEFFA' fill-opacity='0.5' points='100 0 0 100 100 100 100 200 200 100 200 0'/%3E%3C/svg%3E")`,
      }}
    >
      <div className="container-fluid p-0">
        <div className="header shadow px-lg-5 py-1 bg-white">
          <Navbar collapseOnSelect expand="lg" variant="light">
            <Link to="/" className="mr-4 mr-xl-5">
              <img
                src={logo_dark}
                width="250"
                height="auto"
                alt="DeleteMeNow"
              />
            </Link>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />

            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ml-auto">
                <Link
                  to="/login"
                  className="mr-4 mr-xl-5 text-dark font-weight-bold"
                  style={{ lineHeight: "3.625rem" }}
                >
                  Log in
                </Link>
                <a
                  href="https://deletemenow.com/service/"
                  target="_blank"
                  rel="noreferrer"
                  className="m-auto btn btn-navy font-weight-bold"
                >
                  Protect me!
                </a>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>

        <div className="hero px-3 py-5">
          <div className="row m-0 py-5">
            <div className="col d-flex flex-column justify-content-center">
              <div style={{ maxWidth: "800px", margin: "auto" }}>
                <h1 className="font-weight-bold mb-4 text-navy">
                  Data Brokers Are Selling Your Personal Info All Over The
                  Internet — We’re Here To Give You Your Privacy Back.
                </h1>
                <h4 className="mb-5">
                  Want to get your personal information removed from the
                  internet so you can live a more secure and private life?
                  DeleteMeNow can help.
                </h4>
                <button
                  className="btn btn-green font-weight-bold"
                  onClick={goPricing}
                >
                  Yes, protect me all year
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="about">
          <div className="row m-0 py-5 bg-white">
            <div className="container py-3 px-lg-5">
              <h6 className="font-weight-bold text-info text-center">
                Delete Me Now
              </h6>
              <h2 className="font-weight-bold text-center mb-5">Who We Are?</h2>
              <p className="text-center">
                DeleteMeNow is your trusted and professional source for personal
                data removal from even the deepest depths of the internet. We
                specialize in finding and deleting all of your personal
                information so you can live a more private life and reduce your
                digital footprint. Our expert team has nearly a decade of
                experience working with the top data broker sites, making
                DeleteMeNow a trusted privacy solution for all.
              </p>
            </div>
          </div>
        </div>

        <div id="steps">
          <div className="row m-0 pt-5 bg-white border">
            <div className="container py-3 px-lg-5">
              <h6 className="font-weight-bold text-info text-center">
                Delete Me Now
              </h6>
              <h2 className="font-weight-bold text-center mb-5">
                How Does DeleteMeNow Work?
              </h2>
              <div className="row pt-4">
                <div className="col-12 col-md-6 mb-5">
                  <div className="d-flex">
                    <div className="features-icon mr-3">
                      <img
                        src={how_it_works_1}
                        width="50"
                        alt="Submit the information"
                      />
                    </div>
                    <div className="features-text">
                      <h5 className="font-weight-bold">Step 1.</h5>
                      <p>
                        Submit the information you want removed from search
                        engines.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-5">
                  <div className="d-flex">
                    <div className="features-icon mr-3">
                      <img
                        src={how_it_works_2}
                        width="50"
                        alt="Submit the information"
                      />
                    </div>
                    <div className="features-text">
                      <h5 className="font-weight-bold">Step 2.</h5>
                      <p>
                        DeleteMeNow’s expert team finds all of that information
                        across the web and removes it.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-5">
                  <div className="d-flex">
                    <div className="features-icon mr-3">
                      <img
                        src={how_it_works_3}
                        width="50"
                        alt="Submit the information"
                      />
                    </div>
                    <div className="features-text">
                      <h5 className="font-weight-bold">Step 3.</h5>
                      <p>
                        You receive a customized and detailed report in 7 days
                        that shows your data has been removed.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-5">
                  <div className="d-flex">
                    <div className="features-icon mr-3">
                      <img
                        src={how_it_works_4}
                        width="50"
                        alt="Submit the information"
                      />
                    </div>
                    <div className="features-text">
                      <h5 className="font-weight-bold">Step 4.</h5>
                      <p>
                        We continue to sweep the web for your personal
                        information and ensure that it stays off the internet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={pricingForm} id="services">
          <div className="row m-0 pt-5 bg-white">
            <div className="container py-3 px-lg-5">
              <h6 className="font-weight-bold text-info text-center">
                Delete Me Now
              </h6>
              <h2 className="font-weight-bold text-center mb-5">
                Our Services
              </h2>
              <p className="text-center">
                We offer packages that are tailored to individual needs as well
                as groups.
                <br /> Click Learn More to find out which package is right for
                you.
              </p>
              <div className="row pt-4">
                <div className="col-12 col-md-4 mb-5">
                  <div className="text-center">
                    <h3 className="font-weight-bold text-center">Deluxe</h3>
                    <p className="text-center">
                      Personal information removal for one person over one year.
                    </p>
                    <a
                      href="https://deletemenow.com/service/"
                      target="_blank"
                      rel="noreferrer"
                      className="m-auto btn btn-outline-navy font-weight-bold"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
                <div className="col-12 col-md-4 mb-5">
                  <div className="text-center">
                    <h3 className="font-weight-bold text-center">
                      Dual Deluxe
                    </h3>
                    <p className="text-center">
                      Personal information removal for two people over one year.
                    </p>
                    <a
                      href="https://deletemenow.com/service/"
                      target="_blank"
                      rel="noreferrer"
                      className="m-auto btn btn-outline-navy font-weight-bold"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
                <div className="col-12 col-md-4 mb-5">
                  <div className="text-center">
                    <h3 className="font-weight-bold text-center">
                      Dual Ultimate
                    </h3>
                    <p className="text-center">
                      Personal information removal for two people over two
                      years.
                    </p>
                    <a
                      href="https://deletemenow.com/service/"
                      target="_blank"
                      rel="noreferrer"
                      className="m-auto btn btn-outline-navy font-weight-bold"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer py-1">
          <div
            style={{
              height: "33vw",
            }}
            className="position-relative overflow-hidden"
          >
            <img
              src={img_footer}
              className="w-100 image-fluid"
              alt="Security"
            />
            <div
              className="position-absolute w-100 h-100"
              style={{ top: "0", left: "0", backgroundColor: "#17a2b833" }}
            ></div>
          </div>
          <div className="row m-0 shadow bg-info pt-3 pb-4">
            <div className="container">
              <div className="row">
                <div className="col">
                  <FaFacebookSquare
                    size="20"
                    color="#ffffff"
                    className="mr-2"
                  />
                  <FaLinkedin size="20" color="#ffffff" className="mr-2" />
                  <FaTwitterSquare size="20" color="#ffffff" className="mr-2" />
                  <FaInstagramSquare
                    size="20"
                    color="#ffffff"
                    className="mr-2"
                  />
                </div>

                <div className="col text-right">
                  <Link
                    to="/terms"
                    className="mr-2 mr-xl-3 text-white font-weight-bold"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    to="/privacy"
                    className="mr-2 mr-xl-3 text-white font-weight-bold"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
