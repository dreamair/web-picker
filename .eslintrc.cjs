// This is a workaround for https://github.com/eslint/eslint/issues/3458
// require('@alls/eslint-config/patch/modern-module-resolution');

/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended',
		'plugin:@typescript-eslint/recommended', 'plugin:svelte/recommended'],
	plugins: ['@typescript-eslint', 'import'],
	ignorePatterns: ['/*.config.*', '.eslintrc.*',
		'node_modules/', 'dist/', 'build/', '*.html'],
	overrides: [{
		files: ['*.svelte'],
		parser: 'svelte-eslint-parser',
		parserOptions: {
			parser: '@typescript-eslint/parser'
		}
	}],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		project: ['./tsconfig.json'],
		extraFileExtensions: ['.svelte'],
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'sort-imports': ['warn', {
			// try to match vscode organize imports
			ignoreCase: false,
			ignoreDeclarationSort: true,
			ignoreMemberSort: false,
			memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
			allowSeparatedGroups: false
		}],
		'import/extensions': ['error', 'ignorePackages'],
		'no-restricted-imports': ['error', {
			patterns: ['**/__test__/**/*']
		}],
		'max-len': [
			'warn',
			{
				code: 80,
				tabWidth: 2,
				ignoreRegExpLiterals: true,
				ignoreUrls: true,
			}
		],
		'object-curly-spacing': ['warn', 'always'],
		'comma-dangle': ['warn', 'only-multiline'],
		// 'arrow-parens': ["warn", "as-needed"],
		// "no-unused-vars": "off",
		semi: 'off',
		'@typescript-eslint/semi': ['warn', 'never'],
		'@typescript-eslint/quotes': [
			'warn',
			'single',
			{
				avoidEscape: true
			}
		],
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-unused-vars':
			['warn', {
				vars: 'all',
				args: 'after-used',
				ignoreRestSiblings: true,
				argsIgnorePattern: '^_'
			}],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/member-delimiter-style': ['warn', {
			multiline: {
				delimiter: 'none',
				requireLast: false
			},
			singleline: {
				delimiter: 'semi',
				requireLast: false
			},
			multilineDetection: 'brackets'
		}],
		'@typescript-eslint/consistent-type-imports': ['warn', {
			prefer: "type-imports",
			fixStyle: "separate-type-imports",
		}],
		'import/consistent-type-specifier-style': ["warn", "prefer-top-level"],
		'@typescript-eslint/consistent-type-exports': ['warn', {
			fixMixedExportsWithInlineTypeSpecifier: true,
		}],

		// throws TypeError: Cannot read properties of undefined (reading 'flags')
		// in tests involving rxjs in this setup...
		'@typescript-eslint/no-misused-promises': 'off',
		'import/consistent-type-specifier-style': ['warn', 'prefer-top-level'],
		'curly': ['error', 'multi-or-nest', 'consistent'],
		'@typescript-eslint/restrict-template-expressions': 'off'
	}
};
