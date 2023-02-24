import React, { useContext, useEffect } from "react";
import { useState } from "react";
import OTPInput, { ResendOTP } from "otp-input-react";
import userContext from "../context/Users/userContext";
import { useNavigate } from "react-router-dom";
import { type } from "os";

const Email_verification = (props) => {
  const [OTP, setOTP] = useState(0);
  const signupContext = useContext(userContext);
  // console.log(signupContext);
  const Navigate = useNavigate();
  const [otp, setOtp] = useState(Math.floor(Math.random() * 9000 + 1000));
  const [otpSent, setOtpSent] = useState("false");

  const handleChange = (otp1) => {
    // event.preventDefault();
    setOTP(otp1);
    // console.log(typeof(otp));
    // setEmail(signupContext.alt_mail);
  };
  useEffect(() => {
    if (!localStorage.getItem("emailv")) {
      Navigate("/");
      props.showAlert("Some Error Occured", "danger");
    }
  });

  const [email, setEmail] = useState(`${signupContext.state2.alt_mail}`);
  const changeOtpSent = () => {
    // event.preventDefault();
    setOtpSent(otpSent === "true" ? "false" : "true");
    // sendOTP(event);
  };
  const sendOTP = async () => {
    // const random = (Math.floor(Math.random() * 9000 + 1000));
    // setOTPGenerated(random);
    // event.preventDefault();
    changeOtpSent();
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
    // console.log(otp);

    const data = await res.json();
    console.log(data);

    if (data.status === 401 || !data) {
      console.log("error");
      props.showAlert("Some error occured", "danger");
    } else {
      // setShow(true);
      setEmail("");
      console.log("Email sent");
      props.showAlert("OTP has been sent", "success");
    }
  };

  const checkOTP = async () => {
    // console.log(OTP, typeof(OTP));
    // console.log(otp.toString(), typeof(otp.toString()));
    if (OTP === otp.toString()) {
      console.log("Success");

      // Create User
      const response = await fetch(
        "http://localhost:5000/api/auth/createUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: localStorage.getItem("full_name"),
            department: localStorage.getItem("department"),
            web_mail: localStorage.getItem("web_mail"),
            rollno: localStorage.getItem("rollno"),
            password: localStorage.getItem("password"),
            alt_mail: localStorage.getItem("alt_mail"),
          }),
        }
      );
      const json = await response.json();
      // console.log(json);
      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        // context.getUserDetails();
        Navigate("/profile");
        props.showAlert("Account Successfully Created", "success");
      } else {
        props.showAlert("User with same Roll No. already exists", "danger");
        Navigate("/");
      }
    } else {
      console.log("error");
      props.showAlert("Incorrect OTP", "danger");
    }
  };

  if (otpSent === "true") {
    return (
      <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Confirm Email Address</h3>
            <p style={{ textAlign: "center" }}>
              An email with OTP has been sent to your alternate mail address:{" "}
              <b>{signupContext.state2.alt_mail}</b>
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
              <ResendOTP onResendClick={() => sendOTP()} />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(OTP);
                  console.log(otp);
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
  } else {
    return (
      <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Confirm Email Address</h3>
            <p style={{ textAlign: "center" }}>
              An email will be sent to your alternate mail address{" "}
              <b>{signupContext.state2.alt_mail}</b> with OTP.
            </p>
            <div className="d-grid gap-2 mt-3">
              <span
                className="link-primary change2pointer"
                onClick={() => {
                  Navigate("/");
                }}
              >
                Change Email address
              </span>
            </div>
            <div className="d-grid gap-2 mt-3">
              <button
                className="btn btn-primary"
                onClick={() => {
                  changeOtpSent();
                  sendOTP();
                }}
              >
                Send OTP
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default Email_verification;
