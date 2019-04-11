import Animated from 'react-native-reanimated';
import {InvalidExpressionError} from './InvalidExpressionError';
import ASTNode from './simple-math-ast/parse/node';
import TokenType from './simple-math-ast/types';
import logPrefix from './log-prefix';

export type Variables = {
	[key: string]: any;
};

export type MathType = 'reanimated' | 'native';

const reduceAst = (
	tree: ASTNode,
	variables: Variables,
	mathType: MathType
): number | Animated.Node<number> | (number | Animated.Node<number>)[] => {
	if (!tree) {
		throw new InvalidExpressionError('Could not parse');
	}
	if (tree.token.type === TokenType.NUMBER) {
		return Number(tree.token.value);
	}
	if (tree.token.type === TokenType.CONSTANT) {
		if (tree.token.value === 'pi' || tree.token.value === 'PI') {
			return Math.PI;
		}
	}
	if (tree.token.type === TokenType.VARIABLE) {
		return variables[tree.token.value as string];
	}

	const left = reduceAst(tree.left as ASTNode, variables, mathType);
	if (tree.token.type === TokenType.NAMED_FUNCTION) {
		if (tree.token.value === 'log') {
			if (mathType === 'reanimated') {
				throw new TypeError(
					`${logPrefix} log() is not supported by Reanimated`
				);
			}
			return Math.log(left as number);
		}
		if (tree.token.value === 'sin') {
			if (Array.isArray(left)) {
				throw new TypeError(`${logPrefix} Cannot pass an array to sin()`);
			}
			if (mathType === 'reanimated') {
				return Animated.sin(left);
			}
			return Math.sin(left as number);
		}
		if (tree.token.value === 'cos') {
			if (Array.isArray(left)) {
				throw new TypeError(`${logPrefix} Cannot pass an array to cos()`);
			}
			if (mathType === 'reanimated') {
				return Animated.cos(left);
			}
			return Math.cos(left as number);
		}
		if (tree.token.value === 'tan') {
			if (Array.isArray(left)) {
				throw new TypeError(`${logPrefix} Cannot pass an array to tan()`);
			}
			if (mathType === 'reanimated') {
				return Animated.tan(left);
			}
			return Math.tan(left as number);
		}
		if (tree.token.value === 'cot') {
			if (Array.isArray(left)) {
				throw new TypeError(`${logPrefix} Cannot pass an array to cot()`);
			}
			if (mathType === 'reanimated') {
				return Animated.divide(1, Animated.tan(left));
			}
			return 1 / Math.tan(left as number);
		}
		if (tree.token.value === 'sqrt') {
			if (Array.isArray(left)) {
				throw new TypeError(`${logPrefix} Cannot pass an array to sqrt()`);
			}
			if (mathType === 'reanimated') {
				return Animated.sqrt(left);
			}
			return Math.sqrt(left as number);
		}

		if (tree.token.value === 'min') {
			if (!Array.isArray(left) || left.length < 2) {
				throw new TypeError(`${logPrefix} Must pass multiple values to min()`);
			}
			if (mathType === 'reanimated') {
				// @ts-ignore
				return Animated.min(...left);
			}
			return Math.min(...(left as number[]));
		}
		if (tree.token.value === 'max') {
			if (!Array.isArray(left) || left.length < 2) {
				throw new TypeError(`${logPrefix} Must pass multiple values to max()`);
			}
			if (mathType === 'reanimated') {
				// @ts-ignore
				return Animated.max(...left);
			}
			return Math.max(...(left as number[]));
		}
	}
	const right = reduceAst(tree.right as ASTNode, variables, mathType);
	if (tree.token.value === '+') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new TypeError(`${logPrefix} Cannot use operator "+" on array`);
		}
		if (mathType === 'reanimated') {
			return Animated.add(left, right);
		}
		return (left as number) + (right as number);
	}
	if (tree.token.value === '-') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new TypeError(`${logPrefix} Cannot use operator "-" on array`);
		}
		return (left as number) - (right as number);
	}
	if (tree.token.value === '/') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new TypeError(`${logPrefix} Cannot use operator "/" on array`);
		}
		return (left as number) / (right as number);
	}
	if (tree.token.value === '*') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new TypeError(`${logPrefix} Cannot use operator "*" on array`);
		}
		return (left as number) * (right as number);
	}
	if (tree.token.value === ',') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new TypeError(`${logPrefix} Cannot use operator "," on array`);
		}
		return [left, right];
	}
	throw new Error('Could not parse!');
};

export default reduceAst;
