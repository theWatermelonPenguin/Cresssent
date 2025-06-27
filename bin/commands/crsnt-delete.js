const fs = require('fs');
const path = require('path');

function deleteFilesByType(type) {
  // map type to file extensions or patterns
  const typeMap = {
    env: ['.crsnte', '.environment'],
    project: ['project.json'], // example
    // add other mappings here
  };

  const exts = typeMap[type];
  if (!exts) {
    console.error(`Unknown file type: ${type}`);
    return;
  }

  const files = fs.readdirSync(process.cwd());
  let deletedCount = 0;

  files.forEach(file => {
    if (exts.some(ext => file.endsWith(ext))) {
      const fullPath = path.join(process.cwd(), file);
      fs.unlinkSync(fullPath);
      console.log(`Deleted file: ${file}`);
      deletedCount++;
    }
  });

  if (deletedCount === 0) {
    console.log(`No files of type '${type}' found.`);
  }
}

module.exports = function deleteCommand(arg) {
  if (!arg) {
    console.error('Please specify a file or file type to delete.');
    return;
  }

  const fullPath = path.join(process.cwd(), arg);
  if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile()) {
    // Delete specific file
    fs.unlinkSync(fullPath);
    console.log(`Deleted file: ${arg}`);
  } else {
    // Treat as file type
    deleteFilesByType(arg);
  }
};
