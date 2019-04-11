import test from 'ava';
import build from 'simple-math-ast';
import {nativeFormula} from '../dist';
import reduceAst from '../dist/reduce-ast';

test('Simple arithmetic addition', t => {
	const value = reduceAst(build('2 + 2'), {});
	t.is(value, 4);
});

test('Addition using variables', t => {
	const y = 3;
	t.is(nativeFormula`2 + ${y}`, 5);
});

test('Subtraction using variables', t => {
	const y = 10;
	t.is(nativeFormula`0-${y}`, -10);
});

test('Should do Multiplication before addition', t => {
	const x = 5;
	const y = 2;
	const z = 10;
	t.is(nativeFormula`${x} + ${y} * ${z}`, 25);
	t.is(nativeFormula`${x} + (${y} * ${z})`, 25);
	t.is(nativeFormula`(${x} + ${y}) * ${z}`, 70);
});
