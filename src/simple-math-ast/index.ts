import tokenize from './tokenize';
import parse from './parse';
import {Variables} from 'src/reduce-ast';

const build = (expression: string, variables: Variables) => {
	return parse(tokenize(expression), variables);
};

export {tokenize, parse};
export default build;
