> *Note:* Please use the main [MaterialDesign](https://github.com/Templarian/MaterialDesign/issues) repo to report issues. This repo is for distribution of the SVG files only.

# SVG - Material Design Icons

SVG distribution for the [Material Design Icons](https://materialdesignicons.com).

```
npm install @mdi/svg
```

> Versions prior to `2.2.43` can be accessed on npm via `mdi-svg`

## Related Packages

[NPM @MDI Organization](https://npmjs.com/org/mdi)

- JavaScript/Typescript: [MaterialDesign-JS](https://github.com/Templarian/MaterialDesign-JS)
- Webfont: [MaterialDesign-Webfont](https://github.com/Templarian/MaterialDesign-Webfont)
- Font-Build: [MaterialDesign-Font-Build](https://github.com/Templarian/MaterialDesign-Font-Build)
- Desktop Font: [MaterialDesign-Font](https://github.com/Templarian/MaterialDesign-Font)

## Third Party

For those developing third party scripts/programs/applications. Please use this repo to make sure you're using latest production ready icons.

Great uses of the SVG Icon distribution includes:

- Scripts to generate your own webfont.
- Writing addons/plugins to integrate with applications.
- Themes - Every theme needs icons.
- AngularJS/Angular/React Components to work with the icons.

## Learn More

- [MaterialDesignIcons.com](https://materialdesignicons.com)
- https://github.com/Templarian/MaterialDesign

# Customization
## Mapping
To find all used mdi Icons and write them to the `iconMappings.ts` file, run the following command:
```bash
./generateIconMappings.sh
```

The script will skip icons that are already in the file and only add new ones. They have to be mapped manually to the correct FontAwesome icon.

The `iconMappings.ts` file is also manually enhanced with the mapping for icons not used as mdi icon but as vue-material-design-icons.

Not mapped icons have a `null` value for the `fa_icon` property.

## Overwriting SVGs
To override the SVGs of the mdi icons, with thei corresponding FontAwesome icons, run the following command:

```bash
npm run build
```

The script will replace the Path of the icon and add a data attribute.
The Path is resized to fit into a viewbox of 24x24px.
