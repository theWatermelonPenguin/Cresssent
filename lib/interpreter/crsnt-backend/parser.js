const fs = require("fs");

function parseCresssentBackend(source) {
    const lines = source.split("\n").map(line => line.trim()).filter(Boolean);
    const ast = {
        label: null,
        variables: {},
        functions: {}
    };

    let currentBlock = null;
    let currentFunc = null;

    for (const line of lines) {
        if (line.startsWith("LABEL")) {
            ast.label = line.split("=")[1].trim();
        } else if (line.startsWith("variables {")) {
            currentBlock = "variables";
        } else if (line.startsWith("backend {")) {
            currentBlock = "backend";
        } else if (line.endsWith("{")) {
            currentFunc = line.replace("{", "").trim();
            ast.functions[currentFunc] = [];
        } else if (line === "}") {
            currentBlock = null;
            currentFunc = null;
        } else if (currentBlock === "variables") {
            const [key, value] = line.split("=").map(p => p.trim());
            ast.variables[key] = JSON.parse(value);
        } else if (currentBlock === "backend" && currentFunc) {
            ast.functions[currentFunc].push(line);
        }
    }

    return ast;
}

module.exports = { parseCresssentBackend };
