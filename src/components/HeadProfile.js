import React from "react";
import headContext from "../context/Heads/headContext";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const HeadProfile = () => {
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

  const host = "http://localhost:5000";

  useEffect(() => {
    headDetails.getHeadDetails();
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
    fetchDept();
  }, []);

  const handleClick = (department) => {
    localStorage.setItem("hdep", department);
  }

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
          <Link className="dropdown-item" to="/">
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
        </div>
      </div>
    </>
  );
};

export default HeadProfile;
