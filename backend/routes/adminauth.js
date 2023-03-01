const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const { body, validationResult } = require("express-validator");
var fetchadmin = require("../middleware/fetchadmin");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");

const JWT_SECRET = "Login Portal";

router.post(
  "/createAdmin",
  [
    body("full_name", "Enter a valid full name").isLength({ min: 3 }),
    body("department", "Enter valid department name").isLength({ min: 3 }),
    body("web_mail", "Enter a valid institute webmail").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let admin = await Admin.findOne({ web_mail: req.body.web_mail });
      if (admin) {
        return res
          .status(400)
          .json({ success, error: "Admin with this Web_mail already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      admin = await Admin.create({
        full_name: req.body.full_name,
        department: req.body.department,
        password: secPass,
        web_mail: req.body.web_mail,
      });

      const data = {
        admin: {
          id: admin.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      // console.log(jwtData);
      success = true;
      // res.json(user);
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occured");
    }
    // res.send("hello");
  }
);

router.post(
  "/login",
  [
    body("web_mail", "Enter a valid web_mail").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let success = false;
    const { web_mail, password } = req.body;
    try {
      let admin = await Admin.findOne({ web_mail });
      if (!admin) {
        return res.status(400).json({ success, error: "Invalid Credentials" });
      }

      const passwordComp = await bcrypt.compare(password, admin.password);
      if (!passwordComp) {
        success = false;
        return res.status(400).json({ success, error: "Invalid Credentials" });
      }

      const data = {
        admin: {
          id: admin.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      // console.log(jwtData);

      // res.json(user);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post("/getadmin", fetchadmin, async (req, res) => {
  try {
    let adminId = req.admin.id;
    const admin = await Admin.findById(adminId).select("-password");
    res.send(admin);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetchallstuds", fetchadmin, async (req, res) => {
  try {
    const {department} = req.body;
    const studs = await User.find({ department: department });
    // res.json(studs);
    // const json = JSON.stringify(studs);
    studs.sort((a, b)=>a.rollno.localeCompare(b.rollno));
    res.json(studs);
    // console.log(req.admin);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
