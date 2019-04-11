import test from 'ava';
import build from 'simple-math-ast';
import formula, {nativeFormula} from '../dist';
import reduceAst from '../dist/reduce-ast';
import Animated from 'react-native-reanimated';

test('Simple arithmetic addition', t => {
	const value = reduceAst(build('2 + 2'), {}, 'native');
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

test('Animated.Value addition', t => {
	const a = new Animated.Value(1);
	const b = new Animated.Value(1);
	const added = formula`${a} + ${b}`;
	// @ts-ignore
	t.is(added.__value, 2);
});

test('Should reject string placeholders', t => {
	const a = {a: 'invalid'};
	t.throws(() => formula`${a} + 1`, /was passed as a value/);
});

test('Mixed Animated.Value and raw numbers', t => {
	const a = 1;
	const b = new Animated.Value(2);
	t.is(formula`${a}+${2}`.__value, 3);
});

test('Invalid math should throw', t => {
	t.throws(() => formula`1++2`);
});
