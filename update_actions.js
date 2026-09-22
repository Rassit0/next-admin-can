const fs = require('fs');

let createMatchCode = fs.readFileSync('src/modules/calendar/actions/create-match.action.ts', 'utf-8');
createMatchCode = createMatchCode.replace('teamSeasonCategoryId: string;', 'homeTeamSeasonCategoryId?: string | null;\n  awayTeamSeasonCategoryId?: string | null;');
fs.writeFileSync('src/modules/calendar/actions/create-match.action.ts', createMatchCode);

let updateMatchCode = fs.readFileSync('src/modules/calendar/actions/update-match.action.ts', 'utf-8');
updateMatchCode = updateMatchCode.replace('teamSeasonCategoryId?: string;', 'homeTeamSeasonCategoryId?: string | null;\n  awayTeamSeasonCategoryId?: string | null;');
fs.writeFileSync('src/modules/calendar/actions/update-match.action.ts', updateMatchCode);

console.log("Updated action files.");
