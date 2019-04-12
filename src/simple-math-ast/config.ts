import TokenType from './types';

export type RuleWrapper = {key: string; data: Rule};

export type Rule = {
	type: TokenType;
	args?: number;
	precedence?: number;
};

export type Token = Rule & {
	value: number | string | (number | string)[];
};

const config: {rules: RuleWrapper[]} = {
	rules: [
		{
			key:
				'round|floor|ceil|asin|acos|atan|sin|cos|tan|cot|log|sqrt|min|max|pow|exp|abs|acc|diff',
			data: {
				type: TokenType.NAMED_FUNCTION,
				args: 1,
				precedence: 4
			}
		},
		{
			key: 'PI|pi',
			data: {
				type: TokenType.CONSTANT
			}
		},
		{
			key: '\\*\\*',
			data: {
				type: TokenType.OPERATOR,
				args: 2,
				precedence: 2
			}
		},
		{
			key: '\\<\\=',
			data: {
				type: TokenType.OPERATOR,
				args: 2,
				precedence: 2
			}
		},
		{
			key: '\\>\\=',
			data: {
				type: TokenType.OPERATOR,
				args: 2,
				precedence: 2
			}
		},
		{
			key: '\\=\\=\\=',
			data: {
				type: TokenType.OPERATOR,
				args: 2,
				precedence: 2
			}
		},
		{
			key: '\\!\\=\\=',
			data: {
				type: TokenType.OPERATOR,
				args: 2,
				precedence: 2
			}
		},
		{
			key: '\\!',
			data: {
				type: TokenType.NAMED_FUNCTION,
				args: 1,
				precedence: 4
			}
		},
		{
			key: '\\>',
			data: {
				type: TokenType.OPERATOR,
				args: 2,
				precedence: 2
			}
		},
		{
			key: '\\<',
			data: {
				type: TokenType.OPERATOR,
				args: 2,
				precedence: 2
			}
		},
		{
			key: '\\|\\|',
			data: {
				type: TokenType.OPERATOR,
				args: 2,
				precedence: 2
			}
		},
		{
			key: '\\&\\&',
			data: {
				type: TokenType.OPERATOR,
				args: 2,
				precedence: 2
			}
		},
		{
			key: '[\\*\\/\\%]',
			data: {
				type: TokenType.OPERATOR,
				args: 2,
				precedence: 2
			}
		},
		{
			key: '[\\+\\-\\,]',
			data: {
				type: TokenType.OPERATOR,
				args: 2,
				precedence: 1
			}
		},
		{key: '[(\\[]', data: {type: TokenType.LEFT_PARENTHESIS}},
		{key: '[)\\]]', data: {type: TokenType.RIGHT_PARENTHESIS}},
		{key: '[0-9.,]+', data: {type: TokenType.NUMBER}},
		{key: '[a-zA-Z]+', data: {type: TokenType.VARIABLE}}
	]
};

export default config;
