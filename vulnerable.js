// Vulnerable code
const API_KEY = 'sk-live-1234567890abcdef';
const exec = require('child_process').exec;
function runCmd(userInput) { exec('ping ' + userInput); }
