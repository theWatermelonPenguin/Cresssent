const fs = require("fs");
const path = require("path");
const { parseCresssentBackend } = require("./parser");
const { runBackend } = require("./interperter");

const file = path.join(__dirname, "..", "..", "..", "examples", "example.crsntb");
const source = fs.readFileSync(file, "utf-8");

const ast = parseCresssentBackend(source);
runBackend(ast);
