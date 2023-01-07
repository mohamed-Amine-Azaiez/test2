const HttpError = require("../models/http-error");
/* const fs = require("fs");
const myData = JSON.parse(
  fs.readFileSync("./../data/data.json", "utf8")
); */

const myData = require("../data/data.json");

const getTransactionByIdAndConfidance = (req, res, next) => {
  const transactionId = req.query.transactionId;
  const confidenceLevel = +req.query.confidenceLevel;

  const transactions = getTransactions(myData, transactionId, confidenceLevel);

  if (transactions.length === 0) {
    const error = new HttpError(
      "Could not find transactions with the provided ID",
      404
    );
    return next(error);
  }

  res.send(transactions);
};

const getTransactions = (
  data,
  id,
  confidence,
  parentConfidence = 1,
  connectionTypes = [],
  child
) => {
  const transactions = [];

  for (const trans of data) {
    let combinedConfidence = parentConfidence;
    let combinedTypes = connectionTypes;

    if (trans.id === id) {
      //console.log("yes");
      transactions.push({
        id: trans.id,
        age: trans.age,
        name: trans.name,
        email: trans.email,
        phone: trans.phone,
        geoInfo: trans.geoInfo,
      });

      // Recursively call the function for each child trans

      if (trans.children) {
        transactions.push(
          ...getTransactions(
            trans.children,
            id,
            confidence,
            combinedConfidence,
            combinedTypes,
            (child = true)
          )
        );
      }
    } else if (child === true) {
      //console.log("here ");
      if (
        trans.connectionInfo &&
        trans.connectionInfo.confidence >= confidence
      ) {
        combinedConfidence *= trans.connectionInfo.confidence;
        combinedTypes.push(trans.connectionInfo.type);
        transactions.push({
          id: trans.id,
          age: trans.age,
          name: trans.name,
          email: trans.email,
          phone: trans.phone,
          geoInfo: trans.geoInfo,
          connectionInfo: trans.connectionInfo,
          combinedConnectionInfo: {
            confidence: combinedConfidence,
            types: combinedTypes,
          },
        });

        // Recursively call the function for each child trans
        if (trans.children) {
          transactions.push(
            ...getTransactions(
              trans.children,
              id,
              confidence,
              combinedConfidence,
              combinedTypes,
              (child = true)
            )
          );
        }
      }
    }

    if (trans.children) {
      transactions.push(...getTransactions(trans.children, id, confidence));
    }
  }
  return transactions;
};

exports.getTransactionByIdAndConfidance = getTransactionByIdAndConfidance;
