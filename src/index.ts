import reduceAst, {Variables} from './reduce-ast';
import build from 'simple-math-ast';
import Animated from 'react-native-reanimated';
import {AstNode} from './types';

const makeAst = (
	args: TemplateStringsArray,
	...placeholder: (number | Animated.Value<number | string | boolean>)[]
): [AstNode, Variables] => {
	let variableMap = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if (args.length > variableMap.length) {
		throw new Error(
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

export const nativeFormula = (
	args: TemplateStringsArray,
	...placeholder: number[]
) => {
	const [ast, variables] = makeAst(args, ...placeholder);
	return reduceAst(ast, variables, 'native');
};

const reanimatedFormula = (
	args: TemplateStringsArray,
	...placeholder: (number | Animated.Value<number | string | boolean>)[]
) => {
	const [ast, variables] = makeAst(args, ...placeholder);
	return reduceAst(ast, variables, 'reanimated');
};

export default reanimatedFormula;
