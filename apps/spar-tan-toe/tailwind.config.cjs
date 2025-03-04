const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('node:path');

/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [require('@spartan-ng/brain/hlm-tailwind-preset')],
	content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'), ...createGlobPatternsForDependencies(__dirname)],
	theme: {
		extend: {},
	},
	plugins: [],
};
