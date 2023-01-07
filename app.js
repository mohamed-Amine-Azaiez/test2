const express = require("express");
const HttpError = require("./models/http-error");
const app = express();
const transactionRoute = require("./routes/transaction-route");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.get("/", (req, res) => {
  res.send("Welcome! ");
});

app.use("/api", transactionRoute);
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
