import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import "./ForgotPassHome.css";
const ForgotPassHome = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement your forgot password logic here
  };

  return (
    <>
      <div className="forgot-password-form">
        <div className="form-container">
          <FontAwesomeIcon icon={faKey} size="5x" />
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassHome;
