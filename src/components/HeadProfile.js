import React from "react";
import headContext from "../context/Heads/headContext";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./HeadProfile.css";

const HeadProfile = (props) => {
  const headDetails = useContext(headContext);

  const Navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const handleMouseEnter = () => {
    setHovered(true);
    setOpacity(0.7);
  };
  const handleMouseLeave = () => {
    setHovered(false);
    setOpacity(1);
  };

  const [departments, setDepartments] = useState([]);
  const [editable, setEditable] = useState(false);
  const host = "http://localhost:5000";

  async function fetchDept() {
    const response = await fetch(`${host}/departments`, {
      method: "GET",
    });
    const json = await response.json();
    json.sort((a, b) => a.department.localeCompare(b.department));
    const departmentNames = json.map((department) => department.department);
    setDepartments(departmentNames);
    console.log(departmentNames);
  }

  const getEditableStatus = async () => {
    // event.preventDefault();
    try {
      const response = await fetch(`${host}/api/headauth/editable`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"), // Add the auth-token header
        },
      });
      const json = await response.json();
      if (json.success) {
        setEditable(true);
        console.log(json);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    headDetails.getHeadDetails();
    getEditableStatus();
    fetchDept();
  }, []);

  const handleClick = (department) => {
    localStorage.setItem("hdep", department);
  };

  const DepartmentDropdown = ({ department, index }) => (
    <div className="dropdown">
      <button
        className="btn btn-primary dropdown-toggle"
        type="button"
        id={`dropdownMenuButton-${department}`}
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {department}
      </button>
      <ul
        className="dropdown-menu"
        aria-labelledby={`dropdownMenuButton-${department}`}
      >
        <li>
          <Link
            className="dropdown-item"
            to={{ pathname: `/fac`, state: { department: department } }}
            onClick={() => handleClick(department)}
          >
            Faculties
          </Link>
        </li>
        <li>
          <Link
            className="dropdown-item"
            to={{ pathname: `/stud`, state: { department: department } }}
            onClick={() => handleClick(department)}
          >
            Students
          </Link>
        </li>
      </ul>
    </div>
  );

  const DepartmentList = ({ departments }) => (
    <div className="row">
      <div className="col">
        {departments
          .slice(0, Math.ceil(departments.length / 2))
          .map((dept, index) => (
            <div key={dept} className="mb-3">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <DepartmentDropdown department={dept} index={index} />
                </li>
              </ul>
            </div>
          ))}
      </div>
      <div className="col">
        {departments
          .slice(Math.ceil(departments.length / 2))
          .map((dept, index) => (
            <div key={dept} className="mb-3">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <DepartmentDropdown department={dept} index={index} />
                </li>
              </ul>
            </div>
          ))}
      </div>
    </div>
  );

  const [newBranchName, setNewBranchName] = useState({
    department: "",
  });

  const handleNewBranchChange = (e) => {
    e.preventDefault();
    setNewBranchName({ ...newBranchName, [e.target.name]: e.target.value });
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${host}/api/depauth/createDepartment`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department: newBranchName.department,
        }),
      });
      const json = await response.json();
      console.log(json);
      if (json.success === true) {
        props.showAlert("Branch added successfully", "success");
        fetchDept();
      } else {
        props.showAlert("Some error occurred", "danger");
        fetchDept();
      }
    } catch (error) {
      console.log(error);
      props.showAlert("Some error occurred", "danger");
    }
  };

  const handleToggleEditAccess = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${host}/api/headauth/changeEditAccess`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      console.log(json);
      // Handle the response as per your requirements
      if (json.success) {
        setEditable(json.editAccess);
      }
    } catch (error) {
      console.log(error);
      // Handle the error as per your requirements
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="text-center font-weight-bold mb-4">Head Profile Page</h1>
        <div className="d-flex justify-content-center align-items-center my-3">
          <div className="position-relative">
            <img
              className="rounded-circle"
              style={{
                width: "200px",
                height: "200px",
                opacity: opacity,
                cursor: "pointer",
              }}
              src={"https://www.iitp.ac.in/placement/images/iitp2.png"}
              alt=""
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              title="Change Profile Image"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            {hovered && (
              <i
                className="fas fa-edit position-absolute top-50 start-50 translate-middle"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                title="Change Profile Image"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            )}
          </div>
        </div>

        <div className="card mb-2 mx-2 my-2">
          <h2 className="mx-2 d-flex justify-content-center mb-1">
            IITP PhD Portal Head
          </h2>
          <div
            className="form-check form-switch"
            style={{ textAlign: "center" }}
          >
            <label className="form-check-label" htmlFor="editAccessSwitch">
              {editable ? "Edit Access Granted" : "Give Edit Access"}
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              id="editAccessSwitch"
              checked={editable}
              onChange={handleToggleEditAccess}
              style={{ marginLeft: "48%" }}
            />
          </div>
          <div
            className="d-flex justify-content-center align-items-center mx-auto"
            style={{ textAlign: "center", justifyContent: "center" }}
          >
            <div
              className="p-1 bd-highlight mx-auto"
              style={{ textAlign: "center", justifyContent: "center" }}
            >
              <div
                className="row mx-auto"
                style={{ textAlign: "center", justifyContent: "center" }}
              >
                <div
                  className="col-6 mx-auto"
                  style={{ textAlign: "center", justifyContent: "center" }}
                >
                  <div
                    className="p-1 bd-highlight justify-content-around"
                    style={{ textAlign: "center", justifyContent: "center" }}
                  >
                    <div className="row mx-auto">
                      <div className="col-6">
                        <DepartmentList departments={departments} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="small-btn"
            data-bs-toggle="modal"
            data-bs-target="#addbranch"
          >
            Create New Branch
          </button>
        </div>
      </div>
      <div
        className="modal fade"
        id="addbranch"
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
                Add a New Branch
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
                    Branch Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="department"
                    name="department"
                    onChange={handleNewBranchChange}
                    minLength={3}
                  />
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
              <button
                type="button"
                onClick={handleAddBranch}
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#addbranch"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeadProfile;
