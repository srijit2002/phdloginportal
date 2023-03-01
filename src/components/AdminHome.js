import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminHome = (props) => {
  let Navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    web_mail: "",
    password: "",
  });

  const onChangeSignin = (event) => {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value,
    });
  };
  const handleSigninSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/api/adminauth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        web_mail: credentials.web_mail,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      // console.log(credentials.email);
      //   signUpcontext.getUserDetails();
      Navigate("/admin_profile");
      // console.log(context.email);
      props.showAlert("Logged In Successfully", "success");
    } else {
      props.showAlert("Invalid Credentials", "danger");
    }
  };
  const [isValid, setIsValid] = useState(true);
  function checkValidWebMail(e) {
    const { value } = e.target;
    // setEmail(value);
    setIsValid(value.endsWith("@iitp.ac.in"));
  }

  return (
    <>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSigninSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Admin Sign In</h3>
            <div className="form-group mt-3">
              <label>Institute Web Mail</label>
              <input
                type="email"
                className={`form-control mt-1 ${isValid ? "" : "is-invalid"}`}
                placeholder="Enter email"
                name="web_mail"
                onChange={(e) => {
                  checkValidWebMail(e);
                  onChangeSignin(e);
                }}
              />
              {!isValid && (
                <div className="invalid-feedback">
                  Please enter a valid institute web mail.
                </div>
              )}
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                name="password"
                onChange={onChangeSignin}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminHome;
