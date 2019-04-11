import {pipe, prop, append, map} from 'ramda';

import {UNKNOWN_RULE} from './unknown';
import {RuleWrapper} from '../config';

const transformKeyToRegExp = ({key, ...rest}: RuleWrapper) => ({
	key: new RegExp(key, 'g'),
	...rest
});

export const rules = pipe(
	prop('rules'),
	// @ts-ignore
	append(UNKNOWN_RULE),
	map(transformKeyToRegExp)
);
