import HeadContext from "./headContext";
import { useState, useEffect } from "react";

const HeadState = (props) => {
  const host = "http://localhost:5000";
  const state = useState({
    full_name: localStorage.getItem("full_name"),
    web_mail: localStorage.getItem("web_mail"),
    password: localStorage.getItem("password"),
  });
  const [adminDetails, setAdminDetails] = useState({});
  const [state2, setState2] = useState(state);
  const update = (full_name, web_mail, password) => {
    setState2({
      full_name: full_name,
      web_mail: web_mail,
      password: password,
    });
  };

  const updateAdmin = (adminDet) => {
    setAdminDetails(adminDet);
  };

  const getHeadDetails = async () => {
    try {
      const response = await fetch(`${host}/api/headauth/gethead`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      console.log(json);
      update(json?.full_name, json?.web_mail, json?.password);
      localStorage.setItem("userid", json?._id);
    } catch (error) {
      console.error(error);
    }
  };

  const removeAdmin = async (id) => {
    try {
      const response = await fetch(`${host}/api/headauth/removeadmin/${id}`, {
        method: "DELETE",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const createAdmin = async (full_name, dept, web_mail, pass) => {
    console.log(1, full_name, dept, web_mail, pass);
    try {
      const response = await fetch(`${host}/api/headauth/createAdmin`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: full_name,
          department: dept,
          web_mail: web_mail,
          password: pass,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAdmindetails = async (id) => {
    try {
      const response = await fetch(
        `${host}/api/headauth/getAdmindetails/${id}`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const json = await response.json();
      updateAdmin(json ? json : {});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHeadDetails();
  }, []);

  return (
    <HeadContext.Provider
      value={{
        state2,
        update,
        getHeadDetails,
        removeAdmin,
        createAdmin,
        getAdmindetails,
        adminDetails,
        updateAdmin,
      }}
    >
      {props.children}
    </HeadContext.Provider>
  );
};

export default HeadState;
