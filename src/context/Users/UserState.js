import UserContext from "./userContext";
import { useState } from "react";
import React from "react";

const UserState = (props) => {
  const host = "http://localhost:5000";
  const state = {
    full_name: localStorage.getItem("full_name"),
    rollno: localStorage.getItem("rollno"),
    web_mail: localStorage.getItem("web_mail"),
    department: localStorage.getItem("department"),
    alt_mail: localStorage.getItem("alt_mail"),
    password: localStorage.getItem("password"),
    Guide: localStorage.getItem("Guide"),
    Co_Guide: localStorage.getItem("Co_Guide"),
    Commencement_Date: localStorage.getItem("Commencement_Date"),
    PDF_DownloadLink: localStorage.getItem("PDF_DownloadLink"),
  };
  const [state2, setState2] = useState(state);

  const update = (
    full_name,
    rollno,
    web_mail,
    department,
    alt_mail,
    password,
    Guide,
    Co_Guide,
    Commencement_Date,
    PDF_DownloadLink
  ) => {
    setState2({
      full_name: full_name,
      rollno: rollno,
      web_mail: web_mail,
      department: department,
      alt_mail: alt_mail,
      password: password,
      Guide: Guide,
      Co_Guide: Co_Guide,
      Commencement_Date: Commencement_Date,
      PDF_DownloadLink: PDF_DownloadLink,
    });
  };

  const getUserDetails = async () => {
    // console.log("Adding a new note");
    const response = await fetch(`${host}/api/auth/getuser`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json);
    update(
      json.full_name,
      json.rollno,
      json.web_mail,
      json.department,
      json.alt_mail,
      json.password,
      json.Guide,
      json.Co_Guide,
      json.Commencement_Date,
      json.PDF_DownloadLink
    );
    localStorage.setItem("userid", json._id);
  };

  const editUserDetails = async (
    id,
    Guide,
    Co_Guide,
    Commencement_Date,
    // PDF_DownloadLink
  ) => {
    const res = await fetch(`${host}/api/auth/editusername/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        Guide,
        Co_Guide,
        Commencement_Date,
        // PDF_DownloadLink,
      }),
    });
    console.log(res);
    getUserDetails();
  };

  const editPDFLink = async (id, PDF_DownloadLink) => {
    const res = await fetch(`${host}/api/auth/editPDFlink/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        PDF_DownloadLink,
      }),
    });
    console.log(res);
    getUserDetails();
  };

  // const postPDFfile = async (filedata) => {
  //   // console.log("Filedata",filedata);
  //   const formData = new FormData();
  //   formData.append("myFile", filedata);
  //   // for (const key of formData.keys()) {
  //   //   console.log(key, formData.get(key));
  //   // }
  //   const res = await fetch(`${host}/api/auth/uploadFile`, {
  //     method: "POST",
  //     body: formData,
  //   });
  //   if (res.status === 200) {
  //     const responseJson = await res.json();
  //     const downloadLink = responseJson.secure_url;
  //     update({ ...state2, PDF_DownloadLink: downloadLink });
  //   } else {
  //     console.log("File upload failed.");
  //   }
  // };

  return (
    <UserContext.Provider
      value={{ state2, update, getUserDetails, editUserDetails, editPDFLink }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
