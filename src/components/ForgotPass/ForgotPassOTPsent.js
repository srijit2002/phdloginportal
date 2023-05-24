import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPInput, { ResendOTP } from "otp-input-react";
const bcrypt = require("bcryptjs");
const ForgotPassOTPsent = (props) => {
  const [OTP, setOTP] = useState(0);
  const Navigate = useNavigate();
  const [otp, setOtp] = useState(Math.floor(Math.random() * 9000 + 1000));
  const [email, setEmail] = useState(localStorage.getItem("PassRecovID"));
  const handleChange = (otp1) => {
    // event.preventDefault();
    setOTP(otp1);
    // console.log(typeof(otp));
    // setEmail(signupContext.alt_mail);
  };

  const checkOTP = async () => {
    // console.log(OTP, typeof(OTP));
    // console.log(otp.toString(), typeof(otp.toString()));
    console.log(OTP);
    const salt = localStorage.getItem("salt");
    const checkOTP = await bcrypt.hash(OTP.toString(), salt);
    console.log(checkOTP);
    if (checkOTP.toString() === localStorage.getItem("hashedOTP").toString()) {
      console.log("Success");

      Navigate("/setNewPassword");
    } else {
      console.log("error");
      props.showAlert("Incorrect OTP", "danger");
    }
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Confirm Email Address</h3>
          <p style={{ textAlign: "center" }}>
            An email with OTP has been sent to your alternate mail address:{" "}
            <b>{email}</b>
          </p>
          <span
            className="link-primary change2pointer"
            onClick={() => {
              Navigate("/");
            }}
          >
            Change Email address
          </span>
          <div className="form-group mt-3">
            <label>OTP</label>
            <OTPInput
              value={OTP}
              onChange={handleChange}
              autoFocus
              name="OTP"
              OTPLength={4}
              otpType="number"
            />
            <ResendOTP onResendClick={() => Navigate("/forgotpass")} />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                console.log(OTP);
                console.log(localStorage.getItem("hashedOTP"));
                checkOTP();
              }}
            >
              Submit
            </button>
          </div>
          <p className="text-center mt-2">
            <a href="/">Forgot password?</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassOTPsent;
