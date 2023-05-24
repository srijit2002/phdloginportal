import React, { useState } from "react";
import "./SetNewPass.css";
import { useNavigate } from "react-router-dom";
const bcrypt = require("bcryptjs");

const SetNewPass = (props) => {
  let Navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
    setPasswordMatch(event.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordMatch(event.target.value === newPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword === confirmPassword) {
      // Perform password update logic here
      try {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(newPassword, salt);
        const res = await fetch("http://localhost:5000/api/auth/resetPass", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("PassRecovID"),
            passHash: secPass,
          }),
        });
        const data = await res.json();
        if (data.success) {
          props.showAlert("Password changed successfully", "success");
          Navigate("/");
          localStorage.clear();
          console.log("Password updated successfully");
          // Reset form fields
          setNewPassword("");
          setConfirmPassword("");
        } else {
          console.log(data);
          props.showAlert("Some Error occurred", "danger");
        }
      } catch (error) {
        console.error(error);
        props.showAlert("Some error occurred", "danger");
      }
    } else {
      console.log("Passwords do not match");
      // Handle password mismatch error
    }
  };

  return (
    <div className="set-new-password-container">
      <h2>Set New Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="form-input"
          />
        </div>
        {!passwordMatch && (
          <div className="error-message">Passwords do not match</div>
        )}
        <button type="submit" disabled={!passwordMatch} className="form-button">
          Set Password
        </button>
      </form>
    </div>
  );
};

export default SetNewPass;
