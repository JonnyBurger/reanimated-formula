import reduceAst, {Variables} from './reduce-ast';
import build from 'simple-math-ast';
import Animated from 'react-native-reanimated';

const formula = (
	args: TemplateStringsArray,
	...placeholder: (number | Animated.Value<number | string | boolean>)[]
) => {
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
	console.log(ast);
	return reduceAst(ast, variables);
};

const value = new Animated.Value(1);
const value2 = new Animated.Value(2);

console.log(formula`${value} + ${value2}`);
