/** @type {import('tailwindcss').Config} */
module.exports = {
  purge   : ['./views/*.html'], // Paths to HTML and JS files to scan for used classes
  darkMode: false,
  theme   : {
	extend: {
	  colors    : {
		primary  : '#e58d5b',
		secondary: '#333333',
	  },
	  fontFamily: {
		sans: [
		  'Poppins',
		  'sans-serif'
		],
	  },
	  boxShadow : {
		sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
	  },
	  spacing   : {
		'1/2': '0.125rem',
	  },
	},
  },
  variants: {
	extend: {},
  },
  plugins : [],
  content : ['./views/*.html'],
  
};
