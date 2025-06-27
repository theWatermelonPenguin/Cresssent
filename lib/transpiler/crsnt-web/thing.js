const input = `
LABEL = Cresssent Web Development

page{
    main{
        title = Cresssent analogy
    }
    body{
        header{
            size = 1
            text = This is Cresssent
        }
        image{
            source = path.jpg
        }
    }
}
`;

function parseCrsntwd(input) {
    const lines = input.split('\n').map(l => l.trim()).filter(Boolean);

    let index = 0;

    function parseBlock() {
        const node = {};
        while (index < lines.length) {
            let line = lines[index];

            if (line.endsWith('{')) {
                // Start of a nested block
                const tag = line.slice(0, -1).trim();
                index++;
                node[tag] = parseBlock();
            } else if (line === '}') {
                index++;
                break;
            } else if (line.includes('=')) {
                // key=value line
                const [key, ...rest] = line.split('=');
                node[key.trim()] = rest.join('=').trim();
                index++;
            } else {
                index++;
            }
        }
        return node;
    }

    // Handle LABEL first
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

    // Handle label as doctype
    html += '<!DOCTYPE html>\n';

    // Helper for heading
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
                // Handle simple tags like title
                if (tag === 'title') {
                    out += `<title>${content}</title>\n`;
                }
            } else if (typeof content === 'object') {
                // nested blocks
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

const parsed = parseCrsntwd(input);
const outputHtml = transpileToHtml(parsed);

console.log(outputHtml);
