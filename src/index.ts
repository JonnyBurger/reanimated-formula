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
	const ast = build(intersect.join(''));
	return [ast, variables];
};

const validateArgs = (placeholders: Placeholder[]) => {
	for (let placeholder of placeholders) {
		if (
			![
				(p: unknown) => p instanceof Animated.Node,
				(p: unknown) => typeof p === 'number',
				(p: unknown) => p instanceof Animated.Value
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
	validateArgs(placeholders);
	const [ast, variables] = makeAst(args, ...placeholders);
	return reduceAst(ast, variables, 'native');
};

const reanimatedFormula = (
	args: TemplateStringsArray,
	...placeholders: Placeholder[]
) => {
	validateArgs(placeholders);
	try {
		const [ast, variables] = makeAst(args, ...placeholders);
		return reduceAst(ast, variables, 'reanimated');
	} catch (err) {
		if (err.name === 'InvalidExpressionError') {
			throw new InvalidExpressionError(
				`[${packageJson.name}]: Expression ${args.join(
					'<variable>'
				)} could not be parsed`
			);
		} else {
			throw err;
		}
	}
};

export default reanimatedFormula;
