function runBackend(ast) {
    const context = { ...ast.variables };

    for (const [funcName, lines] of Object.entries(ast.functions)) {
        console.log(`Running ${funcName}...`);

        for (const line of lines) {
            if (line.startsWith("print")) {
                const msg = line.replace("print", "").trim().replace(/"/g, "").replace("+", "");
                console.log("→", msg.trim() + " " + context.username);
            } else if (line.includes("=")) {
                const [key, expr] = line.split("=").map(s => s.trim());
                if (expr.includes("+")) {
                    const [left, right] = expr.split("+").map(s => s.trim());
                    context[key] = (context[left] || 0) + parseInt(right);
                } else {
                    context[key] = JSON.parse(expr);
                }
            }
        }
    }

    console.log("\nFinal Context:", context);
}

module.exports = { runBackend };
