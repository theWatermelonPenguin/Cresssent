// bin/crsnt-config.js
const fs = require('fs');
const path = require('path');
const os = require('os');

const configPath = path.join(os.homedir(), '.crsntconfig');

// Default config
const defaultConfig = `config {
    defaultEditor = code
    defaultEnvironment = ./environment.crsnte
    autoReload = true
    logLevel = debug
    projectTemplate = default
}`;

function loadConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, defaultConfig, 'utf-8');
    }
    return fs.readFileSync(configPath, 'utf-8');
}

function saveConfig(content) {
    fs.writeFileSync(configPath, content, 'utf-8');
}

function setConfigValue(key, value) {
    let content = loadConfig();
    const regex = new RegExp(`(${key}\\s*=\\s*)(.*)`);
    if (regex.test(content)) {
        content = content.replace(regex, `$1${value}`);
    } else {
        content = content.replace(/config\s*{/, `config {\n    ${key} = ${value}`);
    }
    saveConfig(content);
    console.log(`Set ${key} to ${value}`);
}

function resetConfig() {
    saveConfig(defaultConfig);
    console.log('Config has been reset to default.');
}

function showConfig() {
    const content = loadConfig();
    console.log('Current configuration:\n');
    console.log(content);
}

// Parse arguments
const args = process.argv.slice(2);

if (args.length === 0) {
    showConfig();
} else if (args[0] === 'set' && args.length === 3) {
    const [_, key, value] = args;
    setConfigValue(key, value);
} else if (args[0] === 'reset') {
    resetConfig();
} else {
    console.log('Usage:\n  crsnt config\n  crsnt config set <key> <value>\n  crsnt config reset');
}
