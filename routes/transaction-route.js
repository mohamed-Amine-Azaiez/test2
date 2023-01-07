const express = require("express");
const transactionController = require("../controllers/transaction-controller");
const router = express.Router();

router.get(
  "/transactions",
  transactionController.getTransactionByIdAndConfidance
);

module.exports = router;
