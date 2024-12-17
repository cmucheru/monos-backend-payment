const express = require("express");
const {
  login,
  getAllVendors,
  createVendor,

} = require("../controllers/vendor.controller");
const {
  validate,
  validateVendor,
} = require("../middlewares/validate.middleware");

const router = express.Router();
// Route for vendor login
router.post("/login",login);

router.get("/", getAllVendors);
router.post("/", validate(validateVendor), createVendor);

module.exports = router;
