import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";

import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

import { removalGetProcessListService } from "../services/removal.service";
import { customerGetService } from "../services/customer.service";

const styles = StyleSheet.create({
  page: {
    padding: "20 10",
    backgroundColor: "#eafcff",
  },
  section: {
    margin: 10,
    padding: 10,
    position: "relative",
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 600,
  },
  h1: {
    fontSize: 36,
    fontWeight: 600,
  },
  h2: {
    fontSize: 30,
    fontWeight: 600,
  },
  h3: {
    fontSize: 24,
    fontWeight: 500,
  },
  body: {
    fontSize: 14,
    fontWeight: 300,
    marginBottom: 15,
  },
});

const Process = (props) => (
  <View
    style={{
      marginHorizontal: 8,
      marginVertical: 15,
      padding: 15,
      border: 2,
      borderColor: "#52cee6",
      borderStyle: "solid",
      borderRadius: 4,
      width: "30%",
    }}
    break={props.index !== 0 && props.index % 9 === 0 ? true : false}
  >
    <Text
      style={{
        fontSize: 14,
        fontWeight: "700",
        color: "#3d4975",
        marginBottom: 20,
      }}
    >
      {props.process.broker.site}
    </Text>

    <Text
      style={{
        fontSize: 8,
        fontWeight: "500",
        color: "#000000",
        marginBottom: 10,
      }}
    >
      Removal Time
    </Text>
    <Text
      style={{
        fontSize: 10,
        fontWeight: "700",
        color: "#17a2b8",
        marginBottom: 20,
      }}
    >
      {props.process.broker === undefined ? "" : props.process.broker.wait}
    </Text>
    <Text
      style={{
        fontSize: 8,
        fontWeight: "500",
        color: "#000000",
        marginBottom: 10,
      }}
    >
      Status
    </Text>
    <Text
      style={{
        fontSize: 12,
        fontWeight: "700",
        color: process.status === "completed" ? "#17a2b8" : "#ffc107",
        marginBottom: 20,
      }}
    >
      {props.process.status === "send"
        ? "In Progress"
        : props.process.status === "sent"
        ? "Opt-out Sent"
        : props.process.status === "waiting"
        ? "Awaiting Verification"
        : props.process.status === "not-received"
        ? "Email/SMS not Received"
        : props.process.status === "not-found"
        ? "Customer Not Found"
        : "CLEAN"}
    </Text>
    <Text style={{ fontSize: 6, fontWeight: "500", color: "#17a2b8" }}>
      — NEXT SCAN IN 90 DAYS OR LESS —
    </Text>
  </View>
);

const listProcesses = (processes) => {
  return processes.map((process, index) => {
    return <Process process={process} key={index} index={index} />;
  });
};

const MyDoc = (props) => {
  const customer = props.customer;
  const report = props.report;
  const processes = props.processes;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            paddingVertical: 70,
            paddingHorizontal: 40,
            position: "relative",
            height: "100%",
          }}
        >
          <View style={styles.section}>
            <Text style={{ fontSize: 12, marginBottom: 120 }}>
              Report #{report._id}
            </Text>
            <Text style={{ fontSize: 20, marginBottom: 10, color: "#17a2b8" }}>
              Privacy Report
            </Text>
            <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 20 }}>
              {customer.fName} {customer.mName} {customer.lName}
            </Text>
            <Text style={{ fontSize: 10, fontWeight: "300", marginBottom: 10 }}>
              {moment(new Date(report.created_at)).format("MMM DD, YYYY")}
            </Text>
          </View>

          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              paddingHorizontal: 40,
            }}
          >
            <View style={styles.section}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  fontSize: 10,
                  fontWeight: "400",
                }}
              >
                <View>
                  <Text>support@deletemenow.com</Text>
                  <Text>833-DELETEME</Text>
                  <Text>833-335-3836</Text>
                </View>

                <View style={{ textAlign: "right", paddingRight: 20 }}>
                  <Text>Abine Inc., PO Box 410009</Text>
                  <Text>Cambridge, MA 02141</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={{ paddingVertical: 70, paddingHorizontal: 40 }}>
            <Text style={{ fontSize: 10, fontWeight: "300", marginBottom: 10 }}>
              {moment(new Date(report.created_at)).format("MMM DD, YYYY")}
            </Text>
            <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 20 }}>
              Dear {customer.fName} {customer.mName} {customer.lName},
            </Text>
            <Text style={styles.body}>
              We've submitted your removals from the people search databases on
              which we found your information. The report below shows each of
              the databases we've scanned, what we found, and what we're doing
              to remove it. After we've submitted each opt-out we go back and
              check each database again to make sure your information has been
              removed.
            </Text>
            <Text style={styles.body}>
              Although all of your listings on our removal list will disappear
              within a month, some will be gone quicker than others. For
              example, the databases that we're able to opt out of online, such
              as Spokeo, have already processed or will process within a few
              days. After removals are complete, Google can take additional time
              to remove from its search cache.
            </Text>
            <Text style={styles.body}>
              New databases will be added to our list as they appear, but don't
              worry -- we'll submit opt-outs for your personal information to
              all new databases we find as well. We'll keep working on your
              behalf and when we have significant updates to this report we'll
              send you an email to let you know.
            </Text>
            <Text style={styles.body}>
              Thank you. Our only business is your privacy!
            </Text>
            <Text style={styles.body}></Text>
            <Text style={styles.body}></Text>
            <Text style={styles.body}></Text>
            <Text style={styles.body}>Ravi S. , Deleteme Privacy Advisor</Text>
            <Text style={styles.body}>support@joindeleteme.com</Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {processes.length > 0 && listProcesses(processes)}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const DownloadPdf = (props) => {
  const report = props.report;
  const [processes, setProcesses] = useState([]);
  const [customer, setCustomer] = useState({});
  const [pdfLoading, setPdfLoading] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchData() {
      setPdfLoading(true);
      const processData = await removalGetProcessListService(report._id);
      if (!processData.error) {
        setProcesses(processData.data);
      }

      if (report.customerId !== undefined) {
        const customerData = await customerGetService(report.customerId);
        if (!customerData.error) {
          setCustomer(customerData.data);
        }
      }
      setPdfLoading(false);
    }
    fetchData();
  }, [dispatch, report._id, report.customerId]);

  return (
    <>
      {pdfLoading && (
        <p className="" disabled={true}>
          Generating...
        </p>
      )}

      {!pdfLoading && (
        <PDFDownloadLink
          className=""
          document={
            <MyDoc customer={customer} processes={processes} report={report} />
          }
          fileName="DeleteMeNow Privacy Report.pdf"
        >
          {({ loading }) => (loading ? "Generating..." : "Download")}
        </PDFDownloadLink>
      )}
    </>
  );
};
