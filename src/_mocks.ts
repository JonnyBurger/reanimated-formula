import mockery from 'mockery';
import AnimatedValue from './_AnimatedValue';

mockery.enable({
	warnOnUnregistered: false
});

type Value = number | AnimatedValue;

const getValue = (node: Value) => {
	if (typeof node === 'number') {
		return node;
	}
	return node.__value;
};

mockery.registerMock('react-native-reanimated', {
	Value: AnimatedValue,
	Node: AnimatedValue,
	add: (a: Value, b: Value) => new AnimatedValue(getValue(a) + getValue(b)),
	sub: (a: Value, b: Value) => new AnimatedValue(getValue(a) - getValue(b)),
	divide: (a: Value, b: Value) => new AnimatedValue(getValue(a) / getValue(b)),
	multiply: (a: Value, b: Value) =>
		new AnimatedValue(getValue(a) * getValue(b)),
	sin: (a: Value) => new AnimatedValue(Math.sin(getValue(a))),
	tan: (a: Value) => new AnimatedValue(Math.tan(getValue(a))),
	cos: (a: Value) => new AnimatedValue(Math.cos(getValue(a)))
});
