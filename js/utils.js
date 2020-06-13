export const randomInt = (min = 0, max = 1) => Math.floor(Math.random() * (max - min +1)) + min;
export const not = (x) => !x;

export const id = (x) => x;
export const compose = (...fns) => (x) => fns.reduceRight((acc, f) => f(acc), x);
export const tap = (fn) => (obj) => (fn(obj), obj);
export const log = (key, parse = id) => obj => (console.log({ [key]: parse(obj)}), obj);
export const prop = (p) => (obj) => obj[p];
export const constant = (k) => () => k;
export const last = (arr) => arr[arr.length - 1];
export const first = (arr) => arr[0];
export const dropFirst = (arr) => arr.slice(1);
export const dropLast = (arr) => arr.slice(0, arr.length - 1);
export const isEmptyArray = compose(not, Boolean, prop('length'));
export const push = (arr) => (x) => arr.concat([x]);
export const toArray = (...args) => args;

const eqPoints = (p1) => (p2) => p1[0] === p2[0] && p1[1] === p2[1];
export const includesPoint = (arr) => (p) => Boolean(arr.filter(eqPoints(p)).length);
export const addPoints = (p1) => (p2) => [p1[0] + p2[0], p1[1] + p2[1]];

const mod = (m) => (x) => ((x % m) + m) % m;
export const modPoint = (width, height) => (p) => [mod(width)(p[0]), mod(height)(p[1])];

export const chain = (f, g) => (x) => f(g(x))(x); // f(g(x), x);
export const branch = (predicate, f, g = id) => (x) => predicate(x) ? f(x) : g(x);
export const gather = (f, g, h) => (x) => f(g(x))(h(x)); // => f(g(x), h(x))
export const applySpec = (obj) => (...args) =>
    Object.entries(obj).reduce((acc, [key, fn]) => Object.assign(acc, { [key]: fn(...args) }), {} );
export const evolve = (transformation) => (data) =>
    Object.entries(transformation).reduce((acc, [k, fn]) => Object.assign(acc, { [k]: fn(data[k]) }), {});

