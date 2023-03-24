import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";

const Students = () => {
  const Navigate = useNavigate();
  const department = localStorage.getItem("hdep");
  const [students, setStudents] = useState([]);

  const handleBack = () => {
    localStorage.removeItem("hdep");
    Navigate("/head_profile");
  };
  const host = "http://localhost:5000";

  async function fetchStuds() {
    const response = await fetch(
      `${host}/api/headauth/getStuds/${department}`,
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    json.sort((a, b) => a.full_name.localeCompare(b.full_name));
    setStudents(json);
  }

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];
  // for showing time registered

  function timeSince(date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const interval = intervals.find((i) => i.seconds < seconds);
    if (!interval) {
      return "just now";
    }
    const count = Math.floor(seconds / interval.seconds);
    return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
  }

  // for showing time registered

  function formatDate(date) {
    const temp = new Date(date);
    const xyz = temp.toISOString();
    return xyz.slice(0, 10);
  }

  const timeDiff = (text) => {
    // const d1 = Date.now;
    const d2 = new Date(text);
    return timeSince(d2);
  };

  useEffect(() => {
    fetchStuds();
  }, []);

  useEffect(() => {
    const searchInput = document.getElementById(
      `studsearch-input-${department}`
    );
    const table = document.getElementById(`stud-table-${department}`);
    const tableRows = table && table.getElementsByTagName("tr");

    searchInput.addEventListener("input", function () {
      const searchTerm = searchInput.value.toLowerCase();

      for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
        const rowData = row.textContent.toLowerCase();

        if (i === 0) {
          row.style.display = "";
        } else if (rowData.includes(searchTerm)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      }
    });
  }, []);

  return (
    <>
      <button className="btn btn-primary mx-3" onClick={handleBack}>
        Back
      </button>
      <div className="container" style={{ textAlign: "center" }}>
        <h1>
          <u>{department} Students</u>
        </h1>
        <div className="container" style={{ textAlign: "center" }}>
          <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
            Search by keyword
          </span>
        </div>
        <div className="container" style={{ textAlign: "center" }}>
          <input
            className="mb-3"
            type="text"
            id={`studsearch-input-${department}`}
            placeholder="Search..."
          ></input>
        </div>
        {students.length > 0 && (
          <Table
            id={`stud-table-${department}`}
            style={{
              backgroundColor: "#fff",
              border: "1.5px solid #000000",
              padding: "10px",
            }}
          >
            <thead>
              <tr>
                <th style={{ fontSize: "1em", fontWeight: "bold" }}>S. No.</th>
                <th style={{ fontSize: "1em", fontWeight: "bold" }}>Name</th>
                <th style={{ fontSize: "1em", fontWeight: "bold" }}>
                  Roll No.
                </th>
                <th style={{ fontSize: "1em", fontWeight: "bold" }}>
                  Web Mail
                </th>
                <th style={{ fontSize: "1em", fontWeight: "bold" }}>
                  Alt. Mail
                </th>
                <th style={{ fontSize: "1em", fontWeight: "bold" }}>Guide</th>
                <th style={{ fontSize: "1em", fontWeight: "bold" }}>
                  Co-Guide
                </th>
                <th style={{ fontSize: "1em", fontWeight: "bold" }}>
                  Commencement Date
                </th>
                <th style={{ fontSize: "1em", fontWeight: "bold" }}>
                  Registered
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((stud, index) => (
                <tr key={stud._id}>
                  <th>{index + 1}.</th>
                  <th style={{ fontSize: "1em" }}>{stud.full_name}</th>
                  <th style={{ fontSize: "1em" }}>{stud.rollno}</th>
                  <th style={{ fontSize: "1em" }}>{stud.web_mail}</th>
                  <th style={{ fontSize: "1em" }}>{stud.alt_mail}</th>
                  <th style={{ fontSize: "1em" }}>{stud.Guide}</th>
                  <th style={{ fontSize: "1em" }}>{stud.Co_Guide}</th>
                  <th style={{ fontSize: "1em" }}>
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
                  <th style={{ fontSize: "1em" }}>{timeDiff(stud.date)}</th>
                  <th>
                    <button
                      className="small-btn btn-primary"
                      style={{ fontSize: "1em" }}
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Edit Details
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {students.length === 0 && (
          <div>
            <h3 style={{ color: "white", border: "0.5px" }}>
              No Students added for {department}.
            </h3>
          </div>
        )}
      </div>
    </>
  );
};

export default Students;
