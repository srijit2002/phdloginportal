import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import "./ForgotPassHome.css";
import { useNavigate } from "react-router-dom";
const bcrypt = require("bcryptjs");

const ForgotPassHome = (props) => {
  const [email, setEmail] = useState("");
  let Navigate = useNavigate();
  const [otp, setOtp] = useState(Math.floor(Math.random() * 9000 + 1000));
  const sendOTP = async () => {
    console.log("sendOTP called");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      console.log(data);

      if (data.status === 401 || !data) {
        console.log("error");
        props.showAlert("Some error occurred", "danger");
      } else {
        const salt = await bcrypt.genSalt(10);
        const secOTP = await bcrypt.hash(otp.toString(), salt); // Wait for the hash to be generated
        localStorage.setItem("hashedOTP", secOTP);
        setEmail("");
        localStorage.setItem("salt", salt);
        console.log("Email sent");
        props.showAlert("OTP has been sent", "success");
      }
    } catch (error) {
      console.error(error);
      props.showAlert("Some error occurred", "danger");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/changePass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("PassRecovID", email);
      sendOTP();
      Navigate("/passRecovOTP");
    } else {
      props.showAlert(
        "No account registered with this Email address",
        "danger"
      );
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <div className="form-container">
          <FontAwesomeIcon
            icon={faEnvelope}
            size="5x"
            className="icon-envelope"
          />
          <h2 className="form-title">Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <label className="form-label">
              Institute web_mail:
              <div className="form-input-container">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="form-input"
                  style={{ width: "400px" }}
                />
              </div>
            </label>
            <button type="submit" className="form-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassHome;
