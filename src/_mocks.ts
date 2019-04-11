import mockery from 'mockery';
import AnimatedValue from './_AnimatedValue';

mockery.enable({
	warnOnUnregistered: false
});

type ValueArray = (number | AnimatedValue)[];
type SingleValue = number | AnimatedValue;
type Value = SingleValue | ValueArray;

const getValue = (node: number | AnimatedValue) => {
	if (typeof node === 'number') {
		return node;
	}
	return node.__value;
};

mockery.registerMock('react-native-reanimated', {
	Value: AnimatedValue,
	Node: AnimatedValue,
	add: (a: SingleValue, b: SingleValue) =>
		new AnimatedValue(getValue(a) + getValue(b)),
	sub: (a: SingleValue, b: SingleValue) =>
		new AnimatedValue(getValue(a) - getValue(b)),
	divide: (a: SingleValue, b: SingleValue) =>
		new AnimatedValue(getValue(a) / getValue(b)),
	multiply: (a: SingleValue, b: SingleValue) =>
		new AnimatedValue(getValue(a) * getValue(b)),
	sin: (a: SingleValue) => new AnimatedValue(Math.sin(getValue(a))),
	tan: (a: SingleValue) => new AnimatedValue(Math.tan(getValue(a))),
	cos: (a: SingleValue) => new AnimatedValue(Math.cos(getValue(a))),
	sqrt: (a: SingleValue) => new AnimatedValue(Math.sqrt(getValue(a))),
	min: (...a: ValueArray) =>
		new AnimatedValue(Math.min(...a.map(b => getValue(b)))),
	max: (...a: ValueArray) =>
		new AnimatedValue(Math.max(...a.map(b => getValue(b)))),
	pow: (...a: ValueArray) =>
		new AnimatedValue(a.reduce(
			(b, c, index) => (index > 0 ? Math.pow(getValue(b), getValue(c)) : c),
			0
		) as number),
	and: (a: SingleValue, b: SingleValue) =>
		new AnimatedValue(getValue(a) && getValue(b)),
	or: (a: SingleValue, b: SingleValue) =>
		new AnimatedValue(getValue(a) || getValue(b))
});
