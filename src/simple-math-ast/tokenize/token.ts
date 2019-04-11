import {curry, isNil} from 'ramda';
import {Token} from '../config';

export const buildToken = curry((data, value) => ({
	value,
	...data
}));

export const isToken = ({type, value}: Token) => !isNil(type) && !isNil(value);
