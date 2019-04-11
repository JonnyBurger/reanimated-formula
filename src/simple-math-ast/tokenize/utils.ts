import {filter, identity} from 'ramda';

// @ts-ignore
export const zipConcat = (source1, source2) => {
	const output = [];

	for (let i = 0; i < Math.max(source1.length, source2.length); i += 1) {
		if (i < source1.length) {
			output.push(source1[i]);
		}

		if (i < source2.length) {
			output.push(source2[i]);
		}
	}

	return output;
};

// @ts-ignore
export const compact = filter(identity);
// @ts-ignore
export const wrap = value => [value];
