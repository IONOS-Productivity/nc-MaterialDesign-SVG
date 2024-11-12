#!/usr/bin/env -S node -r ts-node/register/transpile-only

import {
	findIconDefinition,
	IconDefinition,
	IconLookup,
	IconName,
	IconPrefix,
	library
} from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fasr } from '@fortawesome/sharp-regular-svg-icons';
import { fass } from '@fortawesome/sharp-solid-svg-icons';
import iconMappings from './iconMappings';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import svgpath from 'svgpath';
import path from 'path';

library.add(fas, fab, far, fasr, fass);

const svgDir = path.resolve(__dirname, 'svg');
const distDir = path.resolve(__dirname, 'dist/svg');

const getIconName = (icon: string): IconLookup => {
	const prefix = <IconPrefix>icon?.split('-', 1)[0] || '';
	if (!prefix) {
		throw new Error(`Icon "${icon}" not found. Expected format: <prefix>-<name>`);
	}

	const iconName = <IconName>icon.slice(prefix.length + 1) || '';

	return {
		prefix,
		iconName
	};
};

export const updateSvg = async (filePath: string, iconPath: string): Promise<string> => {
	const originalSvg = await fs.readFile(filePath, 'utf-8');

	let updatedSvg = originalSvg.replace(/<path[^>]*\sd="[^"]*"/, `<path d="${iconPath}"`);

	updatedSvg = updatedSvg.replace(
		/<svg([^>]*)>/,
		`<svg$1 class="fa-raw-icon__svg">`
	);

	return updatedSvg;
};

const scaleSVGPath = (iconDefinition:IconDefinition, targetWidth:number, targetHeight:number) => {
	const originalWidth = iconDefinition?.icon[0] as number;
	const originalHeight = iconDefinition?.icon[1] as number;
	const iconPath = iconDefinition?.icon[4] as string;

	const scaleX = targetWidth / originalWidth;
	const scaleY = targetHeight / originalHeight;

	const scale = Math.min(scaleX, scaleY);

	// Calculate translations
	const translateX = (targetWidth - originalWidth * scale) / 2;
	const translateY = (targetHeight - originalHeight * scale) / 2;

	return svgpath(iconPath)
		.round(2)
		.scale(scale)
		.translate(translateX, translateY)
		.toString();
}

export const updateSvgIcons = async (targetWidth:number = 24, targetHeight:number = 24) => {
	for (const [, icon] of Object.entries(iconMappings)) {
		let iconDefinition: IconDefinition;
		try {
			if (icon.fa_icon) {
				iconDefinition = findIconDefinition(getIconName(icon.fa_icon));

				if (!iconDefinition) {
					throw new Error(`Icon not found: ${icon.fa_icon}`);
				}
			} else {
				throw new Error(`Icon fa_icon is null for icon: ${icon.file}`);
			}

			const filePath = path.resolve(svgDir, icon.file);
			const outputFilePath = path.resolve(distDir, icon.file);

			if (!existsSync(filePath)) {
				throw new Error(`File not found: ${filePath}`);
			}

			const faScaledPath = scaleSVGPath(iconDefinition, targetWidth, targetHeight);
			const newSvg = await updateSvg(filePath, faScaledPath);

			await fs.writeFile(outputFilePath, newSvg);
		} catch (e) {
			console.error(e);
		}
	}
};

updateSvgIcons()
	.then(() => console.log('Icons updated successfully'))
	.catch(e => console.error(e));
