# reanimated-formula

<p align="center">
    <img src="https://github.com/JonnyBurger/reanimated-formula/raw/master/reanimated.gif"/>
</p>

[React Native Reanimated](https://github.com/kmagiera/react-native-reanimated) gives us a new level of control over React Native Animations and allows us to run complex animations with 60fps.

With that new power, we write so complex expressions that it can become hard to read. In Reanimated, all math expressions are functions, which leads us to write the operator before the values instead of the natural inbetween. For example, we write `multiply(2, 2)` instead of `2 * 2`. If you nest the expressions, your statement might end with `)))))`. The more you nest, the harder it gets to read.

`reanimated-formula` allows you to write expressions in a more familiar and natural way.

## Installation

```sh
npm install reanimated-formula
```

## Example Usage

```jsx
import Animated from 'react-native-reanimated'
import formula from 'reanimated-formula'

const active = new Animated.Value(0)
const offsetY = new Animated.Value(0)
const swipeProgress = new Animated.Value(0)

const Animation = () => (
    <Animated.View
        style={{
            // Using Reanimated functions
            translateY: Animated.cond(
                active,
                Animated.min(
                    Animated.add(
                        15,
                        Animated.multiply(offsetY, swipeProgress)
                    ),
                    0
                ),
                0
            ),
            // Using reanimated-formula
            translateY: formula`${active} ? min(15 + ${offsetY} * ${swipeProgress}, 0) : 0`
        }}
    >
    </Animated.View>
)
```

## Implemented functions

| Reanimated <br> <sup>Functions from Reanimated.*</sup>                 | reanimated-formula <br/><sup>Use inside <code>formula``</Code></sup>                                              
|----------------------------|----------------------------------------------------------------------|
| `add(a, b)        ` | `${a} + ${b}                                         `
| `sub(a, b)        ` | `${a} - ${b}                                         `  
| `multiply(a, b)   ` | `${a} * ${b}                                         `  
| `divide(a, b)     ` | `${a} / ${b}                                       `
| `sin(a)           ` | `sin(${a})                                        `
| `cos(a)           ` | `cos(${a})                                          `
| `tan(a)           ` | `tan(${a})                                     `
| `sqrt(a)          ` | `sqrt(${a})                         `
| `min(a, b, c)     ` | `min(${a}, ${b}, ${c})`<br>or<br/> `min(${[a, b, c]})`
| `max(a, b, c)     ` | `max(${a}, ${b}, ${c})`<br/>or<br/> `max(${[a, b, c]})`
| `pow(a, b, c)     ` | `${a} ** ${b} ** ${c}`<br/>or<br> `pow(${[a, b, c]})`
| `and(a, b)        ` | `${a} && ${b}`
| `or(a, b)         ` | `${a} \|\| ${b}`
| `modulo(a, b)     ` | `${a} % ${b}`
| `exp(a)           ` | `exp(${a})`
| `asin(a)          ` | `asin(${a})`
| `atan(a)          ` | `atan(${a})`
| `acos(a)          ` | `acos(${a})`
| `round(a)         ` | `round(${a})`
| `floor(a)         ` | `floor(${a})`
| `ceil(a)          ` | `ceil(${a})`
| `abs(a)           ` | `abs(${a})`
| `eq(a, b)         ` | `${a} === ${b}`
| `neq(a, b)        ` | `${a} !== ${b}`
| `greaterThan(a, b)` | `${a} > ${b}`
| `lessThan(a, b)   ` | `${a} < ${b}`
| `greaterOrEq(a, b)` | `${a} >= ${b}`
| `lessOrEq(a, b)   ` | `${a} <= ${b}`
| `not(a)           ` | `!${a}`
| `diff(a)          ` | `diff(${a})`
| `acc(a)           ` | `acc(${a})`
| `defined(a)       ` | `defined(${a})`
| `cond(a, b)       ` | `${a} ? ${b} : 0`
| `cond(a, b, c)    ` | `${a} ? ${b} : ${c}`
| `concat(a, 'deg') ` | `deg(${a})`
| `set(a, b)        ` | `set(${a}, ${b})`

## Development

Standard project that can be cloned and set up using `npm install`.  
Unit tests can be run using `npm test`.

## Credits
- Jonny Burger
- Includes a modified version of [simple-math-ast](https://github.com/Flyr1Q/simple-math-ast)

## License
MIT

## See also

- [reanimated-math.macro](https://github.com/futuun/reanimated-math.macro)

This is a library with a very similar purpose that I only found after I have written this module.<br>It uses a Babel macro to compile the math expressions into standard Reanimated code, which should make it more performant.
On the other hand, it doesn't support operators like `&&`, `||`, `?`, `:`, `>=`, so I think both libraries have merit.

--- 

<p align="center">
    <a href="https://twitter.com/JNYBGR">
        <img src="https://github.com/JonnyBurger/reanimated-formula/raw/master/credit.png" height="28"/>
    </a>
</p>
