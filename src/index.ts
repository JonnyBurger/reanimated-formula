import reduceAst, {Variables} from './reduce-ast';
import build from './simple-math-ast';
import Animated from 'react-native-reanimated';
import {InvalidExpressionError} from './InvalidExpressionError';
import ASTNode from './simple-math-ast/parse/node';

const packageJson = require('../package.json');

type Placeholder = number | Animated.Value<number | string | boolean>;

const makeAst = (
	args: TemplateStringsArray,
	...placeholder: Placeholder[]
): [ASTNode, Variables] => {
	let variableMap = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if (args.length > variableMap.length) {
		throw new TypeError(
			`Not more than ${
				variableMap.length
			} variables are supported per expression.`
		);
	}
	let intersect: string[] = [];
	let variables: Variables = {};
	for (let i = 0; i < args.length; i++) {
		intersect.push(args[i]);
		if (i !== args.length - 1) {
			const variable = variableMap[i];
			intersect.push(variable);
			variables[variable] = placeholder[i];
		}
		intersect = intersect.filter(Boolean);
	}
	const ast = build(intersect.join(''), variables);
	return [ast, variables];
};

const validateArgs = (placeholders: Placeholder[]) => {
	const check = [
		(p: unknown) => p instanceof Animated.Node,
		(p: unknown) => typeof p === 'number',
		(p: unknown) => p instanceof Animated.Value
	];
	for (let placeholder of placeholders) {
		if (
			![
				...check,
				(p: unknown) =>
					Array.isArray(p) && p.every(_p => check.some(f => f(_p)))
			].some(f => f(placeholder))
		) {
			throw new TypeError(
				`[${packageJson.name}]: ${JSON.stringify(
					placeholder
				)} was passed as a value but only numbers and Animated.Value's are accepted.`
			);
		}
	}
};

export const nativeFormula = (
	args: TemplateStringsArray,
	...placeholders: number[]
) => {
	const argArray = args || [];

	validateArgs(placeholders);
	const [ast, variables] = makeAst(argArray, ...placeholders);
	return reduceAst(ast, variables, 'native');
};

const reanimatedFormula = (
	args: TemplateStringsArray,
	...placeholders: Placeholder[]
) => {
	const argArray = args || [];
	validateArgs(placeholders);
	try {
		const [ast, variables] = makeAst(argArray, ...placeholders);
		return reduceAst(ast, variables, 'reanimated');
	} catch (err) {
		if (err.name === 'InvalidExpressionError') {
			throw new InvalidExpressionError(
				`[${packageJson.name}]: Expression ${
					argArray.length > 0
						? argArray.join('<variable>')
						: placeholders.join(',')
				} could not be parsed`
			);
		} else {
			throw err;
		}
	}
};

export default reanimatedFormula;
