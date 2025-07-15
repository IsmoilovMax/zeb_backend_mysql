module.exports = {
	apps: [
		{
			name: 'zeb-backend',
			script: 'src/index.js',
			env: {
				PORT: 8080,
			},
		},
	],
}
