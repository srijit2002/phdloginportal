import React from "react";
import adminContext from "../context/Admins/adminContext";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminProfile = (props) => {
  const adminDetails = useContext(adminContext);

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

  const handleRecordShow = () => {
    Navigate("/admin/record");
  };

  useEffect(() => {
    adminDetails.getAdminDetails();
  }, []);

  return (
    <>
      <div className="container">
        <h1 className="text-center font-weight-bold mb-4">
          Admin Profile Page
        </h1>
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
            {adminDetails.state2.full_name}
            {/* <i
            className="fas fa-edit ms-2 text-muted"
            data-bs-toggle="modal"
            data-bs-target="#EditName"
            title="Edit Name"
          /> */}
          </h2>
          <div className="d-flex justify-content-around">
            <div className="p-1 bd-highlight">
              <ul className="list-group list-group-flush">
                <li className="list-group-item mb-2">
                  <b>Web Mail:</b> {adminDetails.state2.web_mail}
                </li>
              </ul>
            </div>
            <div className="p-1 bd-highlight">
              <ul className="list-group list-group-flush">
                <li className="list-group-item mb-2">
                  <b>Departmaent:</b> {adminDetails.state2.department}
                </li>
              </ul>
            </div>
          </div>
          <button
            onClick={handleRecordShow}
            className="btn btn-primary mx-2 mb-2"
          >
            Show Student Record
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
