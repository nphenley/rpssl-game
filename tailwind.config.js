/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./_components/**/**/*.{js,ts,jsx,tsx}',
		'./_styled/**/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				grey: 'rgba(242,242,242,1)',

				primary: 'hsl(119, 33%, 60%)',

				background: 'hsl(0, 0%, 20%)',
			},
			screens: {
				xl: '1200px',
				'3xl': '1900px',
				'4xl': '2150px',
				'5xl': '2400px',
			},
			fontFamily: {
				fancy: ['Tangerine'],
			},
		},
	},
	plugins: [],
};
