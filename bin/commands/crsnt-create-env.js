// bin/crsnt-create-env.js
const fs = require('fs');
const path = require('path');

const envFileContent = `LABEL = Cresssent Enviroment

envoirment{
    database{
        type = 
        credentials{
            username = databaseuser
            password = password
        }
    }
    server{
        host = localhost
        port = 8080
        autoReload = active
    }
    runtime{
        FlourMill = 
    }
    product{
        version = 1.0.0
        info = This is my product
    }
    logging{
        level = general
        output = console
    }
}
`;

function createEnvFile() {
    const filePath = path.join(process.cwd(), 'environment.crsnte');

    if (fs.existsSync(filePath)) {
        console.log('Environment file already exists at', filePath);
        return;
    }

    fs.writeFileSync(filePath, envFileContent, 'utf-8');
    console.log('Created default environment file at', filePath);
}

createEnvFile();
