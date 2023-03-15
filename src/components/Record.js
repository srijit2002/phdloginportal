import React from "react";
import adminContext from "../context/Admins/adminContext";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import * as XLSX from "xlsx";

const Record = (props) => {
  const adminDetails = useContext(adminContext);
  const { record, getRecord } = adminDetails;
  useEffect(() => {
    adminDetails.getAdminDetails();
    console.log(adminDetails.state2.department);
    getRecord(adminDetails.state2.department);
  }, []);
  function formatDate(date) {
    const temp = new Date(date);
    const xyz = temp.toISOString();
    return xyz.slice(0, 10);
  }

  const exportTable = () => {
    /* convert table to worksheet */
    const ws = XLSX.utils.table_to_sheet(document.getElementById("my-table"));

    /* make first row bold */
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cell = XLSX.utils.encode_cell({ r: 0, c: col });
      if (ws[cell]) {
        ws[cell].style = { font: { bold: true } };
      }
    }

    /* create workbook and add worksheet */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* generate XLSX file and download */
    XLSX.writeFile(wb, "my-table.xlsx");
  };
  useEffect(() => {
    const searchInput = document.getElementById("search-input");
    const table = document.getElementById("my-table");
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
      <div className="container" style={{ textAlign: "center" }}>
        <u>
          <h1>{adminDetails.state2.department} Student Record</h1>
        </u>
      </div>
      <div className="container" style={{ textAlign: "center" }}>
        <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
          Search by keyword
        </span>
      </div>
      <div className="container" style={{ textAlign: "center" }}>
        <input
          className="mb-3"
          type="text"
          id="search-input"
          placeholder="Search..."
        ></input>
      </div>
      <div className="container" style={{ textAlign: "center" }}>
        <Table
          id="my-table"
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
          {record &&
            record.map((stud, index) => {
              return (
                <tr>
                  <th style={{ border: "1.5px solid #000000" }}>{index + 1}</th>
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
      </div>
      {record.length > 0 && (
        <div className="container" style={{ textAlign: "center" }}>
          <button className="btn btn-primary" onClick={exportTable}>
            Download Record as PDF
          </button>
        </div>
      )}
    </>
  );
};

export default Record;
