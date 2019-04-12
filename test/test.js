import test from 'ava';
import build from '../src/simple-math-ast';
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
	t.is(added.__value, 2);
});

test('Should reject string placeholders', t => {
	const a = {a: 'invalid'};
	t.throws(() => formula`${a} + 1`, /was passed as a value/);
	const b = '2';
	t.throws(() => formula`${b} + 1`, /was passed as a value/);
});

test('Mixed Animated.Value and raw numbers', t => {
	const a = 1;
	const b = new Animated.Value(2);
	t.is(formula`${a}+${2}`.__value, 3);
});

test('Invalid math should throw', t => {
	const a = 1;
	t.throws(() => formula`1++2`, /Expression 1\+\+2 could not be parsed/);
	t.throws(() => formula`1+`, /Expression 1\+ could not be parsed/);
	t.throws(
		() => formula`${a}++2`,
		/Expression <variable>\+\+2 could not be parsed/
	);
});

test('Should do sin() function', t => {
	const a = 0.5;
	t.is(formula`sin(${a})`.__value, Math.sin(0.5));
	t.throws(() => formula`sin(a++1)`);
});

test('Should do geometric functions', t => {
	const a = 0.5;
	t.is(
		formula`cos(${a}) + sin(${a}) + tan(${a})`.__value,
		Math.cos(a) + Math.sin(a) + Math.tan(a)
	);
	t.is(formula`cot(${a})`.__value, 1 / Math.tan(a));
});

test('Should do square root', t => {
	const a = 4;
	t.is(formula`sqrt(4)`.__value, 2);
});

test('Should throw on unsupported function', t => {
	t.throws(() => formula`randomfunction()`);
	t.throws(() => formula`randomfunction(2)`);
	t.throws(() => formula`randomfunction(2, 2)`);
});

test('Should throw on unrecognized variable', t => {
	const a = 2;
	t.throws(() => formula`${a} + x`);
});

test('Should throw when passing in an array unfittingly', t => {
	t.throws(() => formula`${[2, 2]} + 2`);
	t.throws(() => formula`sin(${[2, 2]})`);
	t.throws(() => formula`cos(${[2, 2]})`);
	t.throws(() => formula`tan(${[2, 2]})`);
	t.throws(() => formula`(${[2, 2]} - 2)`);
	t.throws(() => formula`(${[2, 2]} / 2)`);
	t.throws(() => formula`(${[2, 2]} * 2)`);
});

test('Should support min()', t => {
	t.is(formula`min(${[2, 5]})`.__value, 2);
	t.is(formula`min(${[2, 5, 0, 1]})`.__value, 0);
	t.is(formula`min(2, 5)`.__value, 2);
	t.is(formula`min(${2}, 5)`.__value, 2);
});

test('Should support max()', t => {
	t.is(formula`max(${[2, 5]})`.__value, 5);
	t.is(formula`max(${[2, 8, 0, 1]})`.__value, 8);
	t.is(formula`max(2, 7)`.__value, 7);
	t.is(formula`max(${2}, 5)`.__value, 5);
});

test('Should support single number', t => {
	t.is(formula`2`, 2);
});

test('Should support PI and other constants', t => {
	t.is(formula`pi + 2`.__value, Math.PI + 2);
});

test('Weird stuff', t => {
	t.throws(() => formula`@`, /Expression @ could not be parsed/);
});

test('Should handle function with no arguments', t => {
	t.throws(() => formula`sin()`);
	t.throws(() => formula`cos()`);
	t.throws(() => formula`tan()`);
	t.throws(() => formula`min()`);
	t.throws(() => formula`max(0)`);
	t.throws(() => formula`max(1)`);
	t.is(formula`max(2,1)`.__value, 2);
});

test('Weird spacing', t => {
	t.is(formula`2                     +                     1`.__value, 3);
});

test('Should support **', t => {
	t.is(formula`2 ** 2`.__value, 4);
	t.is(formula`2 ** 2 ** 2`.__value, 16);
	t.is(formula`pow(2, 2)`.__value, 4);
	t.is(formula`pow(2, 2, ${new Animated.Value(2)})`.__value, 16);
	t.is(formula`pow(${[2, 2, new Animated.Value(2)]})`.__value, 16);
});

test('Should support and / or', t => {
	t.is(formula`1 && 0`.__value, 0);
	t.is(formula`1 || 0`.__value, 1);
	t.is(formula`0 || 0 || 22`.__value, 22);
});

test('Should support % operator', t => {
	const a = new Animated.Value(5);
	t.is(formula`5 % 2`.__value, 1);
	t.is(formula`${a} % ${a}`.__value, 0);
});

test('Should support exp() function', t => {
	const a = new Animated.Value(2);
	t.is(formula`exp(${a})`.__value, Math.exp(2));
	t.throws(() => formula`exp(${[2]})`);
});

test('Should support acos, asin and atan', t => {
	const a = 0.33;
	t.is(formula`asin(${new Animated.Value(a)})`.__value, Math.asin(a));
	t.is(formula`acos(${new Animated.Value(a)})`.__value, Math.acos(a));
	t.is(formula`atan(${new Animated.Value(a)})`.__value, Math.atan(a));
	t.is(
		formula`atan(${new Animated.Value(a)}) + acos(${new Animated.Value(
			a
		)}) + asin(${new Animated.Value(a)})`.__value,
		Math.atan(a) + Math.acos(a) + Math.asin(a)
	);
	t.throws(() => formula`atan(${[a]})`);
	t.throws(() => formula`acos(${[a]})`);
	t.throws(() => formula`asin(${[a]})`);
});

test('Should support round, ceil and floor', t => {
	const a = 0.33;
	t.is(formula`ceil(${new Animated.Value(a)})`.__value, Math.ceil(a));
	t.is(formula`round(${new Animated.Value(a)})`.__value, Math.round(a));
	t.is(formula`floor(${new Animated.Value(a)})`.__value, Math.floor(a));
	t.is(
		formula`floor(${new Animated.Value(a)}) + round(${new Animated.Value(
			a
		)}) + ceil(${new Animated.Value(a)})`.__value,
		Math.floor(a) + Math.round(a) + Math.ceil(a)
	);
	t.throws(() => formula`floor(${[a]})`);
	t.throws(() => formula`round(${[a]})`);
	t.throws(() => formula`ceil(${[a]})`);
});

test('Should support comparison operators', t => {
	t.is(formula`1 < 2`.__value, 1);
	t.is(formula`1 <= 1`.__value, 1);
	t.is(formula`1 === 1`.__value, 1);
	t.is(formula`1 === 0`.__value, 0);
	t.is(formula`1 !== 0`.__value, 1);
	t.is(formula`1 >= 1`.__value, 1);
	t.is(formula`1 >= ${new Animated.Value(0)}`.__value, 1);
	t.throws(() => formula`1 == 1`);
});

test('Should support ! operator', t => {
	t.is(formula`!1`.__value, 0);
	t.is(formula`!0`.__value, 1);
	t.is(formula`!0 === 1`.__value, 1);
	t.is(formula`!(0 === 0)`.__value, 0);
	t.is(formula`!0 === !0`.__value, 1);
});

test('Should support abs', t => {
	t.is(formula`abs(1 - ${new Animated.Value(2)})`.__value, 1);
});

test('Should support diff', t => {
	t.is(formula`diff(1 - ${new Animated.Value(2)})`, `diff_mock-1`);
});

test('Should support acc', t => {
	t.is(formula`acc(1 - ${new Animated.Value(2)})`, `acc_mock-1`);
});

test('Should support defined', t => {
	t.is(formula`defined(1 - ${new Animated.Value(2)})`, `defined_mock-1`);
});

test('Should support ternary', t => {
	t.is(formula`1 ? 5 : 2`.__value, 5);
	t.is(formula`0 ? 5 : 2`.__value, 2);
	t.is(formula`0 ? 5 : 0 ? 2 : 0`.__value, 0);
	t.is(formula`0 ? 5 : 0 ? 2 : 1`.__value, 1);
	t.throws(() => formula`5 : 2`);
	t.throws(() => formula`5 ? 2`);
});

test.todo('Should support color');
test.todo('Should support concat');
