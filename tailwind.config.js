/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				background: '#f5f6fa',
				primary: '#20bf6b',
				primary_02: '#20bf6b33',
				primary_05: 'rgba(32, 191, 107, 0.35)',
				primary_08: 'rgba(32, 191, 107, 0.58)',
				primaryLight: '#26de81',
				secondary: '#f7b731',
				secondary_05: 'rgba(255, 159, 91, 0.35)',
				secondary_08: 'rgba(255, 159, 91, 0.58)',
				secondaryLight: '#fed330',
				dark: 'rgba(35, 37, 46, 0.85)',
				darkGray: '#878ea2',
				gray: '#ececec',
				grayLight: '#fafbff',
				link: '#2cabe3',
				info: '#3498db',
			},
			height: {
				button: '78px',
			},
			gridTemplateRows: {
				buttons: 'grid-template-rows: repeat(2, 78px);',
			},
		},
	},
	plugins: [],
};
