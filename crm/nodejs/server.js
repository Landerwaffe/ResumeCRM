/* eslint-disable eqeqeq */
const express = require("express");
const { Client } = require("pg");
const app = express();
const port = 8080;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "ResumeCRM",
  password: "admin",
  port: 5432,
});

client.connect();

var cors = require("cors");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

app.use(cors());

app.get("/", (req, res) => {
  const queryType = req.query.type;

  // console.log("Query Type is: " + queryType);
  // if (queryType == "Login") {
  //   client.query(
  //     `SELECT * FROM public.users WHERE username =` +
  //       "'" +
  //       req.body.email +
  //       "'",
  //     (err, result) => {
  //       if (err) {
  //         res.status(500).send(err.message);
  //       } else {
  //         console.log("Sending User Type");
  //         res.json(result.rows);
  //       }
  //     }
  //   );
  // } else if (queryType == "Details") {
  //   client.query(`SELECT * FROM public.details`, (err, result) => {
  //     if (err) {
  //       res.status(500).send(err.message);
  //     } else {
  //       res.json(result.rows);
  //     }
  //   });
});

app.post("/", jsonParser, (req, res) => {
  const queryType = req.query.type;

  if (queryType == "Register") {
    if (req.body.email && req.body.password != null) {
      console.log("Went to Registration Backend");
      console.log("Request object is: ");
      console.log(req.body.email);
      client.query(
        `INSERT INTO public.users(
      username, password)
      VALUES ( $1 , $2)`,
        [req.body.email, req.body.password],
        (err, result) => {
          if (err) {
            res.status(500).send(err.message);
          } else {
            res.send("DONE");
          }
        }
      );
    }
  } else if (queryType == "Login") {
    client.query(
      `SELECT * FROM public.users WHERE username =` +
        "'" +
        req.body.email +
        "'",
      (err, result) => {
        if (req.body.email && req.body.password != null && result.rows[0]) {
          console.log("Went to Login Backend");
          console.log("Result is: " + JSON.stringify(result.rows[0].password));

          console.log(
            "Username and password are: " +
              req.body.email +
              " and " +
              JSON.stringify(req.body.password)
          );
          if (
            JSON.stringify(req.body.password) ==
              JSON.stringify(result.rows[0].password) &&
            result.rows[0]
          ) {
            console.log("Password Correct!");

            //res.send("loggedIn");
            res.json(result.rows);
          } else {
            console.log("Password Wrong!");
          }
        } else {
          console.log("No such user exists!");
        }
      }
    );
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
