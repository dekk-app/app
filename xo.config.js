/**
 * {@see https://eslint.org/docs/user-guide/configuring/rules}
 */
module.exports = {
	extends: ["xo-react", "prettier"],
	ignores: [
		"cypress",
		"public",
		"migrations",
		"*.config.js",
		"next-env.d.ts",
		"types/*.d.ts",
		"prepare/mockServiceWorker.js",
		"src/types/contentful-api.ts",
		"src/types/backend-api.ts",
		"src/types/units.ts",
	],
	plugins: ["prettier"],
	env: ["browser", "node"],
	overrides: [
		{
			files: "**/*.{ts,tsx}",
			rules: {
				"@typescript-eslint/consistent-type-assertions": [
					1,
					{
						assertionStyle: "as",
						objectLiteralTypeAssertions: "allow-as-parameter",
					},
				],
				"@typescript-eslint/naming-convention": 0,
				"react/prop-types": 0,
				"react/display-name": 0,
				"arrow-body-style": 0,
				"import/extensions": [
					1,
					{
						js: "never",
						jsx: "never",
						ts: "never",
						tsx: "never",
						css: "always",
						json: "always",
					},
				],
			},
		},
		{
			files: "prepare/*.js",
			rules: {
				"unicorn/prefer-module": 0,
			},
		},
	],
	prettier: true,
	rules: {
		"import/order": 0,
		"unicorn/no-array-reduce": 0,
		"unicorn/prefer-node-protocol": 0,
	},
};
