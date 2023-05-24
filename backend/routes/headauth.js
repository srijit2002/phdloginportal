const express = require("express");
const router = express.Router();
const Head = require("../models/Head");
const { body, validationResult } = require("express-validator");
var fetchhead = require("../middleware/fetchhead");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const JWT_SECRET = "Login Portal";

router.post(
  "/createHead",
  [
    body("full_name", "Enter a valid full name").isLength({ min: 3 }),
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
      let head = await Head.findOne({ web_mail: req.body.web_mail });
      if (head) {
        return res
          .status(400)
          .json({ success, error: "Head with this Web_mail already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      head = await Head.create({
        full_name: req.body.full_name,
        password: secPass,
        web_mail: req.body.web_mail,
      });

      const data = {
        head: {
          id: head.id,
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
      let head = await Head.findOne({ web_mail });
      if (!head) {
        return res.status(400).json({ success, error: "Invalid Credentials" });
      }

      const passwordComp = await bcrypt.compare(password, head.password);
      if (!passwordComp) {
        success = false;
        return res.status(400).json({ success, error: "Invalid Credentials" });
      }

      const data = {
        head: {
          id: head.id,
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

router.get("/gethead", fetchhead, async (req, res) => {
  try {
    const headId = req.head.id;
    const head = await Head.findById(headId).select("-password");
    if (!head) {
      return res.status(404).send("No head found");
    }
    res.send(head);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/removeadmin/:id", async (req, res) => {
  // let success = false;
  try {
    const adminid = req.params.id;
    const admintodel = await Admin.findById(adminid);
    if (!admintodel) {
      return res.status(400).send({ success: "Admin not found." });
    }
    await Admin.findByIdAndDelete(adminid);
    res.send({ success: "Admin removed successfully." });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post(
  "/createAdmin",
  [
    body("full_name", "Enter a valid full name").isLength({ min: 3 }),
    body("department", "Enter valid department name").isLength({ min: 3 }),
    body("web_mail", "Enter a valid institute webmail").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
  ],
  fetchhead,
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    // console.log(req.body);
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

router.get("/guideof/:id", fetchhead, async (req, res) => {
  try {
    const adminid = req.params.id;
    let success = false;
    const admin = await Admin.findById(adminid).select("-password");
    if (!admin) {
      return res.status(400).json({ success, error: "Admin not found" });
    }
    const studs = await User.find({
      Guide: admin.full_name,
      department: admin.department,
    }).select("-password");
    res.send(studs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Oops! Something went wrong. Please try again later.");
  }
});

router.get("/coguideof/:id", fetchhead, async (req, res) => {
  try {
    const adminid = req.params.id;
    let success = false;
    const admin = await Admin.findById(adminid).select("-password");
    if (!admin) {
      return res.status(400).json({ success, error: "Admin not found" });
    }
    const studs = await User.find({
      Co_Guide: admin.full_name,
      department: admin.department,
    }).select("-password");
    res.send(studs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Oops! Something went wrong. Please try again later.");
  }
});

router.get("/getAdmindetails/:id", fetchhead, async (req, res) => {
  try {
    const adminid = req.params.id;
    let success = false;
    const admin = await Admin.findById(adminid).select("-password");
    if (!admin) {
      return res.status(400).json({ success, error: "Admin not found" });
    }
    res.send(admin);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getStuds/:department", fetchhead, async (req, res) => {
  try {
    const dept = req.params.department;
    const studs = await User.find({ department: dept });
    res.send(studs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/changeEditAccess", fetchhead, async (req, res) => {
  try {
    const headId = req.head.id; // Get the logged-in head ID from the fetchhead middleware
    const tempHead = await Head.findById(headId); // Find the corresponding Head document by ID

    if (!tempHead) {
      return res.status(404).json({ error: "Head not found" });
    }

    tempHead.editAccess = !tempHead.editAccess; // Toggle the editAccess parameter
    await tempHead.save(); // Save the updated head object

    res.json({ success: true, editAccess: tempHead.editAccess });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/editable", fetchhead, async (req, res) => {
  try {
    const tempHead = await Head.findOne({ editAccess: true });

    let success = false;
    if (tempHead) {
      success = true;
    }

    res.json({ success: success });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
