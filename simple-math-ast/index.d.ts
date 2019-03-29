type TokenType =
	| 'NUMBER'
	| 'VARIABLE'
	| 'CONSTANT'
	| 'NAMED_FUNCTION'
	| 'LEFT_PARENTHESIS'
	| 'RIGHT_PARENTHESIS';
type Token = {
	type: TokenType;
	value: string;
	args: number;
	precedence: 1;
};
type AstNode = {
	left: null | AstNode;
	right: null | AstNode;
	token: Token;
};

declare module 'simple-math-ast' {
	function build(arg: string): AstNode;
	export default build;
}
