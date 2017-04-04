const { writeFileSync, readFileSync } = require('fs');

const packageJson = JSON.parse(readFileSync('./package.json').toString());
delete packageJson.devDependencies;
delete packageJson.scripts;
writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));
