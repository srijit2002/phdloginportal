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
import AdminHome from "./components/AdminHome";
import AdminProfile from "./components/AdminProfile";
import AdminState from "./context/Admins/AdminState";
import Record from "./components/Record";
import HeadHome from "./components/HeadHome";
import HeadProfile from "./components/HeadProfile";
import HeadState from "./context/Heads/HeadState";
import Faculties from "./components/Faculties";
// require("dotenv").config();

const myStyle = {
  background: "url(https://wallpapercave.com/wp/wp3323223.jpg)",
  height: "100vh",
  paddingBottom: "1000px",
  backgroundAttachment: "fixed",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  // color: "#fff",
  textShadow: "0 0 10px rgba(0,0,0,.5)"
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
  // window.addEventListener("beforeunload", function () {
  //   localStorage.clear();
  // });
  return (
    <>
      <div style={myStyle}>
        <HeadState>
          <AdminState>
            <UserState>
              <BrowserRouter>
                <Navbar />
                <Alert alert={alert} />
                <Routes>
                  <Route
                    path="/"
                    element={<Home showAlert={showAlert} />}
                  ></Route>
                  <Route
                    path="/admin"
                    element={<AdminHome showAlert={showAlert} />}
                  ></Route>
                  <Route
                    path="/admin/record"
                    element={<Record showAlert={showAlert} />}
                  ></Route>
                  <Route
                    path="/verifyemail"
                    element={<Email_verification showAlert={showAlert} />}
                  ></Route>
                  <Route
                    path="/profile"
                    element={<Profile showAlert={showAlert} />}
                  ></Route>
                  <Route
                    path="/admin_profile"
                    element={<AdminProfile showAlert={showAlert} />}
                  ></Route>
                  <Route
                    path="/head_profile"
                    element={<HeadProfile showAlert={showAlert} />}
                  ></Route>
                  <Route
                    path="/head"
                    element={<HeadHome showAlert={showAlert} />}
                  ></Route>
                  <Route
                    path="/fac"
                    element={<Faculties showAlert={showAlert} />}
                  ></Route>
                </Routes>
              </BrowserRouter>
            </UserState>
          </AdminState>
        </HeadState>
      </div>
    </>
  );
}

export default App;
