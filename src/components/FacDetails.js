import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import headContext from "../context/Heads/headContext";
import { Table } from "react-bootstrap";
import "./FacDetails.css";
const FacDetails = () => {
  const Navigate = useNavigate();
  useEffect(() => {
    headDetails.getAdmindetails(id);
  }, []);
  const { id } = useParams();
  const headDetails = useContext(headContext);

  const [guidingStuds, setGuidingStuds] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [showDetails2, setShowDetails2] = useState(false);

  const getGuidingStuds = async () => {
    const response = await fetch(
      `http://localhost:5000/api/headauth/guideof/${id}`,
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    setGuidingStuds(json);
    console.log(json);
  };
  function formatDate(date) {
    const temp = new Date(date);
    const xyz = temp.toISOString();
    return xyz.slice(0, 10);
  }

  const handleBack = () => {
    // localStorage.removeItem("hdep");
    Navigate("/fac");
  };

  const [coGuidingStuds, setCoGuidingStuds] = useState({});

  const getCoguidingStuds = async () => {
    const response = await fetch(
      `http://localhost:5000/api/headauth/coguideof/${id}`,
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    setCoGuidingStuds(json);
    console.log(json);
  };

  useEffect(() => {
    getGuidingStuds();
    getCoguidingStuds();
  }, []);

  //   console.log(id);
  return (
    <>
      <button className="btn btn-primary mx-3" onClick={handleBack}>
        Back
      </button>
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#333", fontSize: "32px", marginBottom: "10px" }}>
          {headDetails.adminDetails.full_name}
        </h1>
        <h2 style={{ color: "#666", fontSize: "24px", marginBottom: "5px" }}>
          {headDetails.adminDetails.web_mail}
        </h2>
        <h3 style={{ color: "#999", fontSize: "18px", marginBottom: "20px" }}>
          Department: {headDetails.adminDetails.department}
        </h3>
        <h5>
          Guide of: {guidingStuds ? guidingStuds.length : 0} Students
          <br />
          {guidingStuds.length > 0 && (
            <button
              className="small-btn my-2"
              onClick={() => setShowDetails(!showDetails)}
            >
              Show Details
              <span className="arrow-down"></span>
            </button>
          )}
          {/* <br /> */}
          {showDetails && guidingStuds.length > 0 && (
            <Table
              id="my-table-guide"
              style={{
                backgroundColor: "#fff",
                border: "1.5px solid #000000",
                padding: "10px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1.5px solid #000000" }}>S. No.</th>
                  <th style={{ border: "1.5px solid #000000" }}>Full Name</th>
                  <th style={{ border: "1.5px solid #000000" }}>Roll No</th>
                  <th style={{ border: "1.5px solid #000000" }}>Web Mail</th>
                  <th style={{ border: "1.5px solid #000000" }}>Alt Mail</th>
                  <th style={{ border: "1.5px solid #000000" }}>Guide</th>
                  <th style={{ border: "1.5px solid #000000" }}>Co_Guide</th>
                  <th style={{ border: "1.5px solid #000000" }}>
                    Commencement_Date
                  </th>
                  <th style={{ border: "1.5px solid #000000" }}>
                    PDF_DownloadLink
                  </th>
                </tr>
              </thead>
              {guidingStuds &&
                guidingStuds.map((stud, index) => {
                  return (
                    <tr>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {index + 1}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.full_name}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.rollno}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.web_mail}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.alt_mail}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.Guide !== "Not Set" && stud.Guide}
                        {stud.Guide === "Not Set" && (
                          <div style={{ color: "red" }}>
                            <b>Not Set</b>
                          </div>
                        )}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.Co_Guide !== "Not Set" && stud.Co_Guide}
                        {stud.Co_Guide === "Not Set" && (
                          <div style={{ color: "red" }}>
                            <b>Not Set</b>
                          </div>
                        )}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {Date.parse(stud.Commencement_Date) >
                          Date.parse("2010-08-08") &&
                          formatDate(stud.Commencement_Date)}
                        {Date.parse(stud.Commencement_Date) <=
                          Date.parse("2010-08-08") && (
                          <div style={{ color: "red" }}>
                            <b>Not Set</b>
                          </div>
                        )}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.PDF_DownloadLink !== "Not Set" && (
                          <a href={stud.PDF_DownloadLink} target="_blank">
                            View PDF
                          </a>
                        )}
                        {stud.PDF_DownloadLink === "Not Set" && (
                          <div style={{ color: "red" }}>
                            <b>Not Set</b>
                          </div>
                        )}
                      </th>
                    </tr>
                  );
                })}
            </Table>
          )}
          <br />
          Co-Guide of: {coGuidingStuds ? coGuidingStuds.length : 0} Students
          <br />
          {coGuidingStuds.length > 0 && (
            <button
              className="small-btn my-2"
              onClick={() => setShowDetails2(!showDetails2)}
            >
              Show Details
              <span className="arrow-down"></span>
            </button>
          )}
          {showDetails2 && coGuidingStuds.length > 0 && (
            <Table
              id="my-table2-coguide"
              style={{
                backgroundColor: "#fff",
                border: "1.5px solid #000000",
                padding: "10px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1.5px solid #000000" }}>S. No.</th>
                  <th style={{ border: "1.5px solid #000000" }}>Full Name</th>
                  <th style={{ border: "1.5px solid #000000" }}>Roll No</th>
                  <th style={{ border: "1.5px solid #000000" }}>Web Mail</th>
                  <th style={{ border: "1.5px solid #000000" }}>Alt Mail</th>
                  <th style={{ border: "1.5px solid #000000" }}>Guide</th>
                  <th style={{ border: "1.5px solid #000000" }}>Co_Guide</th>
                  <th style={{ border: "1.5px solid #000000" }}>
                    Commencement_Date
                  </th>
                  <th style={{ border: "1.5px solid #000000" }}>
                    PDF_DownloadLink
                  </th>
                </tr>
              </thead>
              {coGuidingStuds.length &&
                coGuidingStuds.map((stud, index) => {
                  return (
                    <tr>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {index + 1}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.full_name}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.rollno}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.web_mail}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.alt_mail}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.Guide !== "Not Set" && stud.Guide}
                        {stud.Guide === "Not Set" && (
                          <div style={{ color: "red" }}>
                            <b>Not Set</b>
                          </div>
                        )}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.Co_Guide !== "Not Set" && stud.Co_Guide}
                        {stud.Co_Guide === "Not Set" && (
                          <div style={{ color: "red" }}>
                            <b>Not Set</b>
                          </div>
                        )}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {Date.parse(stud.Commencement_Date) >
                          Date.parse("2010-08-08") &&
                          formatDate(stud.Commencement_Date)}
                        {Date.parse(stud.Commencement_Date) <=
                          Date.parse("2010-08-08") && (
                          <div style={{ color: "red" }}>
                            <b>Not Set</b>
                          </div>
                        )}
                      </th>
                      <th style={{ border: "1.5px solid #000000" }}>
                        {stud.PDF_DownloadLink !== "Not Set" && (
                          <a href={stud.PDF_DownloadLink} target="_blank">
                            View PDF
                          </a>
                        )}
                        {stud.PDF_DownloadLink === "Not Set" && (
                          <div style={{ color: "red" }}>
                            <b>Not Set</b>
                          </div>
                        )}
                      </th>
                    </tr>
                  );
                })}
            </Table>
          )}
          <br />
        </h5>
      </div>
    </>
  );
};

export default FacDetails;
