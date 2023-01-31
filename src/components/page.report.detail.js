import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  Container,
  Form,
  Row,
  Col,
  Card,
  Table,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import Avatar from "react-avatar";

import { PageLoading } from "../utils/page-status.util";
import Breadcrumb from "../utils/breadcrumb.util";
import { DownloadPdf } from "../utils/pdf.util";

import {
  verifyTokenAsync,
  userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { customerGetService } from "../services/customer.service";
import {
  removalGetReportService,
  removalGetProcessListService,
  removalUpdateProcesService,
} from "../services/removal.service";

import { HiOutlineArrowLeft } from "react-icons/hi";
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

  const { id } = useParams();

  const [report, setReport] = useState({});
  const [processes, setProcesses] = useState([]);
  const [customer, setCustomer] = useState({
    id: "",
    fName: "",
    mName: "",
    lName: "",
    email: "",
    phone: "",
    address: "",
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
  });
  const [pageLoading, setPageLoading] = useState(true);
  const [formShow, setFormShow] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    async function fetchData() {
      setPageLoading(true);

      const reportData = await removalGetReportService(id);

      if (reportData.error) {
        dispatch(userLogoutAsync());
      } else {
        setReport(reportData.data);
      }

      if (report._id !== undefined) {
        const processData = await removalGetProcessListService(report._id);
        if (!processData.error) {
          setProcesses(processData.data);
        }
      }

      if (report.customerId !== undefined) {
        const customerData = await customerGetService(report.customerId);
        if (!customerData.error) {
          setCustomer(customerData.data);
        }
      }

      setPageLoading(false);
    }
    fetchData();
  }, [dispatch, id, report._id, report.customerId]);

  const handleView = (process) => {
    setFormShow(true);
    setFormData(process);
  };

  const handleNotFound = async (process) => {
    const updateProcess = await removalUpdateProcesService(process._id, {
      status: "not-found",
    });
    if (!updateProcess.error) {
      setPageLoading(true);

      const processData = await removalGetProcessListService(report._id);
      if (!processData.error) {
        setProcesses(processData.data);
      }

      setPageLoading(false);
    }
  };

  const handleSent = async (process) => {
    const updateProcess = await removalUpdateProcesService(process._id, {
      status: "sent",
      type: "notification",
      broker: process.broker.site,
      customerId: customer._id,
      title: "Opt-out Sent!",
      content: `Opt-out verification link for ${process.broker.site} has been submitted.`,
    });
    if (!updateProcess.error) {
      setPageLoading(true);

      const processData = await removalGetProcessListService(report._id);
      if (!processData.error) {
        setProcesses(processData.data);
      }

      setPageLoading(false);
    }
  };

  const handleProcess = async (process) => {
    const updateProcess = await removalUpdateProcesService(process._id, {
      status: "send",
    });
    if (!updateProcess.error) {
      setPageLoading(true);

      const processData = await removalGetProcessListService(report._id);
      if (!processData.error) {
        setProcesses(processData.data);
      }

      setPageLoading(false);
    }
  };

  const handleMonitoring = async (process) => {
    const updateProcess = await removalUpdateProcesService(process._id, {
      status: "monitoring",
    });
    if (!updateProcess.error) {
      setPageLoading(true);

      const processData = await removalGetProcessListService(report._id);
      if (!processData.error) {
        setProcesses(processData.data);
      }

      setPageLoading(false);
    }
  };

  const handleWaiting = async (process) => {
    const updateProcess = await removalUpdateProcesService(process._id, {
      status: "waiting",
      type: "action",
      broker: process.broker.site,
      customerId: customer._id,
      title: "Action Required!",
      content: `Please check your email and complete the verification for ${process.broker.site}.`,
    });
    if (!updateProcess.error) {
      setPageLoading(true);

      const processData = await removalGetProcessListService(report._id);
      if (!processData.error) {
        setProcesses(processData.data);
      }

      setPageLoading(false);
    }
  };

  const handleDeleted = async (process) => {
    const updateProcess = await removalUpdateProcesService(process._id, {
      status: "completed",
      customerId: customer._id,
      type: "notification",
      broker: process.broker.site,
      title: "You have been deleted!",
      content: `Your personal information has been completely removed from ${process.broker.site}.`,
    });

    if (!updateProcess.error) {
      setPageLoading(true);

      const processData = await removalGetProcessListService(report._id);
      if (!processData.error) {
        setProcesses(processData.data);
      }

      setPageLoading(false);
    }
  };

  const cancelView = () => {
    setFormShow(false);
    setFormData({});
  };

  const How = (props) => (
    <p className="mb-1 text-navy">
      <strong>Step {props.index}: </strong>
      {props.how}
    </p>
  );

  const listHowto = (howto) => {
    return howto.map(function (how, index) {
      return <How how={how} index={index} key={index} />;
    });
  };

  const Process = (props) => (
    <tr>
      <td>{props.process.broker.site}</td>
      <td>
        <a
          href={props.process.broker.optoutlink}
          target="_blank"
          rel="noreferrer"
        >
          Click Here
        </a>
      </td>
      <td>{props.process.broker.affiliated}</td>
      <td>{props.process.broker.tasktime}</td>
      <td>{props.process.broker.wait}</td>
      <td>
        {props.process.status === "send" ? (
          "In Process"
        ) : props.process.status === "sent" ? (
          "Opt-out Sent"
        ) : props.process.status === "waiting" ? (
          "Awaiting Customer Verification"
        ) : props.process.status === "not-received" ? (
          <span className="text-danger">Email/SMS not Received</span>
        ) : props.process.status === "not-found" ? (
          "Customer Not Found"
        ) : props.process.status === "monitoring" ? (
          "Actively Monitoring"
        ) : props.process.status === "verified" ? (
          <span className="text-info">Email/SMS Verified</span>
        ) : (
          <span className="text-primary">In Process</span>
        )}
      </td>
      <td>
        {moment(new Date(props.process.updated_at)).format(
          "MMM DD, YYYY, hh:mm"
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
              onClick={() => handleView(props.process)}
            >
              View Details
            </button>
          </Dropdown.Item>
          <Dropdown.Item eventKey="3">
            <button
              className="btn w-100 text-left"
              onClick={() => handleWaiting(props.process)}
            >
              Awaiting Customer Verification
            </button>
          </Dropdown.Item>
          <Dropdown.Item eventKey="2">
            <button
              className="btn w-100 text-left"
              onClick={() => handleSent(props.process)}
            >
              Opt-out Sent
            </button>
          </Dropdown.Item>

          <Dropdown.Item eventKey="4">
            <button
              className="btn w-100 text-left"
              onClick={() => handleDeleted(props.process)}
            >
              Deleted
            </button>
          </Dropdown.Item>
          <Dropdown.Item eventKey="5">
            <button
              className="btn w-100 text-left"
              onClick={() => handleNotFound(props.process)}
            >
              Customer Data Not Found
            </button>
          </Dropdown.Item>
          <Dropdown.Item eventKey="3">
            <button
              className="btn w-100 text-left"
              onClick={() => handleMonitoring(props.process)}
            >
              Actively Monitoring
            </button>
          </Dropdown.Item>
          <Dropdown.Item eventKey="3">
            <button
              className="btn w-100 text-left"
              onClick={() => handleProcess(props.process)}
            >
              In Process
            </button>
          </Dropdown.Item>
        </DropdownButton>
      </td>
    </tr>
  );

  const processList = (processes) => {
    if (processes.length !== 0) {
      return processes.map(function (process, index) {
        return <Process process={process} eventKey={index + 1} key={index} />;
      });
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Container className="position-relative p-5">
        <Breadcrumb
          breadcrumb={{
            parentPath: "Privacy Reports",
            parentLink: "/reports",
            activePath: "#DMN" + id,
            btnLink: "",
            btnText: "",
          }}
        />

        <div className="mb-3">
          <div className="mr-auto">
            <button
              onClick={() => window.location.replace("/reports")}
              className="btn btn-outline-info"
            >
              <HiOutlineArrowLeft size="20" className="align-middle" />
            </button>

            <h4 className="d-inline-block mb-0 ml-3 align-middle">
              Process Report #DMN{report._id}
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
                      <p className="text-center text-navy mb-1">Status</p>
                      <h5 className="text-center mb-0 text-capitalize">
                        {report.status}
                      </h5>
                    </Col>

                    <Col>
                      <p className="text-center text-navy mb-1">Date Created</p>
                      <h5 className="text-center mb-0">
                        {moment(new Date(report.created_at)).format(
                          "MMM DD, YYYY"
                        )}
                      </h5>
                    </Col>

                    <Col>
                      <p className="text-center text-navy mb-1">Last Updated</p>
                      <h5 className="text-center mb-0">
                        {moment(new Date(report.updated_at)).format(
                          "MMM DD, YYYY"
                        )}
                      </h5>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="shadow">
                <div className="p-4 border-bottom">
                  <div className="d-flex mb-4">
                    <h6 className="mb-0">Customer Overview</h6>
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
                  <p className="mb-0">{customer.address}</p>
                  <p className="mb-0">
                    {customer.city} {customer.state} {customer.zip}
                  </p>
                  <p className="mb-0">
                    {customer.country === "US" && "Unitd States"}
                  </p>
                  <p className="mb-0">{customer.phone}</p>
                </div>
              </Card>

              <Card className="shadow">
                <div className="p-4">
                  <h6 className="mb-3">Actions</h6>
                  <div className="mb-0">
                    {!pageLoading && <DownloadPdf report={report} />}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <h1 className="m-5 text-center text-navy text-uppercase">
            Report <span className="text-info">List</span>
          </h1>

          <Table striped bordered>
            <thead className="bg-navy text-white">
              <tr>
                <th>Site</th>
                <th>Optout Link</th>
                <th>Affiliated Company</th>
                <th>Task Time</th>
                <th>Wait Time</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>{processList(processes)}</tbody>
          </Table>
        </Form>
      </Container>

      {formShow && (
        <div
          className="popup-container position-fixed d-flex"
          style={{
            height: "100%",
            width: "100%",
            top: "0",
            left: "0",
            paddingLeft: "270px",
            zIndex: "9",
          }}
        >
          <div className="m-auto" style={{ width: "750px", maxWidth: "90%" }}>
            <Card className="shadow border-0">
              <Card.Body className="bg-light-blue position-relative">
                <button
                  className={`btn btn-info text-uppercase position-absolute`}
                  style={{ top: "0", right: "0" }}
                  onClick={cancelView}
                >
                  x
                </button>

                <h5 className="text-info">Needed</h5>
                <p className="text-navy">{formData.broker.needed}</p>

                <h5 className="text-info">Note</h5>
                <p className="text-navy">{formData.broker.note}</p>

                <h5 className="text-info">How-To Guide</h5>
                {listHowto(formData.broker.howto)}
              </Card.Body>

              <Card.Footer className="py-1 bg-info border-0"></Card.Footer>
            </Card>
          </div>
        </div>
      )}

      <PageLoading pageLoading={pageLoading} />
    </>
  );
}
