export type TokenType =
	| 'NUMBER'
	| 'VARIABLE'
	| 'CONSTANT'
	| 'NAMED_FUNCTION'
	| 'LEFT_PARENTHESIS'
	| 'RIGHT_PARENTHESIS';
export type Token = {
	type: TokenType;
	value: string;
	args: number;
	precedence: 1;
};
export type AstNode = {
	left: null | AstNode;
	right: null | AstNode;
	token: Token;
};
