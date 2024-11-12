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

import path from 'path';

library.add(fas, fab, far, fasr, fass);

const svgDir = path.resolve(__dirname, 'svg');

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

export const updateSvg = async (filePath: string, iconPath: string) => {
	const originalSvg = await fs.readFile(filePath, 'utf-8');

	let updatedSvg = originalSvg.replace(/<path[^>]*\sd="[^"]*"/, `<path d="${iconPath}"`);

	updatedSvg = updatedSvg.replace(
		/<svg([^>]*)>/,
		`<svg$1 class="fa-raw-icon__svg">`
	);

	await fs.writeFile(filePath, updatedSvg);
	console.log(`Updated ${filePath}`);
};

export const updateSvgIcons = () => {
	Object.entries(iconMappings).forEach(([, icon]) => {
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

			const iconPath = iconDefinition?.icon[4] as string;

			const filePath = path.resolve(svgDir, icon.file);

			if (existsSync(filePath)) {
				updateSvg(filePath, iconPath);
			} else {
				console.error(`File not found: ${filePath}`);
			}
		} catch (e) {
			console.error(e);
		}
	});
};

updateSvgIcons();
