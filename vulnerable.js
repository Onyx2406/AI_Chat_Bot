// VULNERABLE CODE - Testing Paxley PR diff scanning
// Uses only Node.js built-ins for CodeQL to analyze

const http = require('http');
const url = require('url');
const fs = require('fs');
const { exec } = require('child_process');

// HARDCODED SECRETS - Should be detected by Gitleaks
// Using realistic formats that match known secret patterns
const STRIPE_API_KEY = 'sk_live_4eC39HqLyjWDarjtT1zdp7dc';
const SLACK_TOKEN = 'xoxb-263594206564-FGqddMF8t08v8N7Oq4i57vs1';
const PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF8PbnGy\n-----END RSA PRIVATE KEY-----';

// EVAL INJECTION - Direct user input in eval
// CodeQL should definitely detect this
function dangerousEval(userInput) {
  return eval(userInput);
}

// COMMAND INJECTION - User input in shell command
// CodeQL should detect this even without express types
function runCommand(cmd) {
  exec(cmd, (err, stdout) => {
    console.log(stdout);
  });
}

// PATH TRAVERSAL - User input in file path
function readUserFile(filename) {
  return fs.readFileSync('/data/' + filename, 'utf8');
}

// Create HTTP server with vulnerable endpoints
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;

  // VULNERABLE: Direct eval of user input
  if (parsedUrl.pathname === '/eval') {
    const result = eval(query.code);
    res.end(String(result));
  }

  // VULNERABLE: Command injection
  if (parsedUrl.pathname === '/exec') {
    exec(query.cmd, (err, stdout) => {
      res.end(stdout);
    });
  }

  // VULNERABLE: Path traversal
  if (parsedUrl.pathname === '/read') {
    const content = fs.readFileSync(query.file);
    res.end(content);
  }

  res.end('OK');
});

server.listen(3000);
console.log('Vulnerable server running on port 3000');
