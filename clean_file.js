const fs = require('fs');
const path = 'm:\\JSprojects\\RNGP_MOSCOW_2025.11.17\\rngp_2025_11_17\\mainEngine.js';
let content = fs.readFileSync(path, 'utf8');
// Remove null bytes
content = content.replace(/\0/g, '');
fs.writeFileSync(path, content);
console.log('Cleaned file');
