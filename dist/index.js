"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var reduce_ast_1 = __importDefault(require("./reduce-ast"));
var simple_math_ast_1 = __importDefault(require("simple-math-ast"));
var react_native_reanimated_1 = __importDefault(require("react-native-reanimated"));
var formula = function (args) {
    var placeholder = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        placeholder[_i - 1] = arguments[_i];
    }
    var variableMap = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (args.length > variableMap.length) {
        throw new Error("Not more than " + variableMap.length + " variables are supported per expression.");
    }
    var intersect = [];
    var variables = {};
    for (var i = 0; i < args.length; i++) {
        intersect.push(args[i]);
        if (i !== args.length - 1) {
            var variable = variableMap[i];
            intersect.push(variable);
            variables[variable] = placeholder[i];
        }
        intersect = intersect.filter(Boolean);
    }
    var ast = simple_math_ast_1.default(intersect.join(''));
    console.log(ast);
    return reduce_ast_1.default(ast, variables);
};
var value = new react_native_reanimated_1.default.Value(1);
var value2 = new react_native_reanimated_1.default.Value(2);
console.log(formula(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " + ", ""], ["", " + ", ""])), value, value2));
var templateObject_1;
