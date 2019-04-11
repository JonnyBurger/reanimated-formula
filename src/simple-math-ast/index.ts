import tokenize from './tokenize';
import parse from './parse';

const build = (expression: string) => {
	return parse(tokenize(expression));
};

export {tokenize, parse};
export default build;
