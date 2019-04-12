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
				throw new InvalidExpressionError(
					`${logPrefix} log() is not supported by Reanimated`
				);
			}
			return Math.log(left as number);
		}
		if (tree.token.value === 'sin') {
			if (Array.isArray(left)) {
				throw new InvalidExpressionError(
					`${logPrefix} Cannot pass an array to sin()`
				);
			}
			if (mathType === 'reanimated') {
				return Animated.sin(left);
			}
			return Math.sin(left as number);
		}
		if (tree.token.value === 'exp') {
			if (Array.isArray(left)) {
				throw new InvalidExpressionError(
					`${logPrefix} Cannot pass an array to exp()`
				);
			}
			if (mathType === 'reanimated') {
				return Animated.exp(left);
			}
			return Math.exp(left as number);
		}
		if (tree.token.value === 'cos') {
			if (Array.isArray(left)) {
				throw new InvalidExpressionError(
					`${logPrefix} Cannot pass an array to cos()`
				);
			}
			if (mathType === 'reanimated') {
				return Animated.cos(left);
			}
			return Math.cos(left as number);
		}
		if (tree.token.value === 'tan') {
			if (Array.isArray(left)) {
				throw new InvalidExpressionError(
					`${logPrefix} Cannot pass an array to tan()`
				);
			}
			if (mathType === 'reanimated') {
				return Animated.tan(left);
			}
			return Math.tan(left as number);
		}
		if (tree.token.value === 'asin') {
			if (Array.isArray(left)) {
				throw new InvalidExpressionError(
					`${logPrefix} Cannot pass an array to asin()`
				);
			}
			if (mathType === 'reanimated') {
				return Animated.asin(left);
			}
			return Math.asin(left as number);
		}
		if (tree.token.value === 'atan') {
			if (Array.isArray(left)) {
				throw new InvalidExpressionError(
					`${logPrefix} Cannot pass an array to atan()`
				);
			}
			if (mathType === 'reanimated') {
				return Animated.atan(left);
			}
			return Math.atan(left as number);
		}
		if (tree.token.value === 'acos') {
			if (Array.isArray(left)) {
				throw new InvalidExpressionError(
					`${logPrefix} Cannot pass an array to acos()`
				);
			}
			if (mathType === 'reanimated') {
				return Animated.acos(left);
			}
			return Math.acos(left as number);
		}
		if (tree.token.value === 'round') {
			if (Array.isArray(left)) {
				throw new InvalidExpressionError(
					`${logPrefix} Cannot pass an array to round()`
				);
			}
			if (mathType === 'reanimated') {
				return Animated.round(left);
			}
			return Math.round(left as number);
		}
		if (tree.token.value === 'ceil') {
			if (Array.isArray(left)) {
				throw new InvalidExpressionError(
					`${logPrefix} Cannot pass an array to ceil()`
				);
			}
			if (mathType === 'reanimated') {
				return Animated.ceil(left);
			}
			return Math.ceil(left as number);
		}
		if (tree.token.value === 'floor') {
			if (Array.isArray(left)) {
				throw new InvalidExpressionError(
					`${logPrefix} Cannot pass an array to floor()`
				);
			}
			if (mathType === 'reanimated') {
				return Animated.floor(left);
			}
			return Math.floor(left as number);
		}
		if (tree.token.value === 'cot') {
			if (Array.isArray(left)) {
				throw new InvalidExpressionError(
					`${logPrefix} Cannot pass an array to cot()`
				);
			}
			if (mathType === 'reanimated') {
				return Animated.divide(1, Animated.tan(left));
			}
			return 1 / Math.tan(left as number);
		}
		if (tree.token.value === 'sqrt') {
			if (Array.isArray(left)) {
				throw new InvalidExpressionError(
					`${logPrefix} Cannot pass an array to sqrt()`
				);
			}
			if (mathType === 'reanimated') {
				return Animated.sqrt(left);
			}
			return Math.sqrt(left as number);
		}

		if (tree.token.value === 'min') {
			if (!Array.isArray(left) || left.length < 2) {
				throw new InvalidExpressionError(
					`${logPrefix} Must pass multiple values to min()`
				);
			}
			if (mathType === 'reanimated') {
				// @ts-ignore
				return Animated.min(...left);
			}
			return Math.min(...(left as number[]));
		}
		if (tree.token.value === 'max') {
			if (!Array.isArray(left) || left.length < 2) {
				throw new InvalidExpressionError(
					`${logPrefix} Must pass multiple values to max()`
				);
			}
			if (mathType === 'reanimated') {
				// @ts-ignore
				return Animated.max(...left);
			}
			return Math.max(...(left as number[]));
		}
		if (tree.token.value === 'pow') {
			if (!Array.isArray(left) || left.length < 2) {
				throw new InvalidExpressionError(
					`${logPrefix} Must pass multiple values to pow()`
				);
			}
			if (mathType === 'reanimated') {
				// @ts-ignore
				return Animated.pow(...left);
			}
			return left.reduce(
				(b, c, index) => (index > 0 ? Math.pow(b as number, c as number) : c),
				0
			) as number;
		}
	}
	const right = reduceAst(tree.right as ASTNode, variables, mathType);
	if (tree.token.value === '+') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator "+" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.add(left, right);
		}
		return (left as number) + (right as number);
	}
	if (tree.token.value === '-') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator "-" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.sub(left, right);
		}

		return (left as number) - (right as number);
	}
	if (tree.token.value === '/') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator "/" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.divide(left, right);
		}

		return (left as number) / (right as number);
	}
	if (tree.token.value === '**') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator "**" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.pow(left, right);
		}

		return (left as number) ** (right as number);
	}
	if (tree.token.value === '*') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator "*" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.multiply(left, right);
		}

		return (left as number) * (right as number);
	}
	if (tree.token.value === '%') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator "%" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.modulo(left, right);
		}

		return (left as number) % (right as number);
	}
	if (tree.token.value === '||') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator "||" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.or(left, right);
		}

		return (left as number) || (right as number);
	}
	if (tree.token.value === '&&') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator "&&" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.and(left, right);
		}

		return (left as number) && (right as number);
	}
	if (tree.token.value === '<') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator "<" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.lessThan(left, right);
		}

		return Number((left as number) < (right as number));
	}
	if (tree.token.value === '>') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator ">" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.greaterThan(left, right);
		}

		return Number((left as number) > (right as number));
	}
	if (tree.token.value === '>=') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator ">=" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.greaterOrEq(left, right);
		}

		return Number((left as number) >= (right as number));
	}
	if (tree.token.value === '<=') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator "<=" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.lessOrEq(left, right);
		}

		return Number((left as number) <= (right as number));
	}
	if (tree.token.value === '===') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator "===" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.eq(left, right);
		}

		return Number((left as number) === (right as number));
	}
	if (tree.token.value === '!==') {
		if (Array.isArray(left) || Array.isArray(right)) {
			throw new InvalidExpressionError(
				`${logPrefix} Cannot use operator "!==" on array`
			);
		}
		if (mathType === 'reanimated') {
			return Animated.neq(left, right);
		}

		return Number((left as number) !== (right as number));
	}
	if (tree.token.value === ',') {
		return [
			...(Array.isArray(left) ? left : [left]),
			...(Array.isArray(right) ? right : [right])
		];
	}
	throw new Error(`Could not parse! Operator: ${tree.token.value}`);
};

export default reduceAst;
