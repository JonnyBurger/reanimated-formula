import {
	curry,
	map,
	pipe,
	split,
	match,
	reduce,
	flatten,
	reject,
	__
} from 'ramda';

import config, {RuleWrapper} from '../config';

import {rules} from './rules';
import {buildToken, isToken} from './token';
import {isUnknown} from './unknown';
import {zipConcat, compact, wrap} from './utils';

const applyRuleOnTarget = curry(({data, key}: RuleWrapper, target) => {
	if (isToken(target)) {
		return target;
	}

	return zipConcat(
		split(key, target),
		// @ts-ignore
		map(buildToken(data), match(key, target))
	);
});

// @ts-ignore
const applyRuleOnTargets = (targets, rule) =>
	pipe(
		// @ts-ignore
		map(applyRuleOnTarget(rule)),
		flatten,
		compact
		// @ts-ignore
	)(targets);

const tokenize = pipe(
	wrap,
	// @ts-ignore
	reduce(applyRuleOnTargets, __, rules(config)),
	reject(isUnknown)
);

export default tokenize;
