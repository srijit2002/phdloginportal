const express = require("express");
const router = express.Router();
const Departmaent = require("../models/Department");
const { body, validationResult } = require("express-validator");

router.post(
  "/createDepartment",
  [body("department", "Enter valid department name").isLength({ min: 3 })],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let department = await Departmaent.findOne({
        department: req.body.department,
      });
      if (department) {
        return res
          .status(400)
          .json({ success, error: "Department with same name exists" });
      }

      department = await Departmaent.create({
        department: req.body.department,
      });

      const data = {
        department: {
          id: department.id,
        },
      };

      //   const authtoken = jwt.sign(data, JWT_SECRET);
      // console.log(jwtData);
      success = true;
      // res.json(user);
      res.json({ success });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occured");
    }
    // res.send("hello");
  }
);


module.exports = router;
