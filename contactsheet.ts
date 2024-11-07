#!/usr/bin/env -S node -r ts-node/register/transpile-only

import fs from 'fs';
import path from 'path';
import iconMappings from './iconMappings';

const svgDir = path.resolve(__dirname, 'svg');

const generateContactSheet = () => {
	let markdownTable = '| Icon Name | SVG File | FontAwesome Icon | Preview |\n';
	markdownTable += '|-----------|----------|------------------|---------|\n';

	Object.entries(iconMappings).forEach(([name, { file, fa_icon }]) => {
		const svgPath = path.join(svgDir, file);

		const svgExists = fs.existsSync(svgPath);
		const svgLink = svgExists ? `[${file}](./svg/${file})` : 'File Not Found';
		const svgPreview = svgExists ? `![](./svg/${file})` : 'N/A';

		markdownTable += `| ${name} | ${svgLink} | ${fa_icon || 'None'} | ${svgPreview} |\n`;
	});

	// Write the generated markdown to the contact sheet file
	const outputPath = path.resolve(__dirname, 'contactSheet.md');
	fs.writeFileSync(outputPath, markdownTable, 'utf8');
	console.log(`Contact sheet generated at ${outputPath}`);
};

generateContactSheet();
