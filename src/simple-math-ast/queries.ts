import {pipe, prop, equals} from 'ramda';

import TokenType from './types';

const isType = (type: TokenType) =>
	pipe(
		// @ts-ignore
		prop('type'),
		equals(type)
	);

export const isNumber = isType(TokenType.NUMBER);
export const isConstant = isType(TokenType.CONSTANT);
export const isVariable = isType(TokenType.VARIABLE);
export const isOperator = isType(TokenType.OPERATOR);
export const isNamedFunction = isType(TokenType.NAMED_FUNCTION);
export const isLeftParenthesis = isType(TokenType.LEFT_PARENTHESIS);
export const isRightParenthesis = isType(TokenType.RIGHT_PARENTHESIS);
