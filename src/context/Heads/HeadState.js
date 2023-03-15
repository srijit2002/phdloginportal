import HeadContext from "./headContext";
import { useState } from "react";
import React from "react";

const HeadState = (props) => {
  const host = "http://localhost:5000";
  const state = {
    full_name: localStorage.getItem("full_name"),
    web_mail: localStorage.getItem("web_mail"),
    password: localStorage.getItem("password"),
  };
  const [state2, setState2] = useState(state);

  const update = (full_name, web_mail, password) => {
    setState2({
      full_name: full_name,
      web_mail: web_mail,
      password: password,
    });
  };

  const getHeadDetails = async () => {
    // console.log("Adding a new note");
    const response = await fetch(`${host}/api/headauth/gethead`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json);
    update(json.full_name, json.web_mail, json.password);
    localStorage.setItem("userid", json._id);
  };

  return (
    <HeadContext.Provider value={{ state2, update, getHeadDetails }}>
      {props.children}
    </HeadContext.Provider>
  );
};

export default HeadState;
