import {AstNode} from './types';
import Animated from 'react-native-reanimated';
import {InvalidExpressionError} from './InvalidExpressionError';
const packageJson = require('../package.json');

export type Variables = {
	[key: string]: any;
};

export type MathType = 'reanimated' | 'native';

const reduceAst = (
	tree: AstNode,
	variables: Variables,
	mathType: MathType
): number | Animated.Node<number> => {
	if (!tree) {
		throw new InvalidExpressionError('Could not parse');
	}
	if (tree.token.type === 'NUMBER') {
		return Number(tree.token.value);
	}
	if (tree.token.type === 'VARIABLE') {
		if (!variables[tree.token.value]) {
			throw new Error(`Could not find variable ${tree.token.value}`);
		}
		return variables[tree.token.value];
	}
	const left = reduceAst(tree.left as AstNode, variables, mathType);
	if (tree.token.type === 'NAMED_FUNCTION') {
		if (tree.token.value === 'log') {
			if (mathType === 'reanimated') {
				throw new TypeError('log() is not supported by Reanimated');
			}
			return Math.log(left as number);
		}
		if (tree.token.value === 'sin') {
			if (mathType === 'reanimated') {
				return Animated.sin(left);
			}
			return Math.sin(left as number);
		}
		if (tree.token.value === 'cos') {
			if (mathType === 'reanimated') {
				return Animated.cos(left);
			}
			return Math.cos(left as number);
		}
		if (tree.token.value === 'tg') {
			if (mathType === 'reanimated') {
				return Animated.tan(left);
			}
			return Math.tan(left as number);
		}
		if (tree.token.value === 'ctg') {
			if (mathType === 'reanimated') {
				return Animated.divide(1, Animated.tan(left));
			}
			return 1 / Math.tan(left as number);
		}
		if (tree.token.value === 'sqrt') {
			if (mathType === 'reanimated') {
				return Animated.sqrt(left);
			}
			return Math.sqrt(left as number);
		}
	}
	const right = reduceAst(tree.right as AstNode, variables, mathType);
	if (tree.token.value === '+') {
		if (mathType === 'reanimated') {
			return Animated.add(left, right);
		}
		return (left as number) + (right as number);
	}
	if (tree.token.value === '-') {
		return (left as number) - (right as number);
	}
	if (tree.token.value === '/') {
		return (left as number) / (right as number);
	}
	if (tree.token.value === '*') {
		return (left as number) * (right as number);
	}
	throw new Error('Could not parse!');
};

export default reduceAst;
