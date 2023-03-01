import AdminContext from "./adminContext";
import { useState } from "react";
import React from "react";

const AdminState = (props) => {
  const host = "http://localhost:5000";
  const state = {
    full_name: localStorage.getItem("full_name"),
    web_mail: localStorage.getItem("web_mail"),
    department: localStorage.getItem("department"),
    password: localStorage.getItem("password"),
  };
  const [state2, setState2] = useState(state);

  const update = (full_name, web_mail, department, password) => {
    setState2({
      full_name: full_name,
      web_mail: web_mail,
      department: department,
      password: password,
    });
  };

  const getAdminDetails = async () => {
    // console.log("Adding a new note");
    const response = await fetch(`${host}/api/adminauth/getadmin`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json);
    update(json.full_name, json.web_mail, json.department, json.password);
    localStorage.setItem("userid", json._id);
  };

  const getRecord = async (department) => {
    const response = await fetch(`${host}/api/adminauth/fetchallstuds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ department }),
    });
    const json = await response.json();
    console.log(json);
    console.log("got res");
    setRecord(json);
  };

  const recordInitial = [];

  const [record, setRecord] = useState(recordInitial);

  return (
    <AdminContext.Provider value={{ state2, update, getAdminDetails, record, getRecord }}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminState;
