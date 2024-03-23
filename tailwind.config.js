/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#20bf6b',
				secondary: '#f7b731',
				background: '#f5f6fa',
				dark: 'rgba(35, 37, 46, 0.85)',
				gray: '#ececec',
				darkGray: '#878ea2',
			},
			height: {
				button: '78px',
			},
		},
	},
	plugins: [],
};
