const express = require("express");
const router = express.Router();
const Head = require("../models/Head");
const { body, validationResult } = require("express-validator");
var fetchhead = require("../middleware/fetchhead");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

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

router.post("/gethead", fetchhead, async (req, res) => {
  try {
    let headId = req.head.id;
    const head = await Head.findById(headId).select("-password");
    res.send(head);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});



module.exports = router;
