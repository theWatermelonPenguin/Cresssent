const fs = require('fs');
const path = require('path');
const http = require('http');
const child_process = require('child_process');

module.exports = function(args) {
  if (args.length === 0) {
    console.error('Usage: crsnt run <file.crsntwd>');
    process.exit(1);
  }

  const inputFile = path.resolve(args[0]);

  // Your parser & transpiler
  function parseCrsntwd(input) {
    const lines = input.split('\n').map(l => l.trim()).filter(Boolean);
    let index = 0;
    function parseBlock() {
      const node = {};
      while (index < lines.length) {
        let line = lines[index];
        if (line.endsWith('{')) {
          const tag = line.slice(0, -1).trim();
          index++;
          node[tag] = parseBlock();
        } else if (line === '}') {
          index++;
          break;
        } else if (line.includes('=')) {
          const [key, ...rest] = line.split('=');
          node[key.trim()] = rest.join('=').trim();
          index++;
        } else {
          index++;
        }
      }
      return node;
    }
    const firstLine = lines[0];
    let label = null;
    if (firstLine.startsWith('LABEL')) {
      label = firstLine.split('=')[1].trim();
      index = 1;
    }
    const ast = parseBlock();
    return { label, ast };
  }

  function transpileToHtml(parsed) {
    const { label, ast } = parsed;
    let html = '';
    html += '<!DOCTYPE html>\n';
    function headerToHtml(headerNode) {
      const size = headerNode.size || '1';
      const text = headerNode.text || '';
      return `<h${size}>${text}</h${size}>`;
    }
    function walk(node) {
      let out = '';
      for (const tag in node) {
        const content = node[tag];
        if (typeof content === 'string') {
          if (tag === 'title') {
            out += `<title>${content}</title>\n`;
          }
        } else if (typeof content === 'object') {
          if (tag === 'page') {
            out += `<html>\n${walk(content)}</html>\n`;
          } else if (tag === 'main') {
            out += `<head>\n${walk(content)}</head>\n`;
          } else if (tag === 'body') {
            out += `<body>\n${walk(content)}</body>\n`;
          } else if (tag === 'header') {
            out += `<header>\n${headerToHtml(content)}\n</header>\n`;
          } else if (tag === 'image') {
            const src = content.source || '';
            out += `<img src="${src}" />\n`;
          }
        }
      }
      return out;
    }
    html += walk(ast);
    return html;
  }

  fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      process.exit(1);
    }

    try {
      const parsed = parseCrsntwd(data);
      const htmlContent = transpileToHtml(parsed);

      // Start HTTP server to serve htmlContent
      const server = http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
        res.end(htmlContent);
      });

      const port = 3000;

      server.listen(port, () => {
        console.log(`Serving your crsntwd page at http://localhost:${port}`);

        // Open default browser
        let openCommand;
        switch (process.platform) {
          case 'win32':
            openCommand = `start http://localhost:${port}`;
            break;
          case 'darwin':
            openCommand = `open http://localhost:${port}`;
            break;
          default:
            openCommand = `xdg-open http://localhost:${port}`;
        }

        child_process.exec(openCommand, (error) => {
          if (error) {
            console.error('Failed to open browser:', error);
          }
        });
      });

      // Optional: Close server after 2 minutes so it doesn't keep running forever
      setTimeout(() => {
        server.close(() => {
          console.log('Server closed after 2 minutes');
        });
      }, 2 * 60 * 1000);

    } catch (e) {
      console.error('Error parsing or transpiling:', e);
      process.exit(1);
    }
  });
};
