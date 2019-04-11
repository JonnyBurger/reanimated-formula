import mockery from 'mockery';
import AnimatedValue from './_AnimatedValue';

mockery.enable({
	warnOnUnregistered: false
});

mockery.registerMock('react-native-reanimated', {
	Value: AnimatedValue,
	add: (a: AnimatedValue, b: AnimatedValue) =>
		new AnimatedValue(a.__value + b.__value)
});
