module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es2024: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:astro/recommended',
		'plugin:import/recommended',
		'prettier',
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'import/order': [
			'error',
			{
				groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
				pathGroups: [
					{
						pattern: 'astro',
						group: 'builtin',
						position: 'before',
					},
				],
				pathGroupsExcludedImportTypes: ['astro'],
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
			},
		],
		'no-console': ['warn', { allow: ['warn', 'error'] }],
	},
	overrides: [
		{
			files: ['*.astro'],
			parser: 'astro-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
			},
			rules: {},
		},
		{
			files: ['*.ts', '*.tsx'],
			parser: '@typescript-eslint/parser',
			extends: ['plugin:@typescript-eslint/recommended'],
		},
	],
};
