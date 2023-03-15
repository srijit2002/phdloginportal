import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";

const Faculties = () => {
  const department = localStorage.getItem("hdep");
  const Navigate = useNavigate();
  const handleBack = () => {
    localStorage.removeItem("hdep");
    Navigate("/head_profile");
  };
  const host = "http://localhost:5000";
  const [faculties, setFaculties] = useState([]);
  useEffect(() => {
    async function fetchFac() {
      const response = await fetch(`${host}/getFac/${department}`, {
        method: "GET",
      });
      const json = await response.json();
      json.sort((a, b) => a.full_name.localeCompare(b.full_name));
      setFaculties(json);
    }
    fetchFac();
  }, []);

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
    const count = Math.floor(seconds / interval.seconds);
    return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
  }
  // for showing time registered

  const timeDiff = (text) => {
    // const d1 = Date.now;
    const d2 = new Date(text);
    return timeSince(d2);
  };
  // getting time difference

  const handleAddFaculty = (event) => {
    event.preventDefault();
    // console.log("Add");
  };

  return (
    <>
      <button className="btn btn-primary mx-3" onClick={handleBack}>
        Back
      </button>
      <div className="container" style={{ textAlign: "center" }}>
        <h1>
          <u>{department} Faculties</u>
        </h1>
        {faculties.length > 0 && (
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
                <th>Name</th>
                {/* <th>Department</th> */}
                <th>Web Mail</th>
                <th>Registered</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty) => (
                <tr key={faculty.id}>
                  <td>{faculty.full_name}</td>
                  {/* <td>{faculty.department}</td> */}
                  <td>{faculty.web_mail}</td>
                  <td>{timeDiff(faculty.date)}</td>
                  <td>
                    <button className="btn btn-primary">View Details</button>
                  </td>
                  <td>
                    <button className="btn btn-danger">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {faculties.length === 0 && (
          <div>
            <h3 style={{ color: "white", border: "0.5px" }}>
              No Faculties added for {department}.
            </h3>
          </div>
        )}

        <button
          data-bs-toggle="modal"
          data-bs-target="#addmodal"
          className="btn btn-primary"
          onClick={handleAddFaculty}
        >
          Add Faculty
        </button>
      </div>
      <div
        className="modal fade"
        id="addmodal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Add Faculty
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="full_name"
                    minLength={3}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Web Mail
                  </label>
                  <input type="email" className="form-control" id="web_mail" />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="cpassword"
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    Check me out
                  </label>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Faculties;
