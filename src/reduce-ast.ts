import {AstNode} from './types';

export type Variables = {
	[key: string]: any;
};

const reduceAst = (tree: AstNode, variables: Variables): number => {
	if (tree.token.type === 'NUMBER') {
		return Number(tree.token.value);
	}
	if (tree.token.type === 'VARIABLE') {
		if (!variables[tree.token.value]) {
			throw new Error(`Could not find variable ${tree.token.value}`);
		}
		return variables[tree.token.value];
	}
	const left = reduceAst(tree.left as AstNode, variables);
	const right = reduceAst(tree.right as AstNode, variables);
	if (tree.token.type === 'NAMED_FUNCTION') {
		if (tree.token.value === 'log') {
			Math.log(left);
		}
		if (tree.token.value === 'sin') {
			Math.sin(left);
		}
		if (tree.token.value === 'cos') {
			Math.cos(left);
		}
		if (tree.token.value === 'tg') {
			Math.tan(left);
		}
		if (tree.token.value === 'ctg') {
			return 1 / Math.tan(left);
		}
		if (tree.token.value === 'sqrt') {
			return Math.sqrt(left);
		}
	}
	if (tree.token.value === '+') {
		return left + right;
	}
	if (tree.token.value === '-') {
		return left - right;
	}
	if (tree.token.value === '/') {
		return left / right;
	}
	if (tree.token.value === '*') {
		return left * right;
	}
	throw new Error('Could not parse!');
};

export default reduceAst;
