#!/usr/bin/env -S node -r ts-node/register/transpile-only

import fs from 'fs';
import path from 'path';
import iconMappings from './iconMappings';
import { getIconInfo } from './build';

const svgDir = path.resolve(__dirname, 'svg');

const generateContactSheet = () => {
	let markdownTable = '| Icon Name | SVG File | MDI Preview | FA Preview | FA Icon |\n';
	markdownTable += '|-----------|----------|-------------|------------|------------------|\n';

	Object.entries(iconMappings).forEach(([name, { file, fa_icon }]) => {
		const svgPath = path.join(svgDir, file);

		const svgExists = fs.existsSync(svgPath);
		const svgLink = svgExists ? `[${file}](./svg/${file})` : 'File Not Found';
		const svgPreview = svgExists ? `![](./svg/${file})` : 'N/A';
		const svgFaPreview = svgExists ? `![](./dist/svg/${file})` : 'N/A';

		let faSiteLink = 'None';
		if (fa_icon !== null) {
			const { iconName, iconLink , prefix} = getIconInfo(fa_icon);
			faSiteLink = `${prefix}-[${iconName}](${iconLink})`;
		}

		markdownTable += `| ${name} | ${svgLink} | ${svgPreview} | ${svgFaPreview} | ${faSiteLink} |\n`;
	});

	// Write the generated markdown to the contact sheet file
	const outputPath = path.resolve(__dirname, 'contactSheet.md');
	fs.writeFileSync(outputPath, markdownTable, 'utf8');
	console.log(`Contact sheet generated at ${outputPath}`);
};

generateContactSheet();
