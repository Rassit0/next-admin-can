const fs = require('fs');

let code = fs.readFileSync('src/modules/portal/home/components/fixture-section.tsx', 'utf-8');
code = code.replace('m.status === "SCHEDULED"', 'm.status === "PENDING"');
fs.writeFileSync('src/modules/portal/home/components/fixture-section.tsx', code);
console.log("Updated to PENDING");
