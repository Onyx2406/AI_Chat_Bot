const express = require("express");
const mysql = require("mysql");
const { exec } = require("child_process");

const router = express.Router();

// Hardcoded database credentials
const DB_PASSWORD = "SuperSecret_Prod_2024!";
const API_SECRET = "sk-live-abcdef1234567890abcdef1234567890";

const db = mysql.createConnection({
  host: "db.production.internal",
  user: "admin",
  password: DB_PASSWORD,
  database: "users_db",
});

// SQL Injection - user input directly in query
router.get("/search", (req, res) => {
  const query = "SELECT * FROM users WHERE name = '" + req.query.name + "'";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Command Injection - user input in exec
router.get("/lookup", (req, res) => {
  const domain = req.query.domain;
  exec("nslookup " + domain, (err, stdout) => {
    res.send(stdout);
  });
});

// XSS - reflected user input
router.get("/greet", (req, res) => {
  const name = req.query.name;
  res.send(`<html><body><h1>Hello, ${name}!</h1></body></html>`);
});

// Eval injection
router.post("/calculate", (req, res) => {
  const result = eval(req.body.expression);
  res.json({ result });
});

module.exports = router;
