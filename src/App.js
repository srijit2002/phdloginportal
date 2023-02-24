import "./App.css";
import Navbar from "./components/Navbar";
import Alert from "./components/Alert";
import { useState } from "react";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Email_verification from "./components/Email_verification";
import React from "react";
import UserState from "./context/Users/UserState";
import Profile from "./components/Profile";
// require("dotenv").config();

const myStyle = {
  backgroundImage:
    "url(https://w0.peakpx.com/wallpaper/146/911/HD-wallpaper-blue-abstract-waves-creative-blue-wavy-background-blue-backgrounds-abstract-waves-waves-textures.jpg)",
  height: "100%",
  // margin: "0",
  paddingBottom: "500px",
  backgroundAttachment: "fixed",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  // fontFamily: "Cantata One",
};

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  return (
    <>
      <div style={myStyle}>
        <UserState>
          <BrowserRouter>
            <Navbar />
            <Alert alert={alert} />
            <Routes>
              <Route path="/" element={<Home showAlert={showAlert} />}></Route>
              <Route
                path="/verifyemail"
                element={<Email_verification showAlert={showAlert} />}
              ></Route>
              <Route
                path="/profile"
                element={<Profile showAlert={showAlert} />}
              ></Route>
            </Routes>
          </BrowserRouter>
        </UserState>
      </div>
    </>
  );
}

export default App;
