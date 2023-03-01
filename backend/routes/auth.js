const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
var fetchuser = require("../middleware/fetchuser");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const multer = require("multer");

const cloudinary = require("cloudinary").v2;

// const sendEmail = require("../helpers/email");
// const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");

const JWT_SECRET = "Login Portal";

const storage = multer.diskStorage({});
let upload = multer({
  storage,
});

// Route 1: Create User
router.post(
  "/createUser",
  [
    body("full_name", "Enter a valid full name").isLength({ min: 3 }),
    body("department", "Enter valid department name").isLength({ min: 3 }),
    body("web_mail", "Enter a valid institute webmail").isEmail(),
    body("rollno", "Enter a valid roll no").isLength({ max: 8 }),
    body("password", "Enter a valid password").isLength({ min: 5 }),
    body("alt_mail", "Enter a valid alternate email").isEmail(),
    body("Guide").default(""),
    body("CoGuide").default(""),
    body("PDF_DownloadLink").default(""),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ rollno: req.body.rollno });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "User with this Roll No. already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        full_name: req.body.full_name,
        department: req.body.department,
        password: secPass,
        web_mail: req.body.web_mail,
        rollno: req.body.rollno,
        alt_mail: req.body.alt_mail,
      });

      const data = {
        user: {
          id: user.id,
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

// Route 2: Login User
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
      let user = await User.findOne({ web_mail });
      if (!user) {
        return res.status(400).json({ success, error: "Invalid Credentials" });
      }

      const passwordComp = await bcrypt.compare(password, user.password);
      if (!passwordComp) {
        success = false;
        return res.status(400).json({ success, error: "Invalid Credentials" });
      }

      const data = {
        user: {
          id: user.id,
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

// Route 3: Get user Details
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 4: Edit user details
router.put("/edituserName/:id", fetchuser, async (req, res) => {
  const { Guide, Co_Guide, Commencement_Date, PDFLink } = req.body;
  // const salt = await bcrypt.genSalt(10);
  // const secPass = await bcrypt.hash(password, salt);
  try {
    const newUser = {};
    if (Guide) {
      newUser.Guide = Guide;
    }
    if (Co_Guide) {
      newUser.Co_Guide = Co_Guide;
    }
    if (Commencement_Date) {
      newUser.Commencement_Date = Commencement_Date;
    }
    if (PDFLink) {
      newUser.PDF_DownloadLink = PDFLink;
    }
    // if (password) {
    //   newUser.password = secPass;
    // }
    let tempuser = await User.findById(req.params.id);
    if (!tempuser) {
      res.status(404).send("Not Found");
    }

    tempuser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: newUser },
      { new: true }
    );

    res.json({ tempuser });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/editPDFlink/:id", fetchuser, async (req, res) => {
  const { PDF_DownloadLink } = req.body;
  // const salt = await bcrypt.genSalt(10);
  // const secPass = await bcrypt.hash(password, salt);
  try {
    const newUser = {};
    if (PDF_DownloadLink) {
      newUser.PDF_DownloadLink = PDF_DownloadLink;
    }
    // if (password) {
    //   newUser.password = secPass;
    // }
    let tempuser = await User.findById(req.params.id);
    if (!tempuser) {
      res.status(404).send("Not Found");
    }

    tempuser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: newUser },
      { new: true }
    );

    res.json({ tempuser });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 5: Email veification
router.post("/register", async (req, res) => {
  const { email, otp } = req.body;
  try {
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yash222143@gmail.com",
        pass: "lkirckwfvkwlczwe",
      },
    });

    const mailOptions = {
      from: "yash222143@gmail.com",
      to: email,
      subject: "Email Verification",
      html: `<h1>Verify Your Email</h1> <h1> Your OTP is ${otp} </h2>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error" + error);
      } else {
        console.log("Email sent:" + info.response);
        res.status(201).json({ status: 201, info });
      }
    });
  } catch (error) {
    console.log("Error" + error);
    res.status(401).json({ status: 401, error });
  }
});

//Route 6: Upload Files in Cloudinary
router.post("/uploadFile", upload.single("myFile"), async (req, res) => {
  try {
    // check if file is present in request body
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const { myFile } = req.files;

    // upload PDF file to Cloudinary
    const result = await cloudinary.uploader.upload(myFile.tempFilePath, {
      resource_type: "auto",
      folder: "PDF_files",
      allowed_formats: ["pdf"],
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
