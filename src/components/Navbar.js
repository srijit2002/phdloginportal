import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminContext from "../context/Admins/adminContext";
import userContext from "../context/Users/userContext";

const Navbar = () => {
  let Navigate = useNavigate();

  const userDetails = useContext(userContext);
  const adminDetails = useContext(adminContext);
  const handleProfile = () => {};
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.clear();
    Navigate("/");
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            PhD Login Portal
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Link
                </a>
              </li>
            </ul>
            {!localStorage.getItem("token") ? (
              <form className="d-flex">
                <Link
                  className="btn btn-primary mx-1"
                  to="/login"
                  role="button"
                >
                  Login
                </Link>
                <Link
                  className="btn btn-primary mx-1"
                  to="/signup"
                  role="button"
                >
                  SignUp
                </Link>
              </form>
            ) : (
              <div>
                <i
                  className="fa-solid fa-user mx-2"
                  onClick={handleProfile}
                  style={{ color: "white" }}
                ></i>
                <b
                  className="mx-2"
                  style={{ color: "white", fontSize: "20px" }}
                >
                  Hello,{" "}
                  {userDetails.state2.full_name ||
                    adminDetails.state2.full_name}
                  !
                </b>
                <button className="btn btn-primary mx-2" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
