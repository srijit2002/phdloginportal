import React, { useState, useContext, useEffect } from "react";
import userContext from "../context/Users/userContext";
import Form from "react-bootstrap/Form";

const Profile = (props) => {
  const userDetails = useContext(userContext);

  const [hovered, setHovered] = useState(false);
  const [opacity, setOpacity] = useState(1);
  // const [profilepicUrl, setProfilepicUrl] = useState({ testImage: "" });

  const [editDetails, setEditDetails] = useState({
    Guide: userDetails.state2.Guide,
    Co_Guide: userDetails.state2.Co_Guide,
    Commencement_Date: userDetails.state2.Commencement_Date,
  });

  const handleEDetailschange = (event) => {
    setEditDetails({ ...editDetails, [event.target.name]: event.target.value });
    console.log(editDetails);
  };

  const handlePDFChange = () => {};

  const submitEditDetails = async (event) => {
    event.preventDefault();
    userDetails.editUserDetails(
      localStorage.getItem("userid"),
      editDetails.Guide,
      editDetails.Co_Guide,
      editDetails.Commencement_Date
    );
    props.showAlert("Details Updated Successfully", "success");
  };

  function formatDate(date) {
    const xyz = date.toString();
    return xyz.slice(0, 10);
  }

  const handleMouseEnter = () => {
    setHovered(true);
    setOpacity(0.7);
  };
  useEffect(() => {
    userDetails.getUserDetails();
  }, []);

  const handleMouseLeave = () => {
    setHovered(false);
    setOpacity(1);
  };

  return (
    <>
      <div className="container">
        <h1 className="text-center font-weight-bold mb-4">Profile Page</h1>
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
              src={
                "https://t4.ftcdn.net/jpg/03/31/69/91/360_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"
              }
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
            {userDetails.state2.full_name}
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
                  <b>Roll No:</b> {userDetails.state2.rollno}
                </li>
                <li className="list-group-item mb-2">
                  <b>Web Mail:</b> {userDetails.state2.web_mail}
                </li>
                <li
                  className="list-group-item mb-2"
                  style={{
                    color:
                      userDetails.state2.Guide === "Not Set" ? "red" : "black",
                  }}
                >
                  {" "}
                  <b>Guide:</b> {userDetails.state2.Guide}
                </li>
                <li
                  className="list-group-item mb-2"
                  style={{
                    color:
                      Date.parse(userDetails.state2.Commencement_Date) <=
                      Date.parse("2008-08-08")
                        ? "red"
                        : "black",
                  }}
                >
                  {" "}
                  <b>Commencement Date:</b>{" "}
                  {Date.parse(userDetails.state2.Commencement_Date) <=
                  Date.parse("2010-08-08")
                    ? "Not Set"
                    : formatDate(
                        userDetails.state2.Commencement_Date || "2010-08-08"
                      )}
                </li>
              </ul>
            </div>
            <div className="p-1 bd-highlight">
              <ul className="list-group list-group-flush">
                <li className="list-group-item mb-2">
                  <b>Departmaent:</b> {userDetails.state2.department}
                </li>
                <li className="list-group-item mb-2">
                  <b>Alternate Mail:</b> {userDetails.state2.alt_mail}
                </li>
                <li
                  className="list-group-item mb-2"
                  style={{
                    color:
                      userDetails.state2.Co_Guide === "Not Set"
                        ? "red"
                        : "black",
                  }}
                >
                  {" "}
                  <b>Co-Guide:</b> {userDetails.state2.Co_Guide || "Not Set"}
                </li>
                <li className="input-group mb-3">
                  <b className="mx-2">PDF file:</b>
                  <input
                    type="file"
                    className="form-control"
                    id="inputGroupFile02"
                    onChange={handlePDFChange}
                  />
                </li>
              </ul>
            </div>
          </div>
          <button
            data-bs-toggle="modal"
            data-bs-target="#EditDetails"
            className="btn btn-primary mx-2 mb-2"
          >
            Edit Details
          </button>
        </div>
      </div>
      <div
        className="modal fade"
        id="EditDetails"
        tabIndex="-1"
        aria-labelledby="EditName2Label"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form
              className="mx-1"
              onSubmit={submitEditDetails}
              encType="multipart/form-data"
            >
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="mb-3">
                <div className="mb-3">
                  <label htmlFor="editfname" className="form-label">
                    Guide
                  </label>
                  <select
                    id="Guide"
                    name="Guide"
                    onChange={handleEDetailschange}
                    className="form-select"
                    value={editDetails.Guide}
                  >
                    <option selected disabled value="Not Selected">
                      Not Selected
                    </option>
                    <option value="Prof1">Prof1</option>
                    <option value="Prof2">Prof2</option>
                    <option value="Prof3">Prof3</option>
                    <option value="Prof4">Prof4</option>
                    <option value="Prof5">Prof5</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="editlname" className="form-label">
                    Co_Guide
                  </label>
                  <select
                    id="Co_Guide"
                    name="Co_Guide"
                    onChange={handleEDetailschange}
                    className="form-select"
                    value={editDetails.Co_Guide}
                  >
                    <option selected disabled value="Not Selected">
                      Not Selected
                    </option>
                    <option value="Prof1">Prof1</option>
                    <option value="Prof2">Prof2</option>
                    <option value="Prof3">Prof3</option>
                    <option value="Prof4">Prof4</option>
                    <option value="Prof5">Prof5</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="editcdate" className="form-label">
                    Commencement_Date
                  </label>
                  <Form.Control
                    type="date"
                    name="Commencement_Date"
                    onChange={handleEDetailschange}
                  />
                </div>
              </div>
              <div className="modal-footer mx-1">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#EditDetails"
                  type="submit"
                  className="btn btn-primary"
                >
                  Update Details
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
