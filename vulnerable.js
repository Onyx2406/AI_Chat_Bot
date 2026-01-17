// VULNERABLE CODE - For testing Paxley PR scanning
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
app.use(express.json());

// HARDCODED SECRETS - should be detected by Gitleaks
const OPENAI_API_KEY = 'sk-proj-abcdef123456789012345678901234567890abcd';
const AWS_ACCESS_KEY = 'AKIAIOSFODNN7EXAMPLE';
const AWS_SECRET_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

const GITHUB_TOKEN = 'ghp_xXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX';
// COMMAND INJECTION - should be detected by CodeQL
app.get('/ping', (req, res) => {
  const host = req.query.host;
  exec('ping -c 1 ' + host, (err, stdout) => {
    res.send(stdout);
  });
});

// XSS - should be detected by CodeQL  
app.get('/search', (req, res) => {
  const q = req.query.q;
  res.send('<html><body>Results: ' + q + '</body></html>');
});

// PATH TRAVERSAL - should be detected by CodeQL
app.get('/file', (req, res) => {
  const name = req.query.name;
  const content = fs.readFileSync('/var/data/' + name, 'utf-8');
  res.send(content);
});

// EVAL INJECTION - should be detected by CodeQL
app.post('/calc', (req, res) => {
  const expr = req.body.expression;
  const result = eval(expr);
  res.json({ result });
});

app.listen(3000);

// Trigger PR scan test - 2026-01-17T18:48:19.988Z

// Test PR scan #2 - 2026-01-17T19:01:32.055Z
