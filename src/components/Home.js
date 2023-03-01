import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userContext from "../context/Users/userContext";
import { Link } from "react-router-dom";
const Home = (props) => {
  let [authMode, setAuthMode] = useState("signin");

  let signUpcontext = useContext(userContext);
  let Navigate = useNavigate();
  const [signUpcredentials, setSignUpCredentials] = useState({
    full_name: "",
    rollno: "",
    web_mail: "",
    department: "",
    password: "",
    confirmpassword: "",
    alt_mail: "",
  });

  const onChangeSignup = (event) => {
    setSignUpCredentials({
      ...signUpcredentials,
      [event.target.name]: event.target.value,
    });
  };

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
    const response = await fetch("http://localhost:5000/api/auth/login", {
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
      signUpcontext.getUserDetails();
      Navigate("/profile");
      // console.log(context.email);
      props.showAlert("Logged In Successfully", "success");
    } else {
      props.showAlert("Invalid Credentials", "danger");
    }
  };

  const handleSignUpSubmit = (event) => {
    event.preventDefault();
    console.log(signUpcredentials);
    localStorage.setItem("emailv", 1);
    signUpcontext.update(
      signUpcredentials.full_name,
      signUpcredentials.rollno,
      signUpcredentials.web_mail,
      signUpcredentials.department,
      signUpcredentials.alt_mail,
      signUpcredentials.password
    );
    localStorage.setItem("full_name", signUpcredentials.full_name);
    localStorage.setItem("rollno", signUpcredentials.rollno);
    localStorage.setItem("web_mail", signUpcredentials.web_mail);
    localStorage.setItem("department", signUpcredentials.department);
    localStorage.setItem("alt_mail", signUpcredentials.alt_mail);
    localStorage.setItem("password", signUpcredentials.password);
    Navigate("/verifyemail");
  };

  const [isValid, setIsValid] = useState(true);

  const [isStrongPass, setIsStrongPass] = useState(true);

  function checkValidWebMail(e) {
    const { value } = e.target;
    // setEmail(value);
    setIsValid(value.endsWith("@iitp.ac.in"));
  }

  function isPasswordStrong(password) {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return passwordRegex.test(password);
  }

  function checkStrongPass(e) {
    const { value } = e.target;
    // setPassword(value);
    setIsStrongPass(isPasswordStrong(value));
  }

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  if (authMode === "signin") {
    return (
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSigninSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="text-center">
              Not registered yet?{" "}
              <span
                className="link-primary change2pointer"
                onClick={changeAuthMode}
              >
                <u>Sign Up</u>
              </span>
              <p className="text-center mt-2">
                <Link to="/admin">Admin!</Link>
              </p>
            </div>
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
            <p className="text-center mt-2">
              <Link to="/">Forgot password?</Link>
            </p>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSignUpSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
          <div className="text-center">
            Already registered?{" "}
            <span
              className="link-primary change2pointer"
              onClick={changeAuthMode}
            >
              Sign In
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="e.g Jane Doe"
              name="full_name"
              onChange={onChangeSignup}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label>Roll No</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="e.g 2001EE83"
              name="rollno"
              onChange={onChangeSignup}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label>Institute Webmail</label>
            <input
              type="email"
              className={`form-control mt-1 ${isValid ? "" : "is-invalid"}`}
              placeholder="e.g yash_2001ee83@iitp.ac.in"
              name="web_mail"
              onChange={(e) => {
                checkValidWebMail(e);
                onChangeSignup(e);
              }}
              required
            />
            {!isValid && (
              <div className="invalid-feedback">
                Please enter a valid institute web mail.
              </div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Department
            </label>
            <select
              id="department"
              name="department"
              className="form-select"
              onChange={onChangeSignup}
              required
            >
              <option
                selected
                disabled
                placeholder="Department"
                style={{ color: "#697078" }}
                value=""
              >
                Department
              </option>
              <option value="Computer Sciecnce and Engineering">
                Computer Sciecnce and Engineering
              </option>
              <option value="Electrical and Electronics Engineering">
                Electrical and Electronics Engineering
              </option>
              <option value="Mechanical Engineering">
                Mechanical Engineering
              </option>
              <option value="Chemical Engineering">Chemical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
            </select>
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className={`form-control mt-1 ${
                isStrongPass ? "" : "is-invalid"
              }`}
              onChange={(e) => {
                checkStrongPass(e);
                onChangeSignup(e);
              }}
              placeholder="Password"
              name="password"
              // minLength={8}
              required
            />
            {!isStrongPass && (
              <div className="invalid-feedback">
                Please enter a strong password.
                <br />A strong password must contain at least one digit, one
                uppercase letter, one lowercase letter, one symbol and at least
                8 characters long.
              </div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="confirmpassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control mt-1"
              id="confirmpassword"
              name="confirmpassword"
              placeholder="Confirm Password"
              onChange={onChangeSignup}
              required
            />
            <div id="emailHelp" className="form-text">
              {signUpcredentials.password === signUpcredentials.confirmpassword
                ? ""
                : "Passwords don't match"}
            </div>
          </div>
          <div className="form-group mt-3">
            <label>Alt. Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Email Address"
              name="alt_mail"
              onChange={onChangeSignup}
              required
            />
          </div>
          <div className="form-check mt-1">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDefault"
              required
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              I confirm all details are correct
            </label>
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Home;
